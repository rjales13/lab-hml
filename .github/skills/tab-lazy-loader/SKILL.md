# Tab Lazy Loader

Generate lazy-loaded tab content with `useQuery` and `ListTabContent`.

## What It Creates

- `tabs-trigger.ts` with tab definitions and icons
- `screen-navigation.ts` with navigation config
- Tab state management with `useState`
- Lazy loading queries with `enabled` flag
- `ListTabContent` for array fields (telefones, emails, relacionamentos)

## Tab Configuration Template

```typescript
// src/templates/[feature]/form/tabs-trigger.ts
import { Phone, Users, FileText } from 'lucide-react';

export const TABS = [
  {
    value: 'dados',
    description: 'Dados Principais',
    icon: FileText,
  },
  {
    value: 'telefones',
    description: 'Telefones',
    icon: Phone,
  },
  {
    value: 'relacionamentos',
    description: 'Relacionamentos',
    icon: Users,
  },
];
```

## Navigation Configuration Template

```typescript
// src/templates/[feature]/form/screen-navigation.ts
export const screenNavigation = [
  { label: 'Salvar', type: 'submit' },
  { label: 'Deletar', type: 'delete' },
];
```

## Lazy Loading Pattern

```typescript
// Inside form.tsx
const [activeTab, setActiveTab] = useState('dados');

// Lazy-load related data only when tab is active
const { data: relacionadosData = [], isPending } = useQuery({
  queryKey: ['relacionados'],
  queryFn: async () =>
    await getAll({
      modelKey: 'relacionado',
      fields: ['nome'] as const,
      listSheet: true,
    }),
  enabled: activeTab === 'relacionamentos', // Only loads when tab is active
});
```

## ListTabContent Usage

### For input arrays (telefones, emails)

```typescript
<ListTabContent
  type="input"
  itens={telefonesWatch}
  placeholder="ex: (11) 98765-9876"
  mask="(##) #####-####"
  fieldForm="telefones"
  fieldLabel="telefone"
/>
```

### For select arrays (relacionamentos)

```typescript
<ListTabContent
  type="select"
  commandData={relacionadosData}
  isPending={isPending}
  itens={relacionadosWatch}
  fieldForm="relacionados"
  fieldLabel="relacionado"
/>
```

## Key Points

- **Lazy Loading**: Only fetch data when tab becomes active to reduce initial load time
- **Watched Fields**: Use `useWatch` to track array field changes
- **Icons**: Choose appropriate lucide-react icons for each tab
- **Pending States**: Show loading indicators while fetching data
- **Field Labels**: Use singular form for better UX (e.g., "telefone", "dentista")

## Tab Icons Reference

Import from `lucide-react`:

- `FileText` - Data/main info
- `Phone` - Telefones/contact
- `Users` - Relacionamentos/people
- `Mail` - Email
- `MapPin` - Address
- `CreditCard` - Payment info
- `Clock` - Time-related data
