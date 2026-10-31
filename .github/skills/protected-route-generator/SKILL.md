# Protected Route Generator

Set up authenticated routes with proper role-based access control.

## What It Creates

- Route group under `src/app/(auth)/`
- Layout with session protection
- Role validation (admin vs user)
- Header/Footer integration

## Protected Route Structure

```
src/app/(auth)/
├── layout.tsx          # Auth check + role validation
├── [model]/
│   ├── page.tsx        # List view
│   └── form/
│       └── [id]/
│           └── page.tsx # Detail/edit view
```

## Layout Template

```typescript
// src/app/(auth)/[model]/layout.tsx
'use server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect if not authenticated or is regular user
  if (!userSession || userSession.user.role === 'user') {
    redirect('/login');
  }

  return <>{children}</>;
}
```

## Page Template (List View)

```typescript
// src/app/(auth)/[model]/page.tsx
'use server';
import { [Model]ListTemplate } from '@/templates/[model]';

export default async function [Model]ListPage() {
  return <[Model]ListTemplate />;
}
```

## Page Template (Detail/Form View)

```typescript
// src/app/(auth)/[model]/form/[id]/page.tsx
'use server';
import { [Model]FormTemplate } from '@/templates/[model]/form';

interface [Model]FormPageProps {
  params: Promise<{ id?: string }>;
}

export default async function [Model]FormPage({
  params,
}: [Model]FormPageProps) {
  const { id } = await params;

  return <[Model]FormTemplate selectedId={id} />;
}
```

## Role-Based Access (Optional Enhancement)

```typescript
// For admin-only routes
if (!userSession || !['admin', 'moderator'].includes(userSession.user.role)) {
  redirect('/login');
}
```

## Public Route Alternative

```typescript
// src/app/[model]/page.tsx (no auth layout wrapper)
'use server';
export default function PublicListPage() {
  return <[Model]ListTemplate />;
}
```

## How It Works

- All routes under `(auth)` require an authenticated session with `role !== 'user'`
- Unauthenticated users or users with role `'user'` are redirected to `/login`
- Session data is accessible: `userSession.user.name`, `userSession.user.role`, etc.
- Use separate route groups for different permission levels

## Best Practices

1. Use route groups `(auth)`, `(public)`, `(admin)` to organize by permission level
2. Check session in layout to prevent unauthorized access to entire feature
3. Keep login page outside protected groups for accessibility
4. Pass session data to child components via props, not context
5. Redirect early in layout rather than conditional rendering in pages
