# Copilot Instructions

## Stack and architecture

- Next.js App Router project using TypeScript (`strict: true`) and React 19.
- Prisma is the data layer; server operations are implemented as server actions.
- Prefer existing patterns before introducing new abstractions.

## Project structure to follow

- `src/app`: routes, layouts, route groups, and server actions.
  - Uses route groups like `src/app/(auth)` and nested feature routes.
- `src/templates/<feature>`: feature-level screens/templates and feature actions.
  - Common pattern: `index.tsx`, `actions.ts`, `form/*` split into sections.
- `src/components`: reusable UI and composition components.
  - `src/components/ui`: primitive UI components (Radix/shadcn-style).
- `src/hooks`: shared hooks grouped by concern (`mutation`, `get-cep`, etc.).
- `src/lib`: cross-cutting utilities/messages/auth/prisma helpers.
- `src/models`: shared TS model/type contracts.

## Naming conventions observed in this codebase

- File names are usually **kebab-case**: `controlled-input.tsx`, `form-section-one.tsx`.
- Component exports are **PascalCase**: `ControlledInput`, `DataTable`, `Form`.
- Hooks use `use...` naming: `useMutation`, `useGetCep`.
- Internal interfaces/types commonly use prefixes:
  - `i...` for interfaces (example: `iControlledInputProps`)
  - `t...` for type aliases (example: `tFuncionarioFormData`)
- Domain fields are in Portuguese and often snake_case when matching data model (`data_nascimento`, `updated_at`). Preserve existing field names.

## Component and code patterns

- Explicitly mark runtime boundary:
  - `'use client'` for interactive/client components.
  - `'use server'` for server actions.
- Prefer **named exports** over default exports.
- Use `@/` path alias for imports (configured in `tsconfig.json`).
- Forms are typically built with:
  - `react-hook-form`
  - `zod` schema + inferred type
  - sectionized form components inside `templates/<feature>/form`.
- Reuse shared building blocks (`Navigation`, `ListTabContent`, `ControlledInput`, `DataTable`) before creating new ones.

## Styling conventions

- Tailwind CSS utility classes are the default styling approach.
- Keep classes readable and consistent with existing component patterns.
- Respect current UI stack (Radix + shadcn-style primitives + `class-variance-authority` where already used).

## ESLint rules in this repo

- ESLint is flat-config via `eslint.config.mjs`.
- Extends:
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
- Global ignores include:
  - `.next/**`
  - `out/**`
  - `build/**`
  - `next-env.d.ts`
- Follow existing lint suppressions sparingly and only when justified.

## Prettier rules in this repo

From `.prettierrc`:

- `semi: true`
- `singleQuote: true`
- `tabWidth: 2`
- `trailingComma: "es5"`
- `printWidth: 80`
- `bracketSpacing: true`
- Plugin: `prettier-plugin-tailwindcss`

## Safe change guidelines for Copilot

- Make minimal, focused edits; avoid broad refactors unless requested.
- Preserve existing domain language (Portuguese labels/fields/messages).
- Keep public contracts stable (props/types/action signatures) unless explicitly asked.
- When adding new feature code, mirror the nearest feature template structure.
- Prefer consistency with surrounding files over generic framework defaults.

---

# SKILLS

## Prisma & Data Layer

### Setup

- Database client singleton in `src/lib/prisma/index.ts`.
- Schema in `prisma/schema.prisma` (MongoDB provider).
- Models use auto-generated MongoDB ObjectIds with `created_at` + auto-updating `updated_at` timestamps.
- Available models: `consultorio`, `dentista`, `especialidade`, `secretaria`, `funcionario`, `funcao`, `servico`, `entrada`, `roteiro`, `fechamento`.

### Usage

```typescript
import { prisma } from '@/lib/prisma';

// In server actions or server components
const records = await prisma.consultorio.findMany();
const single = await prisma.consultorio.findUnique({ where: { id } });
await prisma.consultorio.create({ data: { ...fields } });
await prisma.consultorio.update({ where: { id }, data: { ...fields } });
await prisma.consultorio.delete({ where: { id } });
```

### Best Practices

- Always wrap mutations in try/catch.
- Return `{ error: string }` on failures.
- Call `revalidatePath()` after mutations to refresh cached data.
- Use server actions (`'use server'`) for all data mutations.

---

## React Hook Form & Zod Validation

### Schema Definition

Define in `templates/<feature>/form/form-schema.ts`:

```typescript
import { z } from 'zod';
import { ERROR_MESSAGES } from '@/lib/messages/errors';

export const consultorioFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: ERROR_MESSAGES.required }),
  email: z.string().email(ERROR_MESSAGES.invalidEmail),
  telefones: z.array(z.string()),
  dentistas: z.array(z.string()),
  secretarias: z.array(z.string()),
});

export type tConsultorioFormData = z.infer<typeof consultorioFormSchema>;
```

### Form Setup

```typescript
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { consultorioFormSchema, tConsultorioFormData } from './form-schema';

const methods = useForm<tConsultorioFormData>({
  resolver: zodResolver(consultorioFormSchema),
  defaultValues: {
    id: data.id || '',
    nome: data.nome || '',
    email: data.email || '',
    telefones: data.telefones || [],
    // ...
  },
});

const handleSubmit = async (formData: tConsultorioFormData) => {
  const result = await saveConsultorio(formData);
  if (result?.error) {
    toast.error(result.error);
  } else {
    toast.success('Salvo com sucesso');
    router.push('/consultorio');
  }
};

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(handleSubmit)}>
      {/* Use ControlledInput and other form components */}
    </form>
  </FormProvider>
);
```

### ControlledInput Component

Wraps `Input` + error display + optional mask:

```typescript
interface iControlledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  mask?: string;
  tootip?: string;
}

// Usage in form sections:
<ControlledInput
  name="email"
  label="Email"
  type="email"
  placeholder="seu@email.com"
/>

<ControlledInput
  name="cpf"
  label="CPF"
  mask="###.###.###-##"
/>
```

---

## shadcn/Radix UI Components

### Key Components Available

- **Forms**: `Input`, `Label`, `Button`, `Checkbox`, `Select`
- **Layout**: `Card`, `Separator`, `Badge`, `Skeleton`
- **Dialogs**: `Dialog`, `AlertDialog`, `Sheet`
- **Navigation**: `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Breadcrumb`
- **Advanced**: `Popover`, `Command`, `DropdownMenu`, `NavigationMenu`

### Import Pattern

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

### Styling with Tailwind

```tsx
<Button
  className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
  disabled={isLoading}
>
  Save
</Button>
```

---

## Protected Routes

### Layout-Based Protection

Routes under `src/app/(auth)/` are protected via `src/app/(auth)/layout.tsx`:

```typescript
'use server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession || userSession.user.role === 'user') {
    redirect('/login');
  }

  const userName = userSession.user.name || 'Usuário';

  return (
    <div className="min-h-screen">
      <Header name={userName} />
      <div className="mx-auto px-10 py-20">
        <CoreProvider>{children}</CoreProvider>
      </div>
      <Footer />
    </div>
  );
}
```

### How It Works

- All routes under `(auth)` require an authenticated session with `role !== 'user'`.
- Unauthenticated users or users with role `'user'` are redirected to `/login`.
- Session data is accessible: `userSession.user.name`, `userSession.user.role`, etc.

---

## Templates Pattern

### Folder Structure Example

```
src/templates/consultorio/
├── index.tsx                # List view (server component)
├── actions.ts               # Server actions (save, delete)
└── form/
    ├── index.tsx            # Form template (server component)
    ├── form.tsx             # Form component (client component)
    ├── form-schema.ts       # Zod schema + type
    ├── form-section-one.tsx # Form section
    ├── form-section-two.tsx
    ├── form-section-*.tsx
    ├── screen-navigation.ts # Tab/navigation config
    └── tabs-trigger.ts      # Tab definitions
```

### List Template (`index.tsx`)

```typescript
// src/templates/consultorio/index.tsx
'use server';
import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Hospital } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ConsultorioListTemplate = () => {
  return (
    <>
      <AboutSection
        title="Listagem de Consultórios"
        subtitle="Veja todos os consultórios cadastrados"
        icon={Hospital}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <ConsultorioDataTable />
        </Suspense>
      </div>
    </>
  );
};

async function ConsultorioDataTable() {
  const result = await getAll({
    modelKey: 'consultorio',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="consultorio"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
```

### Form Template (`form/index.tsx`)

```typescript
// src/templates/consultorio/form/index.tsx
import { AboutSection } from '@/components/about-section';
import { Hospital } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const ConsultorioFormTemplate = async ({
  selectedId,
}: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'consultorio',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Consultórios"
        subtitle="Cadastre as informações do consultório"
        icon={Hospital}
      />
      <Form {...result} />
    </>
  );
};
```

---

## DataTable Usage

### Component API

```typescript
interface iDataTableProps<TData> {
  data: TData[];
  sortableFields?: (keyof TData)[]; // Columns with sort buttons
  linkableFields?: (keyof TData)[]; // Columns that link to detail
  linkBasePath?: string; // Base URL for detail links
  filterableField?: keyof TData; // Field to search/filter on
  filterPlaceholder?: string;
  ativos?: boolean; // Show "Ativos" badge
  param?: string; // Query param to append to links
  insert?: boolean; // Show "Add New" button
}
```

### Example Usage

```typescript
// Fetch data
const result = await getAll({
  modelKey: 'consultorio',
  fields: ['nome', 'email'] as const,
});

// Render table
return (
  <DataTable
    data={result}
    sortableFields={['nome', 'email']}
    linkableFields={['nome']}
    linkBasePath="consultorio"
    filterableField="nome"
    filterPlaceholder="Buscar por nome..."
    insert={true}
  />
);
```

### Features

- **Pagination**: 10 items per page with next/previous navigation.
- **Sorting**: Click column header to toggle asc/desc.
- **Filtering**: Real-time search in specified field.
- **Linking**: Click linkable fields to navigate to detail form.
- **Empty State**: Shows "Não há registros..." when data is empty.

---

## Server Actions

### Pattern

```typescript
// src/templates/consultorio/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import {
  consultorioFormSchema,
  tConsultorioFormData,
} from './form/form-schema';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { revalidatePath } from 'next/cache';

const PATH = 'consultorio';
const dataPrisma = prisma.consultorio;

export async function saveConsultorio(data: tConsultorioFormData) {
  try {
    const { id, ...dataWithoutId } = data;
    const parsedData = consultorioFormSchema.parse(dataWithoutId);

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
    console.error(`Error creating ${PATH}:`, error);
    return { error: `Erro ao salvar ${PATH}` };
  }
}
```

### Calling from Client

```typescript
const handleSubmit = async (formData: tConsultorioFormData) => {
  const result = await saveConsultorio(formData);
  if (result?.error) {
    toast.error(result.error);
    return false;
  }
  toast.success('Salvo com sucesso');
  router.push('/consultorio');
};
```

### Return Value Convention

- **Success**: `undefined` (implicitly) or no error field.
- **Failure**: `{ error: 'string message' }`.

---

## Complex Form Example

### Multi-Tab Form with Lazy Loading

```typescript
// src/templates/consultorio/form/form.tsx
'use client';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultorioFormSchema, tConsultorioFormData } from './form-schema';
import { useMutation } from '@/hooks/mutation';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { useState } from 'react';

export const Form = (data: Partial<tConsultorioFormData>) => {
  const [activeTab, setActiveTab] = useState('dados');

  const methods = useForm<tConsultorioFormData>({
    resolver: zodResolver(consultorioFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
      email: data.email || '',
      telefones: data.telefones || [],
      dentistas: data.dentistas || [],
      secretarias: data.secretarias || [],
    },
  });

  const { handleMutation } = useMutation();

  const handleSubmit = async (formData: tConsultorioFormData) => {
    const msg = formData.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveConsultorio(formData),
      redirectPath: 'consultorio',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'consultorio' }),
      redirectPath: 'consultorio',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  // Watch array fields for tab content
  const telefonesWatch = useWatch({
    control: methods.control,
    name: 'telefones',
  });

  const dentistasWatch = useWatch({
    control: methods.control,
    name: 'dentistas',
  });

  const secretariasWatch = useWatch({
    control: methods.control,
    name: 'secretarias',
  });

  // Lazy-load dentistas only when tab is active
  const { data: dentistasData = [], isPending: isPendingDentistas } = useQuery({
    queryKey: ['dentistas'],
    queryFn: async () =>
      await getAll({
        modelKey: 'dentista',
        fields: ['nome'] as const,
        listSheet: true,
      }),
    enabled: activeTab === 'dentistas',
  });

  // Lazy-load secretarias only when tab is active
  const { data: secretariasData = [], isPending: isPendingSecretarias } =
    useQuery({
      queryKey: ['secretarias'],
      queryFn: async () =>
        await getAll({
          modelKey: 'secretaria',
          fields: ['nome'] as const,
          listSheet: true,
        }),
      enabled: activeTab === 'secretarias',
    });

  return (
    <FormProvider {...methods}>
      <BreadCrumb />
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="mt-20 w-full space-y-6 rounded-md border border-gray-200 bg-white p-8 shadow-xl"
      >
        <Navigation
          id={data.id}
          navigation={screenNavigation}
          disabled={methods.formState.isSubmitting}
          isMainTab={activeTab === 'dados'}
          onDelete={handleDelete}
        />

        <Tabs defaultValue="dados" onValueChange={setActiveTab}>
          <TabsList className="mx-auto mb-8 flex h-12 gap-3 bg-transparent">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.description}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Main data tab */}
          <TabsContent value="dados" className="flex flex-col gap-6">
            <SectionOne />
            <SectionTwo />
          </TabsContent>

          {/* Telefones tab */}
          <TabsContent value="telefones">
            <ListTabContent
              type="input"
              itens={telefonesWatch}
              placeholder="ex: (11) 98765-9876"
              mask="(##) #####-####"
              fieldForm="telefones"
              fieldLabel="telefone"
            />
          </TabsContent>

          {/* Dentistas tab */}
          <TabsContent value="dentistas">
            <ListTabContent
              type="select"
              commandData={dentistasData}
              isPending={isPendingDentistas}
              itens={dentistasWatch}
              fieldForm="dentistas"
              fieldLabel="dentista"
            />
          </TabsContent>

          {/* Secretarias tab */}
          <TabsContent value="secretarias">
            <ListTabContent
              type="select"
              commandData={secretariasData}
              isPending={isPendingSecretarias}
              itens={secretariasWatch}
              fieldForm="secretarias"
              fieldLabel="secretaria"
            />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
};
```

### Key Patterns

- **Lazy Loading**: `useQuery` with `enabled: activeTab === 'tabName'` loads data only when needed.
- **Watched Fields**: `useWatch` tracks array fields to reactively update tab content.
- **Mutations**: `useMutation` hook wraps server action calls with toast notifications.
- **Form Sections**: Split large forms into smaller components (`SectionOne`, `SectionTwo`, etc.) for maintainability.
- **Tabs**: Use `Tabs` + `TabsContent` for multi-step or categorical form grouping.

---

# REUSABLE SKILLS

See detailed skill documentation in `.github/skills/`:

1. **[Next Form Generator](./skills/next-form-generator/SKILL.md)** (Most Valuable)
   - Generate complete CRUD forms following templates pattern
   - Creates full folder structure with form-schema, form.tsx, actions.ts, list view

2. **[Prisma CRUD Generator](./skills/prisma-crud-generator/SKILL.md)**
   - Generate type-safe server actions with save/remove pattern
   - Proper error handling and revalidation

3. **[Data Table Builder](./skills/data-table-builder/SKILL.md)**
   - Generate list views with sorting, filtering, pagination
   - Configure linkableFields, sortableFields, filter setup

4. **[Form Section Generator](./skills/form-section-generator/SKILL.md)**
   - Create reusable form sections with ControlledInput
   - Masks (CPF, CNPJ, phone), grid layouts, validation display

5. **[Tab Lazy Loader](./skills/tab-lazy-loader/SKILL.md)**
   - Generate lazy-loaded tab content with useQuery
   - Tab configuration, icons, ListTabContent for arrays

6. **[Protected Route Generator](./skills/protected-route-generator/SKILL.md)**
   - Set up authenticated routes with role-based access
   - Layout protection, session validation, public/protected alternatives

## Implementation Workflow

### Quick Start Sequence

1. **Identify Model**: Review Prisma schema, pick your model
2. **Use Prisma CRUD Generator**: Create `actions.ts` with save/remove
3. **Use Form Section Generator**: Create `form-section-*.tsx` components
4. **Use Next Form Generator**: Assemble `form.tsx` with tabs and lazy loading
5. **Use Data Table Builder**: Configure list view with filtering/sorting
6. **Use Tab Lazy Loader**: Wire up `tabs-trigger.ts` and tab state
7. **Use Protected Route Generator**: Create route files and layout protection

### Verification Checklist

- [ ] All form fields match Prisma schema types
- [ ] Zod schema has `.optional()` for nullable fields
- [ ] Server actions wrap Prisma calls in try/catch
- [ ] Form sections use ControlledInput with proper masks
- [ ] Tabs have lazy-loaded queries with `enabled` flag
- [ ] DataTable has correct sortableFields and linkableFields
- [ ] Layout checks auth session before rendering
- [ ] Success/error messages use locale-specific strings
- [ ] revalidatePath() called after mutations
- [ ] Form state properly cleared after successful submit

### Common Pitfalls

1. **Missing `.optional()` on nullable fields**: Causes validation errors
2. **Forgetting `as const` on field tuples**: Type inference breaks
3. **No `enabled` flag on lazy queries**: Data loads even on inactive tabs
4. **Incorrect model key case**: Use lowercase (e.g., `'dentista'`, not `'Dentista'`)
5. **Missing revalidatePath()**: Data doesn't refresh after mutations
6. **Unhandled Prisma errors**: Always return `{ error: string }` on catch
7. **Wrong grid classes**: Use `md:grid-cols-N` for responsive layouts
