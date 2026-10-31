# Prisma CRUD Generator

Generate type-safe server actions following your save/remove pattern.

## What It Creates

- `save[Model]()` action with validation and error handling
- `remove[Model]()` action with revalidation
- Proper try/catch wrapping
- `{ error: string }` return on failure

## Pattern Template

```typescript
'use server';
import { prisma } from '@/lib/prisma';
import { [model]FormSchema, t[Model]FormData } from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = '[model]';
const dataPrisma = prisma.[model];

export async function save[Model](data: t[Model]FormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = [model]FormSchema.parse(dataWithoutId);

    if (id) {
      await dataPrisma.update({
        where: { id },
        data: parsedData,
      });
    } else {
      await dataPrisma.create({
        data: parsedData,
      });
    }
    revalidatePath(`/${PATH}`);
  } catch (error) {
    console.error(`Error creating ${PATH}:`, error);
    return { error: `Erro ao salvar ${PATH}` };
  }
}

export async function remove[Model]({ id }: { id: string }) {
  try {
    await dataPrisma.delete({
      where: { id },
    });
    revalidatePath(`/${PATH}`);
  } catch (error) {
    console.error(`Error deleting ${PATH}:`, error);
    return { error: `Erro ao deletar ${PATH}` };
  }
}
```

## Customization Points

- **Model name**: Replace `[model]` with actual model (lowercase: `servico`, `dentista`)
- **Validation**: Add custom `.refine()` for complex validations (e.g., CPF, date ranges)
- **Relationships**: Handle array fields properly (e.g., `dentistas: z.array(z.string())`)
- **Timestamps**: Model automatically manages `created_at` and `updated_at`

## Best Practices

- Always separate `id` from data before validation: `const { id, ...dataWithoutId } = data`
- Use lowercase model names for Prisma client access
- Validate with Zod schema before persisting
- Call `revalidatePath()` with correct path for Next.js caching
- Return descriptive error messages in Portuguese
- Log errors with context for debugging
