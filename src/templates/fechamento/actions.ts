'use server';

import { prisma } from '@/lib/prisma';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';
import { fechamentoFormSchema, tFechamentoFormData } from './form/form-schema';
import { fechamentoType, iFechamentoCloseProps } from '@/models/fechamento';
import { format, parse } from 'date-fns';

interface igetConsultorioDentistaProps {
  id: string;
}

interface iGetSumEntradasProps {
  idEntrada?: string;
  idConsultorioOrDentista?: string;
  type?: fechamentoType;
  fechamentoId?: string;
}

interface iFechamentoProps {
  id?: string;
}

interface iGetFechamentosByConsultorioOrDentistaProps {
  id: string;
  fechamentoId: string | undefined;
  type: fechamentoType;
}

interface igetConsultorioDentistaProps {
  id: string;
  isClosed: boolean;
}

interface iSaveFechamentoProps {
  data: tFechamentoFormData;
  type: fechamentoType;
  fechamentoId: string;
}

interface iGetFechamento {
  fechamentoId: string;
  id: string;
  type: fechamentoType;
}

const WHERE_SERVICOS = {
  some: {
    OR: [
      {
        fechamento: null,
      },
      { fechamento: { isSet: false } },
    ],
    AND: [
      {
        entregue: true,
      },
    ],
  },
};

async function getSumEntradas({
  idEntrada,
  idConsultorioOrDentista,
  type,
  fechamentoId,
}: iGetSumEntradasProps = {}) {
  const PATH = 'entrada';
  const dataPrismaEntrada = prisma.entrada;

  const addWhere = idEntrada
    ? {
        id: { equals: idEntrada },
      }
    : idConsultorioOrDentista && type
      ? {
          [type]: { equals: idConsultorioOrDentista },
        }
      : {};

  try {
    const entradas = await dataPrismaEntrada.findMany({
      select: {
        servicos: {
          select: {
            desconto: true,
            valor: true,
            repeticao: true,
            quantidade: true,
            entregue: true,
            fechamento: true,
          },
        },
      },
      where: {
        ...(!fechamentoId && { servicos: WHERE_SERVICOS }),
        ...addWhere,
      },
    });

    const total = entradas.reduce((acc, entrada) => {
      const valorTotal = entrada.servicos
        .filter(
          (servico) =>
            servico.entregue === true &&
            (!fechamentoId
              ? !servico.fechamento
              : servico.fechamento === fechamentoId)
        )
        .reduce((total, servico) => {
          const valorComDesconto =
            (servico.valor / 100) *
              servico.quantidade *
              (1 - servico.repeticao / 100) -
            servico.desconto / 100;
          return total + valorComDesconto;
        }, 0);
      return acc + valorTotal;
    }, 0);

    return total || 0;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

async function getSumDiscount({ id }: iFechamentoProps) {
  const PATH = 'fechamento';
  const dataPrisma = prisma.fechamento;
  try {
    const fechamento = await dataPrisma.findUnique({
      select: {
        adicional_consultorio: true,
        adicional_dentista: true,
      },
      where: {
        id,
      },
    });

    if (!fechamento) return 0;

    const discountConsultorio = fechamento.adicional_consultorio.reduce(
      (total, item) =>
        total + item.desconto.reduce((subTotal, value) => subTotal + value, 0),
      0
    );

    const discountDentista = fechamento.adicional_dentista.reduce(
      (total, item) =>
        total + item.desconto.reduce((subTotal, value) => subTotal + value, 0),
      0
    );

    return (discountConsultorio + discountDentista) / 100 || 0;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorCreatingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorCreatingPT} ${PATH}.`);
  }
}

async function getRoteiroData(id: string) {
  const PATH = 'roteiro';
  const dataPrisma = prisma.roteiro;
  try {
    const roteiroData = await dataPrisma.findUnique({
      select: { data: true },
      where: { id },
    });

    return roteiroData?.data
      ? format(parse(roteiroData.data, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
      : undefined;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

async function getServicoData(id: string) {
  const PATH = 'servico';
  const dataPrisma = prisma.servico;
  try {
    const servicoData = await dataPrisma.findUnique({
      select: { nome: true },
      where: { id },
    });
    return servicoData?.nome || 'Não encontrado';
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function getFechamentoByConsultorioDentista({
  id,
  fechamentoId,
  type,
}: iGetFechamento) {
  const PATH = 'fechamento';
  const dataPrisma = prisma.fechamento;
  try {
    const fechamento = await dataPrisma.findUnique({
      select: {
        ...(type === 'consultorio'
          ? { adicional_consultorio: true }
          : { adicional_dentista: true }),
      },
      where: {
        id: fechamentoId,
        ...(type === 'consultorio'
          ? {
              adicional_consultorio: {
                some: { idConsultorio: { equals: id } },
              },
            }
          : {
              adicional_dentista: {
                some: { idDentista: { equals: id } },
              },
            }),
      },
    });

    if (!fechamento) return null;

    // Transform here before returning
    const items =
      type === 'consultorio'
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fechamento as any).adicional_consultorio
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fechamento as any).adicional_dentista;

    const item = items?.[0];
    if (!item) return null;

    return {
      id: type === 'consultorio' ? item.idConsultorio : item.idDentista,
      desconto: item.desconto,
      observacao: item.observacao,
    };
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorCreatingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorCreatingPT} ${PATH}.`);
  }
}

export async function getFechamentos(year: number) {
  const PATH = 'fechamento';
  const dataPrisma = prisma.fechamento;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  try {
    const fechamentos = await dataPrisma.findMany({
      select: {
        id: true,
        fechado: true,
        valor: true,
        data: true,
      },
      where: {
        data: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
        fechado: true,
      },
      orderBy: { data: 'desc' },
    });

    if (currentYear !== year && !fechamentos.length) return [];

    const newFechamentos = await Promise.all(
      fechamentos.map(async (fechamento) => {
        const discount = await getSumDiscount({ id: fechamento.id });
        return {
          ...fechamento,
          valor: fechamento.valor - discount,
        };
      })
    );

    if (currentYear !== year && fechamentos.length) return newFechamentos;

    const sumEntradas = await getSumEntradas();

    if (currentMonth === 1)
      return [
        {
          id: '01' + year.toString(),
          data: new Date(Date.UTC(year, 0, 1)),
          fechado: false,
          valor: sumEntradas,
        },
      ];

    const getLastMonthClosed = fechamentos.length
      ? fechamentos[0]?.data.getUTCMonth() + 1
      : currentMonth - 1;
    const date = new Date(Date.UTC(year, getLastMonthClosed, 1));

    const monthString = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const monthOpened = [
      {
        id: monthString + year.toString(),
        data: date,
        fechado: false,
        valor: sumEntradas,
      },
    ];

    return [...monthOpened, ...newFechamentos];
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function getConsultorioDentista({
  id,
  isClosed,
}: igetConsultorioDentistaProps) {
  const PATH = 'entrada';
  const dataPrismaEntrada = prisma.entrada;
  const dataPrismaConsultorio = prisma.consultorio;
  const dataPrismaDentista = prisma.dentista;

  const addWhere = isClosed
    ? {
        servicos: { some: { fechamento: { equals: id } } },
      }
    : {
        servicos: WHERE_SERVICOS,
      };

  try {
    const entradas = await dataPrismaEntrada.findMany({
      select: {
        consultorio: true,
        dentista: true,
      },
      where: addWhere,
    });

    const uniqueEntradas = Array.from(
      new Map(
        entradas.map((item) => [`${item.consultorio}_${item.dentista}`, item])
      ).values()
    );

    const listAll = await Promise.all(
      uniqueEntradas.map(async (entrada) => {
        const [consultorioData] = await Promise.all([
          dataPrismaConsultorio.findUnique({
            select: { id: true, nome: true, cobranca: true },
            where: { id: entrada.consultorio },
          }),
        ]);
        return {
          id:
            consultorioData?.cobranca === 'consultorio'
              ? `c${entrada.consultorio}`
              : entrada.dentista,
          nome: consultorioData?.nome || 'Não encontrado',
          cobrança: consultorioData?.cobranca || 'Não encontrado',
        };
      })
    );

    const listConsultorios = Array.from(
      listAll
        .filter((item) => item.cobrança === 'consultorio')
        .reduce((map, item) => {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
          return map;
        }, new Map())
        .values()
    );

    const uniqueDentistas = Array.from(
      listAll
        .filter((item) => item.cobrança === 'dentista')
        .reduce((map, item) => {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
          return map;
        }, new Map())
        .values()
    );

    const listDentistas = await Promise.all(
      uniqueDentistas.map(async ({ id }) => {
        const dentistaData = await dataPrismaDentista.findUnique({
          select: { nome: true },
          where: { id },
        });
        return {
          id: `d${id}`,
          nome: dentistaData?.nome,
          cobrança: 'dentista',
        };
      })
    );

    return [...listConsultorios, ...listDentistas];
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function getFechamentosByConsultorioOrDentista({
  id: actualId,
  fechamentoId,
  type,
}: iGetFechamentosByConsultorioOrDentistaProps) {
  const PATH = 'entrada';
  const dataPrisma = prisma.fechamento;
  const dataPrismaEntrada = prisma.entrada;
  const dataPrismaConsultorio = prisma.consultorio;
  const dataPrismaDentista = prisma.dentista;

  const fechamento = await dataPrisma.findMany({
    select: {
      data: true,
    },
    where: {
      id: fechamentoId,
    },
  });

  const addWhere = fechamentoId
    ? {
        servicos: { some: { fechamento: { equals: fechamentoId } } },
        [type]: { equals: actualId },
      }
    : {
        servicos: WHERE_SERVICOS,
        [type]: { equals: actualId },
      };

  try {
    const getEntradas = await dataPrismaEntrada.findMany({
      select: {
        id: true,
        consultorio: true,
        dentista: true,
        paciente: true,
        servicos: {
          select: {
            servico: true,
            roteiro: true,
            desconto: true,
            valor: true,
            repeticao: true,
            quantidade: true,
            fechamento: true,
            entregue: true,
          },
        },
      },
      where: addWhere,
      orderBy: { created_at: 'asc' },
    });

    const entradas = getEntradas.map((entrada) => ({
      ...entrada,
      servicos: entrada.servicos.filter((servico) =>
        fechamentoId
          ? servico.fechamento === fechamentoId
          : !!servico.fechamento === false && !!servico.entregue
      ),
    }));

    const sumEntradas = await getSumEntradas({
      idConsultorioOrDentista: actualId,
      type,
      fechamentoId,
    });

    if (type === 'consultorio') {
      const consultorioData = await dataPrismaConsultorio.findUnique({
        select: { id: true, nome: true },
        where: { id: actualId },
      });

      const results = await Promise.all(
        entradas.map(async (entrada) => {
          const sumEntrada = await getSumEntradas({
            idEntrada: entrada.id,
            fechamentoId,
          });

          const [dentistaData, servicosData] = await Promise.all([
            dataPrismaDentista.findUnique({
              select: { nome: true },
              where: { id: entrada.dentista },
            }),
            // Fetch all service names for this entrada
            Promise.all(
              entrada.servicos.map(async (servico) => {
                const servicoData = await getServicoData(servico.servico);
                const roteiroData = await getRoteiroData(servico.roteiro!);

                return {
                  id: servico.servico,
                  data: roteiroData,
                  nome: servicoData,
                  valor: servico.valor,
                  quantidade: servico.quantidade,
                  repeticao: servico.repeticao,
                  desconto: servico.desconto,
                  total:
                    (servico.valor / 100) *
                      servico.quantidade *
                      (1 - servico.repeticao / 100) -
                    servico.desconto / 100,
                };
              })
            ),
          ]);

          return {
            id: entrada.id,
            dentista: dentistaData?.nome || 'Não encontrado',
            paciente: entrada.paciente,
            servicos: servicosData,
            sumEntrada: sumEntrada,
          };
        })
      );

      return {
        type,
        nome: consultorioData?.nome || 'Não encontrado',
        itens: results,
        sumEntradas,
        fechamentoData: fechamento ? fechamento[0]?.data : null,
      };
    } else {
      const dentistaData = await dataPrismaDentista.findUnique({
        select: { id: true, nome: true },
        where: { id: actualId },
      });

      const results = await Promise.all(
        entradas.map(async (entrada) => {
          const sumEntrada = await getSumEntradas({
            idEntrada: entrada.id,
            fechamentoId,
          });

          const [consultorioData, servicosData] = await Promise.all([
            dataPrismaConsultorio.findUnique({
              select: { nome: true },
              where: { id: entrada.consultorio },
            }),
            // Fetch all service names for this entrada
            Promise.all(
              entrada.servicos.map(async (servico) => {
                const servicoData = await getServicoData(servico.servico);
                const roteiroData = await getRoteiroData(servico.roteiro!);

                return {
                  id: servico.servico,
                  data: roteiroData,
                  nome: servicoData,
                  valor: servico.valor,
                  quantidade: servico.quantidade,
                  repeticao: servico.repeticao,
                  desconto: servico.desconto,
                  total:
                    (servico.valor / 100) *
                      servico.quantidade *
                      (1 - servico.repeticao / 100) -
                    servico.desconto / 100,
                };
              })
            ),
          ]);

          return {
            id: entrada.id,
            consultorio: consultorioData?.nome || 'Não encontrado',
            paciente: entrada.paciente,
            servicos: servicosData,
            sumEntrada: sumEntrada,
            fechamentoData: fechamento ? fechamento[0]?.data : null,
          };
        })
      );

      return {
        type,
        nome: dentistaData?.nome || 'Não encontrado',
        itens: results,
        sumEntradas,
        fechamentoData: fechamento ? fechamento[0]?.data : null,
      };
    }
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function downloadFechamento(id: string) {
  const PATH = 'download fechamento';

  try {
    const uniqueEntradas = await getConsultorioDentista({
      id,
      isClosed: true,
    });

    const allFechamentos = await Promise.all(
      uniqueEntradas.map(async (entrada) => {
        const fechamentoData = await getFechamentoByConsultorioDentista({
          id: entrada.id.substring(1),
          fechamentoId: id,
          type: entrada.cobrança,
        });

        const result = await getFechamentosByConsultorioOrDentista({
          id: entrada.id.substring(1),
          fechamentoId: id,
          type: entrada.cobrança,
        });

        return {
          ...result,
          desconto: fechamentoData?.desconto,
          observacao: fechamentoData?.observacao,
          fechamentoData: result.fechamentoData ?? null,
        };
      })
    );

    return allFechamentos;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function handleFechamento({
  id,
  date,
}: iFechamentoCloseProps = {}) {
  const PATH = 'fechamento';
  const dataPrisma = prisma.fechamento;
  const dataPrismaEntrada = prisma.entrada;

  let addWhere;
  let addData;

  try {
    if (!id) {
      if (!date) throw new Error(ERROR_MESSAGES.dateNotFound);
      const valorToSave = await getSumEntradas();
      const { id: fechamentoId } = await dataPrisma.create({
        data: {
          data: date,
          fechado: true,
          valor: valorToSave,
        },
      });

      addWhere = {
        OR: [
          {
            fechamento: null,
          },
          { fechamento: { isSet: false } },
        ],
        AND: [
          {
            entregue: true,
          },
        ],
      };

      addData = { fechamento: fechamentoId };
    } else {
      await dataPrisma.delete({
        where: {
          id,
        },
      });

      addWhere = { fechamento: id };
      addData = { fechamento: null };
    }

    await dataPrismaEntrada.updateMany({
      data: {
        servicos: {
          updateMany: {
            where: addWhere,
            data: addData,
          },
        },
      },
    });

    revalidatePath(`/${PATH}`);
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGenericEN} ${PATH}:`, error);
    return { error: `${ERROR_MESSAGES.errorGenericPT} ${PATH}` };
  }
}

export async function saveFechamento({
  data,
  type,
  fechamentoId,
}: iSaveFechamentoProps) {
  const PATH = 'fechamento';
  const dataPrisma = prisma.fechamento;

  try {
    const parsedData = fechamentoFormSchema.parse(data);
    const { id, desconto, observacao } = parsedData;

    const fieldName =
      type === 'consultorio' ? 'adicional_consultorio' : 'adicional_dentista';
    const whereField = type === 'consultorio' ? 'idConsultorio' : 'idDentista';

    // First, check if the item exists
    const existingFechamento = await dataPrisma.findUnique({
      where: { id: fechamentoId },
      select: {
        [fieldName]: true,
      },
    });

    const itemExists = existingFechamento?.[fieldName]?.some(
      (item: unknown) => {
        const record = item as Record<string, unknown>;
        return record[whereField] === id;
      }
    );

    if (itemExists) {
      // Update existing
      await dataPrisma.update({
        where: { id: fechamentoId },
        data: {
          [fieldName]: {
            updateMany: {
              where: { [whereField]: id },
              data: { observacao, desconto },
            },
          },
        },
      });
    } else {
      // Add new
      await dataPrisma.update({
        where: { id: fechamentoId },
        data: {
          [fieldName]: {
            push: {
              [whereField]: id,
              observacao,
              desconto,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorCreatingEN} ${PATH}:`, error);
    return { error: `${ERROR_MESSAGES.errorCreatingPT} ${PATH}` };
  }
}
