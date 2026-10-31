'use server';

import { prisma } from '@/lib/prisma';
import { roteiroFormSchema, tRoteiroFormData } from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';
import { iRoteiroEntradas } from '@/models/roteiro-entradas';

const PATH = 'roteiro';
const dataPrisma = prisma.roteiro;

interface iUpdateEntradasProps {
  idRoteiro: string;
  type: 'update' | 'delete';
}

export async function getRoteiros(
  filter: 'all' | 'sim' | 'nao' = 'all',
  createdAtFilter?: {
    enabled: boolean;
    month: number;
    year: number;
  }
) {
  try {
    const monthRangeStart = new Date(
      Date.UTC(
        createdAtFilter?.year ?? new Date().getUTCFullYear(),
        (createdAtFilter?.month ?? new Date().getUTCMonth() + 1) - 1,
        1
      )
    );
    const monthRangeEnd = new Date(
      Date.UTC(
        createdAtFilter?.year ?? new Date().getUTCFullYear(),
        createdAtFilter?.month ?? new Date().getUTCMonth() + 1,
        1
      )
    );

    const dateRange = createdAtFilter?.enabled
      ? {
          gte: `${createdAtFilter.year}-${String(
            createdAtFilter.month
          ).padStart(2, '0')}-01`,
          lt: `${createdAtFilter.year}-${String(
            createdAtFilter.month + 1
          ).padStart(2, '0')}-01`,
        }
      : undefined;

    const createdAtRange = createdAtFilter?.enabled
      ? {
          gte: monthRangeStart,
          lt: monthRangeEnd,
        }
      : undefined;

    const roteiros = await dataPrisma.findMany({
      select: {
        id: true,
        data: true,
        entregue: true,
        created_at: true,
      },
      where: {
        ...(filter === 'all'
          ? {}
          : filter === 'sim'
            ? { entregue: true }
            : {
                OR: [{ entregue: false }, { entregue: null }],
              }),
        ...(createdAtFilter?.enabled
          ? {
              OR: [
                ...(dateRange ? [{ data: dateRange }] : []),
                ...(createdAtRange ? [{ created_at: createdAtRange }] : []),
              ],
            }
          : {}),
      },
      orderBy: { data: 'desc' },
    });

    return roteiros.map((roteiro) => ({
      id: roteiro.id,
      data: roteiro.data || '—',
      created_at: roteiro.created_at || null,
      entregue: roteiro.entregue ? 'sim' : 'não',
    }));
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function saveRoteiro(
  data: tRoteiroFormData,
  entradas: iRoteiroEntradas[] | undefined
) {
  const dataPrismaEntrada = prisma.entrada;

  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = roteiroFormSchema.parse(dataWithoutId);

    let idRoteiro;

    if (id) {
      idRoteiro = id;
      await dataPrisma.update({
        where: { id },
        data: { ...parsedData },
      });
    } else {
      const { id } = await dataPrisma.create({
        data: parsedData,
      });
      idRoteiro = id;
    }

    if (entradas) {
      await updateEntradas({ idRoteiro, type: 'update' });

      const promises = [];
      for (const entrada of entradas) {
        if (entrada.idServicoEntrada && entrada.idServicoEntrada.length) {
          promises.push(
            dataPrismaEntrada.updateMany({
              where: {
                id: entrada.idEntrada,
              },
              data: {
                servicos: {
                  updateMany: {
                    where: {
                      idServicoEntrada: {
                        in: entrada.idServicoEntrada,
                      },
                    },
                    data: { entregue: parsedData.entregue, roteiro: idRoteiro },
                  },
                },
              },
            })
          );
        }
      }
      if (promises.length) await Promise.all(promises);
    }

    revalidatePath(`/${PATH}`);
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorCreatingEN} ${PATH}:`, error);
    return { error: `${ERROR_MESSAGES.errorCreatingPT} ${PATH}` };
  }
}

export async function getEntradas(idRoteiro: string) {
  const PATHEntrada = 'entrada';
  const dataPrismaEntrada = prisma.entrada;

  try {
    const entradas = await dataPrismaEntrada.findMany({
      select: {
        id: true,
        consultorio: true,
        dentista: true,
        paciente: true,
        servicos: {
          select: {
            idServicoEntrada: true,
            servico: true,
            roteiro: true,
            data_saida: true,
            entregue: true,
            fechamento: true,
          },
        },
      },
      where: {
        servicos: {
          some: {
            AND: [
              {
                data_saida: { not: null },
              },
            ],
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });

    const filteredEntradas = entradas
      .map((entrada) => ({
        ...entrada,
        servicos: entrada.servicos.filter(
          (servico) =>
            (!!servico.data_saida && !servico.roteiro) ||
            (idRoteiro && servico.roteiro === idRoteiro)
        ),
      }))
      .filter((entrada) => entrada.servicos.length > 0);

    const results = await Promise.all(
      filteredEntradas.map(async (entrada) => {
        const [consultorioData, dentistaData, servicosData] = await Promise.all(
          [
            prisma.consultorio.findUnique({
              select: { nome: true },
              where: { id: entrada.consultorio },
            }),
            prisma.dentista.findUnique({
              select: { nome: true },
              where: { id: entrada.dentista },
            }),
            // Fetch all service names for this entrada
            Promise.all(
              entrada.servicos.map(async (servico) => {
                const servicoData = await prisma.servico.findUnique({
                  select: { nome: true },
                  where: { id: servico.servico },
                });

                return {
                  id: servico.idServicoEntrada,
                  nome: servicoData?.nome || 'Não encontrado',
                  roteiro: servico.roteiro,
                  fechamento: servico.fechamento,
                };
              })
            ),
          ]
        );

        return {
          id: entrada.id,
          consultorio: consultorioData?.nome || 'Não encontrado',
          dentista: dentistaData?.nome || 'Não encontrado',
          paciente: entrada.paciente,
          servicos: servicosData,
        };
      })
    );

    return results;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATHEntrada}:`, error);
    return { error: `${ERROR_MESSAGES.errorGettingPT} ${PATHEntrada}:` };
  }
}

export async function getEntradasServicos(
  entradas: iRoteiroEntradas[] | undefined
) {
  const PATHEntrada = 'entrada';
  const dataPrismaEntrada = prisma.entrada;

  if (!entradas) return;

  try {
    const entradasCurrent = await dataPrismaEntrada.findMany({
      select: {
        id: true,
        consultorio: true,
        dentista: true,
        paciente: true,
        servicos: {
          select: {
            idServicoEntrada: true,
            servico: true,
          },
        },
      },
      where: {
        id: {
          in: entradas.map((item) => item.idEntrada),
        },
      },
      orderBy: { created_at: 'asc' },
    });

    const results = await Promise.all(
      entradasCurrent.map(async (entrada) => {
        const [consultorioData, dentistaData] = await Promise.all([
          prisma.consultorio.findUnique({
            select: {
              nome: true,
              cep: true,
              numero: true,
              complemento: true,
              cep_entrega: true,
              numero_entrega: true,
              complemento_entrega: true,
            },

            where: { id: entrada.consultorio },
          }),
          prisma.dentista.findUnique({
            select: { nome: true },
            where: { id: entrada.dentista },
          }),
        ]);

        const matchingEntrada = entradas.find(
          (e) => e.idEntrada === entrada.id
        );

        let servicosData: { id: string; nome: string }[] = [];

        if (matchingEntrada) {
          const matchedServices = entrada.servicos.filter((service) =>
            matchingEntrada.idServicoEntrada.includes(service.idServicoEntrada)
          );

          servicosData = await Promise.all(
            matchedServices.map(async ({ servico }) => {
              const servicoData = await prisma.servico.findUnique({
                select: { nome: true },
                where: { id: servico }, // servico is a string
              });

              return {
                id: servico, // Using servicoId as the id since that's what you have
                nome: servicoData?.nome || 'Não encontrado',
              };
            })
          );
        }

        const cep = consultorioData?.cep_entrega || consultorioData?.cep || '';
        let result;
        if (!!cep) {
          const cleanedCep = cep?.replace(/\D/g, '');

          const response = await fetch(
            `https://viacep.com.br/ws/${cleanedCep}/json/`
          );

          result = await response.json();
        }

        return {
          id: entrada.id,
          consultorio: consultorioData?.nome || 'Consultório não encontrado',
          cep: cep,
          endereco: String(result?.logradouro) || 'Endereço não encontrado',
          complemento:
            consultorioData?.complemento_entrega ||
            consultorioData?.complemento ||
            '',
          numero:
            consultorioData?.numero_entrega || consultorioData?.numero || '',
          bairro: String(result?.bairro) || 'Bairro não encontrado',
          dentista: dentistaData?.nome || 'Não encontrado',
          paciente: entrada.paciente,
          servicos: servicosData,
        };
      })
    );

    return results;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATHEntrada}:`, error);
    return { error: `${ERROR_MESSAGES.errorGettingEN} ${PATHEntrada}:` };
  }
}

export async function updateEntradas({
  idRoteiro,
  type,
}: iUpdateEntradasProps) {
  const PATH = 'roteiro';
  const dataPrismaEntrada = prisma.entrada;

  const dataBody = {
    roteiro: null,
    entregue: null,
    ...(type === 'delete' && {
      fechamento: null,
    }),
  };

  try {
    await dataPrismaEntrada.updateMany({
      where: {
        servicos: {
          some: {
            roteiro: idRoteiro,
          },
        },
      },
      data: {
        servicos: {
          updateMany: {
            where: {
              roteiro: idRoteiro,
            },
            data: dataBody,
          },
        },
      },
    });
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorUpdatingEN} ${PATH}:`, error);
    return { error: `${ERROR_MESSAGES.errorUpdatingPT} ${PATH}` };
  }
}
