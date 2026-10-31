'use server';

import { prisma } from '@/lib/prisma';
import {
  funcionarioFormSchema,
  tFuncionarioFormData,
} from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = 'funcionario';
const dataPrisma = prisma.funcionario;

export async function saveFuncionario(data: tFuncionarioFormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = funcionarioFormSchema.parse(dataWithoutId);

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
