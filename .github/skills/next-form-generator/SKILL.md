# Next Form Generator (Most Valuable)

Generate complete CRUD forms following the templates pattern. This is the primary skill for building new features.

## What It Creates

- Full folder structure: `src/templates/[feature]/form/`
- `form-schema.ts` with Zod validation
- `form.tsx` with tabs, lazy loading, react-hook-form
- `actions.ts` with server actions
- `index.tsx` list view with DataTable
- Form sections split by responsibility

## Usage Checklist

1. **Identify the model**: Which Prisma model does this form manage? (e.g., `consultorio`, `dentista`)
2. **List the fields**: What fields from the Prisma schema need to be in the form?
3. **Define tabs**: How should fields be organized? (e.g., "dados", "telefones", "relacionamentos")
4. **Identify relationships**: Which fields are array fields linking to other models?
5. **Determine sortable/filterable columns**: What columns in the list view need sorting/filtering?

## Example: Creating a New "Servico" Form

### Step 1: Create folder structure

```
src/templates/servico/
├── index.tsx
├── form/
│   ├── index.tsx
│   ├── form.tsx
│   ├── form-schema.ts
│   ├── form-section-one.tsx
│   ├── screen-navigation.ts
│   └── tabs-trigger.ts
└── actions.ts
```

### Step 2: Generate form-schema.ts

```typescript
// src/templates/servico/form/form-schema.ts
import { z } from 'zod';
import { ERROR_MESSAGES } from '@/lib/messages/errors';

export const servicoFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: ERROR_MESSAGES.required }),
  valor_sem_nota: z.array(z.number()),
  valor_com_nota: z.array(z.number()),
});

export type tServicoFormData = z.infer<typeof servicoFormSchema>;
```

### Step 3: Generate actions.ts

See [prisma-crud-generator/SKILL.md](../prisma-crud-generator/SKILL.md)

### Step 4: Generate form.tsx

- Initialize `useForm` with schema and defaultValues
- Create tabs for logical grouping
- Integrate `useMutation` for submit handling
- Use `useQuery` for lazy-loaded related data

### Step 5: Generate list view (index.tsx)

- Use `getAll()` to fetch data
- Configure `DataTable` with proper columns
- Add Suspense boundary

## Key Points

- Use TypeScript `as const` on field tuples for proper type inference
- Always include `id: z.string().optional()` in schema for edit support
- Match field names exactly to Prisma schema (snake_case for Portuguese fields)
- Split complex forms into multiple sections for readability
- Lazy load related data only when tabs are active to optimize performance
