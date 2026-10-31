'use server';

import { prisma } from '@/lib/prisma';
import { secretariaFormSchema, tSecretariaFormData } from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = 'secretaria';
const dataPrisma = prisma.secretaria;

export async function saveSecretaria(data: tSecretariaFormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = secretariaFormSchema.parse(dataWithoutId);

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
