'use server';

import { ModelKey, prisma } from '@/lib/prisma';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { iGetProps } from '@/models/get';
import { revalidatePath } from 'next/cache';

type NormalResult<F extends readonly string[]> = Array<
  { id: string } & { [K in F[number]]: string }
>;

type ListSheetResult = Array<{
  id: string;
  value: string;
}>;

type GetAllReturn<
  F extends readonly string[],
  L extends boolean | undefined,
> = L extends true ? ListSheetResult : NormalResult<F>;

interface iCommon {
  modelKey: ModelKey;
}

interface iGetAllProps<
  F extends readonly string[],
  L extends boolean | undefined = undefined,
> extends iCommon {
  fields: F;
  listSheet?: L;
}

interface iGetByIdProps extends iCommon {
  fields: iGetProps;
}

interface iRemoveProps extends iCommon {
  id: string;
}

export async function getAll<
  F extends readonly string[],
  L extends boolean | undefined = undefined,
>({
  modelKey,
  fields,
  listSheet,
}: iGetAllProps<F, L>): Promise<GetAllReturn<F, L>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPrisma = prisma[modelKey as keyof typeof prisma] as any;

  const body = {
    ...{ id: true },
    ...Object.fromEntries(fields.map((field) => [field, true])),
  };

  try {
    const results = (await dataPrisma.findMany({
      select: body,
      orderBy: { updated_at: 'desc' },
    })) as Array<Record<string, unknown> & { id: string }>;

    if (fields.length === 1 && listSheet) {
      const field = fields[0];
      return results.map((item) => ({
        id: item.id,
        value: item[field as keyof typeof item],
      })) as GetAllReturn<F, L>;
    }

    return results as GetAllReturn<F, L>;
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${modelKey}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${modelKey}.`);
  }
}

export async function getById(data: iGetByIdProps) {
  const { modelKey, fields } = data;
  const { id } = fields;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPrisma = prisma[modelKey as keyof typeof prisma] as any;

  try {
    if (id.length !== 24) return {};
    // Get single record
    const response = await dataPrisma.findUnique({
      where: { id },
    });

    return response ?? {};
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorGettingEN} ${modelKey}:`, error);
    throw new Error(`${ERROR_MESSAGES.errorGettingPT} ${modelKey}.`);
  }
}

export async function remove(data: iRemoveProps) {
  const { id, modelKey } = data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPrisma = prisma[modelKey as keyof typeof prisma] as any;

  try {
    await dataPrisma.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/${modelKey}`);
  } catch (error) {
    console.error(`${ERROR_MESSAGES.errorDeletingEN} ${modelKey}:`, error);
    return { error: `${ERROR_MESSAGES.errorDeletingPT} ${modelKey}:` };
  }
}
