'use server';

import { prisma } from '@/lib/prisma';
import { servicoFormSchema, tServicoFormData } from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = 'servico';
const dataPrisma = prisma.servico;

export async function saveServico(data: tServicoFormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = servicoFormSchema.parse(dataWithoutId);

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
