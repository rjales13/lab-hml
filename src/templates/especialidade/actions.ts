'use server';

import { prisma } from '@/lib/prisma';
import {
  especialidadeFormSchema,
  tEspecialidadeFormData,
} from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = 'especialidade';
const dataPrisma = prisma.especialidade;

export async function saveEspecialidade(data: tEspecialidadeFormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = especialidadeFormSchema.parse(dataWithoutId);

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
