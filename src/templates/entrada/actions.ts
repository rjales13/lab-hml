'use server';

import { prisma } from '@/lib/prisma';
import { entradaFormSchema, tEntradaFormData } from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = 'entrada';
const dataPrisma = prisma.entrada;

export async function saveEntrada(data: tEntradaFormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = entradaFormSchema.parse(dataWithoutId);

    if (id) {
      await dataPrisma.update({
        where: { id },
        data: { ...parsedData },
      });
    } else {
      await dataPrisma.create({
        data: parsedData,
      });
    }
    revalidatePath(`/${PATH}`);
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorCreatingEN} ${PATH}:`, error);
    return { error: `${ERROR_MESSAGES.errorCreatingPT} ${PATH}` };
  }
}

export async function getEntradas(
  filter: 'pending' | 'all' = 'pending',
  createdAtFilter?: {
    enabled: boolean;
    month: number;
    year: number;
  }
) {
  try {
    const createdAtWhere = createdAtFilter?.enabled
      ? {
          gte: new Date(
            Date.UTC(createdAtFilter.year, createdAtFilter.month - 1, 1)
          ),
          lt: new Date(
            Date.UTC(createdAtFilter.year, createdAtFilter.month, 1)
          ),
        }
      : undefined;

    const entradas = await dataPrisma.findMany({
      select: {
        id: true,
        consultorio: true,
        dentista: true,
        paciente: true,
        created_at: true,
      },
      where: {
        ...(filter === 'pending'
          ? {
              servicos: {
                some: {
                  OR: [{ data_saida: null }, { data_saida: { isSet: false } }],
                },
              },
            }
          : {}),
        ...(createdAtWhere ? { created_at: createdAtWhere } : {}),
      },
      orderBy: { created_at: 'desc' },
    });

    const results = await Promise.all(
      entradas.map(async (entrada) => {
        const [consultorioData, dentistaData] = await Promise.all([
          prisma.consultorio.findUnique({
            select: { nome: true },
            where: { id: entrada.consultorio },
          }),
          prisma.dentista.findUnique({
            select: { nome: true },
            where: { id: entrada.dentista },
          }),
        ]);

        return {
          id: entrada.id,
          consultorio: consultorioData?.nome || 'Não encontrado',
          dentista: dentistaData?.nome || 'Não encontrado',
          paciente: entrada.paciente,
          created_at: entrada.created_at ?? null,
        };
      })
    );

    return results;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATH}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATH}.`);
  }
}

export async function getServicos(type: string) {
  const PATHServico = 'servico';
  const dataPrismaServico = prisma.servico;

  try {
    const results = await dataPrismaServico.findMany({
      select: {
        id: true,
        nome: true,
        valor_sem_nota: true,
        valor_com_nota: true,
        valor_unicid: true,
        valor_pinheros: true,
      },
      orderBy: { nome: 'asc' },
    });

    return results.map((item) => ({
      id: item.id,
      value: item.nome,
      valor:
        type === 'sem-nota'
          ? item.valor_sem_nota[0]
          : type === 'com-nota'
            ? item.valor_com_nota[0]
            : type === 'unicid'
              ? item.valor_unicid[0]
              : item.valor_pinheros[0],
    }));
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATHServico}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATHServico}.`);
  }
}

export async function getDentistasByConsultorio(consultorioId: string) {
  const PATHDentista = 'dentista';
  const dataPrismaConsultorio = prisma.consultorio;
  const dataPrismaDentista = prisma.dentista;

  try {
    const consultorios = await dataPrismaConsultorio.findMany({
      select: {
        dentistas: true,
      },
      where: { id: consultorioId },
    });

    const results = await dataPrismaDentista.findMany({
      select: {
        id: true,
        nome: true,
      },
      where: {
        id: { in: consultorios[0]?.dentistas.map((dentista) => dentista) },
      },
      orderBy: { nome: 'asc' },
    });

    return results.map((item) => ({
      id: item.id,
      value: item.nome,
    }));
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${PATHDentista}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${PATHDentista}.`);
  }
}

export async function getValoresType(
  consultorioId: string,
  dentistaId: string
) {
  const path = 'valores';
  const dataPrisma = prisma.valores;

  try {
    const results = await dataPrisma.findFirst({
      select: {
        tipo: true,
      },
      where: { consultorio: consultorioId, dentista: dentistaId },
    });

    return results?.tipo || '';
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${path}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${path}.`);
  }
}

export async function saveValoresType(
  consultorioId: string,
  dentistaId: string,
  tipo: string
) {
  const path = 'valores';
  const dataPrisma = prisma.valores;

  try {
    const existingRecord = await dataPrisma.findFirst({
      where: { consultorio: consultorioId, dentista: dentistaId },
    });

    if (existingRecord) {
      await dataPrisma.update({
        where: { id: existingRecord.id },
        data: { tipo },
      });
    } else {
      await dataPrisma.create({
        data: { consultorio: consultorioId, dentista: dentistaId, tipo },
      });
    }
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorCreatingEN} ${path}:`, error);
    return { error: `${ERROR_MESSAGES.errorCreatingPT} ${path}` };
  }
}
