# Data Table Builder

Generate list views with sorting, filtering, and pagination.

## What It Creates

- Configured `DataTable` component with proper props
- Correct field mapping from Prisma schema
- Sortable and linkable fields configuration
- Filter setup for search functionality

## Configuration Template

```typescript
// src/templates/[feature]/index.tsx
async function [Feature]DataTable() {
  const result = await getAll({
    modelKey: '[model]',
    fields: ['nome', 'email'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome', 'email']}      // Columns user can sort
      linkableFields={['nome']}                // Columns that link to detail
      linkBasePath="[model]"                   // Route base path
      filterableField="nome"                   // Field to search on
      filterPlaceholder="Filtrar por nome..."
      insert={true}                            // Show "Add New" button
    />
  );
}
```

## Component API

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

## Example: Dentista List

```typescript
const result = await getAll({
  modelKey: 'dentista',
  fields: ['nome', 'cro'] as const,
});

return (
  <DataTable
    data={result}
    sortableFields={['nome', 'cro']}
    linkableFields={['nome']}
    linkBasePath="dentista"
    filterableField="nome"
    filterPlaceholder="Buscar dentistas..."
  />
);
```

## Features

- **Pagination**: 10 items per page with next/previous navigation
- **Sorting**: Click column header to toggle asc/desc
- **Filtering**: Real-time search in specified field
- **Linking**: Click linkable fields to navigate to detail form
- **Empty State**: Shows "Não há registros..." when data is empty

## Best Practices

1. **Field Selection**: Only include fields that are useful in list view
2. **Sortable Fields**: Choose fields users naturally want to sort by
3. **Linkable Fields**: Usually just one field (often `nome`) links to detail
4. **Filter Field**: Pick the most-searched field (usually `nome`)
5. **listSheet Format**: For select/dropdown lists, add `listSheet: true` to `getAll()`

## Data Fetching

- Use `getAll()` from `src/app/actions.ts` to fetch multiple records
- Pass `fields` as const tuple: `['nome'] as const`
- Optional `listSheet: true` returns simplified `{ id, value }` format for selects
