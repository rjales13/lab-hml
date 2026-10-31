# Form Section Generator

Create reusable form sections with inputs, masks, and field validation.

## What It Creates

- `form-section-*.tsx` components
- `ControlledInput` with proper masks
- Field groupings using CSS Grid
- Error handling and validation display

## Section Template

```typescript
// src/templates/[feature]/form/form-section-one.tsx
'use client';
import { useFormContext } from 'react-hook-form';
import { ControlledInput } from '@/components/controlled-input';
import { ControlledSelect } from '@/components/controlled-select';

export const SectionOne = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <ControlledInput
        name="nome"
        label="Nome"
        placeholder="Digite o nome..."
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="email@example.com"
      />
    </div>
  );
};
```

## Common Mask Patterns

```typescript
// CPF: ###.###.###-##
<ControlledInput
  name="cpf"
  label="CPF"
  mask="###.###.###-##"
/>

// Phone: (##) #####-####
<ControlledInput
  name="telefone"
  label="Telefone"
  mask="(##) #####-####"
/>

// CEP: #####-###
<ControlledInput
  name="cep"
  label="CEP"
  mask="#####-###"
/>

// CNPJ: ##.###.###/####-##
<ControlledInput
  name="cnpj"
  label="CNPJ"
  mask="##.###.###/####-##"
/>
```

## Grid Layouts

```typescript
// Two columns
<div className="grid grid-cols-1 gap-6 md:grid-cols-2">

// Three columns
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">

// Four columns
<div className="grid grid-cols-1 gap-6 md:grid-cols-4">

// Full width
<div className="grid grid-cols-1">
```

## ControlledInput Props

```typescript
interface iControlledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string; // Field name from form schema
  label: string; // Display label
  mask?: string; // Input mask pattern
  tootip?: string; // Optional tooltip
  disabled?: boolean; // Disable input
  type?: string; // HTML input type
  placeholder?: string; // Placeholder text
}
```

## Best Practices

- Always use `useFormContext()` to access form state
- Group related fields logically (address together, contact info together, etc.)
- Use responsive grid classes for mobile-first design
- Apply masks for structured data (CPF, CNPJ, phone, date)
- Add tooltips for complex or required fields
- Keep sections focused on 2-5 fields maximum
