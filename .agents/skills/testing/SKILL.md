---
name: testing
description: Provide practical testing guidance for unit tests, component tests, Server Actions, Route Handlers, and Prisma integration with Vitest and React Testing Library. Activate when users ask how to test, need help writing tests, or request test examples for Next.js and React features.
---

# Testing Skill

This skill provides testing guidance for the `lab-hml` project.

## Project Testing Stack

- Vitest 3.2.7
- React Testing Library 16.3.3
- `@testing-library/jest-dom`
- jsdom
- Next.js 16 App Router
- React 19
- TypeScript with strict mode
- Prisma with MongoDB
- Better Auth

**Important:** `@testing-library/user-event` is not currently installed. Use `fireEvent` where appropriate, or request approval before adding `user-event` as a development dependency.

Before writing tests, inspect `package.json`, the relevant source files, existing tests, and the current testing configuration. Do not assume an API, dependency, component, or project convention exists without checking.

## Testing Philosophy

- **Test observable behavior**, not implementation details. Test what users see and do, the results of business functions, and the observable effects of server operations.
- **Keep tests deterministic and isolated.** Each test should pass or fail independently.
- **Mock external boundaries only.** Mock databases, external APIs, and third-party services when appropriate. Do not mock the functionality being tested.
- **Test meaningful edge cases and error paths.** Focus on business rules, validation, and user-facing behavior.
- **Avoid testing private implementation details.** Prefer testing through public interfaces.
- **Do not write tests solely to increase coverage numbers.**
- **Do not skip, disable, or weaken tests just to make a test suite pass.**

## Test Levels: Unit, Integration, and End-to-End

### Unit Tests

Test a single function, hook, or component in isolation.

Examples:

- Testing a utility function such as `capitalize()`.
- Testing a business rule.
- Testing a component's rendering and interaction behavior.

Use Vitest directly for functions and Vitest with React Testing Library for components.

Mock external dependencies when they are outside the scope of the unit being tested.

### Integration Tests

Test multiple units working together.

Examples:

- A form interacting with a validation schema and submission callback.
- A Server Action interacting with a mocked database boundary.
- A repository or data-access function interacting with a real isolated MongoDB test database.

Be explicit about the integration boundary. A test using a mocked Prisma client is not a real database integration test.

### End-to-End Tests

Test the application from the user's browser perspective.

Examples:

- Navigation between pages.
- Authentication and redirects.
- Form submission through the complete application.
- Page transitions and server-rendered behavior.

Vitest alone does not provide full browser-level testing. Playwright is not currently installed in this project. Do not introduce it unless the task requires browser-level testing and the dependency change is approved.

## Test Organization and File Naming

### Custom Hook File Extensions

- Custom hook implementation files must always use `.ts`, never `.tsx`.
- Custom hook test files should use `.test.ts` by default.
- Using React hooks, `renderHook`, or React Testing Library does not require `.tsx`.
- Never rename a custom hook implementation to `.tsx` when creating or modifying tests.
- Preserve `.ts` extensions for custom hook implementation files. Never convert hooks to `.tsx` during test creation or refactoring.

Colocate unit and component tests with the code they cover, following existing project conventions.

Use:

- `<name>.test.ts` for utilities and non-UI code.
- `<name>.test.tsx` for React components.

Example:

```text
src/
  lib/
    utils/
      capitalize.ts
      capitalize.test.ts
  components/
    button.tsx
    button.test.tsx
```

Use `describe` blocks to group related behavior and explicit test names describing what the test verifies.

Do not add unnecessary test abstractions or helpers for one-off assertions.

## Unit Testing Pure Functions and Business Logic

Test utility functions and business logic directly with minimal setup.

Example:

```typescript
import { describe, expect, it } from 'vitest';
import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('keeps remaining letters unchanged', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });

  it('returns an empty string when given an empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles a single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});
```

Test scenarios that are valid according to the function's contract:

- Normal inputs.
- Empty inputs when supported.
- Boundary conditions.
- Meaningful business-rule edge cases.

Do not test `null` or `undefined` for a function whose TypeScript contract only accepts `string`, unless the function is explicitly designed to support those values.

## React Component Testing with React Testing Library

Test components from the user's perspective:

- What is rendered?
- Can users find and interact with controls?
- Does the UI respond correctly?
- Are validation and error messages accessible?
- Are relevant loading, success, empty, and error states handled?

Prefer semantic queries:

```typescript
screen.getByRole('button', { name: 'Save' });
screen.getByLabelText('Email');
screen.getByText('Saved successfully');
```

Avoid querying implementation-specific classes or internal component state when an accessible query is available.

### Basic Component Test

```typescript
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders its text content', () => {
    render(<Button>Click me</Button>)

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

Use actual project components and props. Treat this example as a pattern, not a claim that every component has the same API.

### User Interactions: fireEvent vs userEvent

`fireEvent` is available through `@testing-library/react`.

It dispatches DOM events directly. It is appropriate for simple event-level tests and situations where a low-level event needs to be dispatched explicitly.

```typescript
fireEvent.click(button);

fireEvent.change(input, {
  target: { value: 'text' },
});

fireEvent.keyDown(input, {
  key: 'Enter',
});
```

`fireEvent` does not reproduce the complete sequence of events involved in realistic user interactions.

`user-event` simulates interactions more closely, including focus, keyboard input, and typing behavior. It is generally preferable for realistic user workflows.

It is not currently installed in this project.

If it is approved and installed, use the default import:

```typescript
import userEvent from '@testing-library/user-event'

it('submits a search when Enter is pressed', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn()

  render(<SearchForm onSubmit={handleSubmit} />)

  const input = screen.getByRole('textbox', {
    name: 'Search',
  })

  await user.type(input, 'test query')
  await user.keyboard('{Enter}')

  expect(handleSubmit).toHaveBeenCalledWith('test query')
})
```

Do not add a dependency just to replace every existing `fireEvent` call. Choose the interaction tool appropriate to the behavior being tested.

## Testing Controlled Components and React Hook Form

For components using React Hook Form, render them inside a `FormProvider` with a small test wrapper.

Example:

```typescript
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { ControlledInput } from './controlled-input'

function TestWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const methods = useForm({
    defaultValues: {
      name: '',
    },
  })

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  )
}

describe('ControlledInput', () => {
  it('updates the form value when the user types', () => {
    render(
      <TestWrapper>
        <ControlledInput name="name" label="Name" />
      </TestWrapper>
    )

    const input = screen.getByLabelText('Name')

    fireEvent.change(input, {
      target: { value: 'John' },
    })

    expect(input).toHaveValue('John')
  })
})
```

For masked inputs, test the actual formatting behavior and use the project's existing mask implementation. Do not assume a mask format without inspecting the component.

## Testing Custom Hooks

Use `renderHook` from React Testing Library to test custom hooks.

Test their observable results and side effects rather than internal implementation details.

Example pattern:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

describe('useCounter', () => {
  it('increments the counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

For hooks involving asynchronous operations:

- Await the operation when the API returns a promise.
- Use `waitFor` when observing asynchronous state changes.
- Use `findBy` queries when waiting for DOM elements.
- Verify the actual result or side effect, not merely that a function was called.

Inspect the real hook implementation before writing tests. Do not invent method names or return values.

## Mocking Strategies

Mock only dependencies outside the scope of the test.

Typical boundaries include:

- Prisma/database access.
- External APIs.
- Third-party services.
- Next.js navigation when navigation is not the behavior being tested.
- Notifications when verifying that a notification is triggered.

Avoid mocking React, DOM elements, or the primary functionality being tested.

### Understanding Vitest Mock Behavior

**`vi.mock()`**

Mocks a module. Vitest hoists `vi.mock()` calls so they can apply to imports in the test file.

Module mocks remain in effect until explicitly unmocked or the relevant module mocking configuration changes. `restoreMocks` does not automatically remove module mocks.

**`vi.mocked()`**

A TypeScript helper that provides mock-aware typing for an existing function or object. It does not create a mock.

**`vi.clearAllMocks()`**

Clears mock call history and results while preserving mock implementations.

**`vi.resetAllMocks()`**

Resets mock state and implementations. Use it only when the test needs that behavior.

**`vi.restoreAllMocks()`**

Restores spies and replaced properties to their original implementations.

### Project Mock Configuration

The current Vitest configuration includes:

```typescript
clearMocks: true,
restoreMocks: true,
```

This means:

- Mock call history is cleared automatically between tests.
- Spies and replaced properties are restored automatically.
- Mocked modules created with `vi.mock()` are not automatically removed by these options.

Avoid redundant manual cleanup unless a test requires specific setup or teardown.

### Mocking Prisma

Inspect the real Prisma model, generated client, and query before creating mocks.

The generated Prisma client is located under the project's configured generated-client path, currently `src/generated/prisma`.

Use types from the generated client when appropriate. Do not import generated types from `@prisma/client` when the project uses its own generated output.

Prefer mocking only the query used by the function under test.

Example pattern:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { getConsultorios } from './consultorios';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    consultorio: {
      findMany: vi.fn(),
    },
  },
}));

describe('getConsultorios', () => {
  it('returns the consultorios returned by Prisma', async () => {
    const { prisma } = await import('@/lib/prisma');

    const expected = [
      // Build a fixture matching the actual query result.
    ];

    vi.mocked(prisma.consultorio.findMany).mockResolvedValue(expected);

    const result = await getConsultorios();

    expect(result).toEqual(expected);
  });
});
```

The fixture above is intentionally incomplete. Inspect the actual Prisma query and its return type before constructing it.

For queries using `select`, `include`, relations, or transformations, the returned type may differ from the full model type.

Do not:

- Use `as any` to bypass Prisma typing.
- Invent required model fields.
- Assume a query returns the complete model.
- Mock unrelated Prisma methods.

Prefer type-safe fixtures based on the actual query contract.

### Mocking Functions

```typescript
const mockFn = vi.fn();

const mockFnWithReturn = vi.fn().mockReturnValue('value');

const mockFnWithResolve = vi.fn().mockResolvedValue({
  id: '123',
});

const mockFnWithReject = vi.fn().mockRejectedValue(new Error('Failed'));
```

Useful assertions:

```typescript
expect(mockFn).toHaveBeenCalled();

expect(mockFn).toHaveBeenCalledWith('expected-arg');

expect(mockFn).toHaveBeenCalledTimes(1);

expect(mockFn).toHaveBeenNthCalledWith(1, 'arg');
```

### Mocking Notifications

When testing notification behavior, mock the notification boundary and verify the appropriate method and message.

Inspect the project's actual notification library and usage before writing the mock.

### Mocking Next.js Router

When a component or hook uses `next/navigation`, mock only the router methods it actually uses.

Example:

```typescript
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  })),
}));
```

Keep references to mock functions when assertions need to inspect navigation calls.

Avoid `require()` in TypeScript examples when a normal dynamic import or an explicitly defined mock reference is sufficient.

## Testing Asynchronous Code

Choose the assertion strategy according to the behavior.

### Direct Assertions

For synchronous UI updates:

```typescript
it('updates the counter after clicking', () => {
  render(<Counter />)

  fireEvent.click(
    screen.getByRole('button', { name: 'Increment' })
  )

  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### findBy Queries

Use `findBy` when waiting for a DOM element to appear asynchronously:

```typescript
it('displays loaded data', async () => {
  render(<UserList />)

  expect(
    await screen.findByText('Alice')
  ).toBeInTheDocument()
})
```

### waitFor

Use `waitFor` for asynchronous conditions that are not best expressed through a `findBy` query:

```typescript
it('calls onLoad after fetching data', async () => {
  const mockOnLoad = vi.fn()

  render(<DataComponent onLoad={mockOnLoad} />)

  await waitFor(() => {
    expect(mockOnLoad).toHaveBeenCalled()
  })
})
```

Do not wrap every assertion in `waitFor`. Use it only when the condition genuinely becomes true asynchronously.

Do not use arbitrary delays such as `setTimeout` to make tests pass.

## Testing Server Actions

Server Actions can be tested directly as async functions.

For unit tests:

- Import the action.
- Mock its external dependencies.
- Provide valid input.
- Assert the returned result and relevant side effects.
- Test validation and authorization failures.

Example pattern:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { getAll } from './actions';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    consultorio: {
      findMany: vi.fn(),
    },
  },
}));

describe('getAll', () => {
  it('returns the expected formatted data', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.consultorio.findMany).mockResolvedValue([
      // Fixture matching the actual Prisma query.
    ]);

    const result = await getAll({
      modelKey: 'consultorio',
      fields: ['nome', 'email'],
    });

    expect(result).toEqual([
      // Expected result matching the actual action contract.
    ]);
  });
});
```

This is a unit test of the action function, not a complete test of the Next.js Server Action lifecycle.

### Testing Server Actions from Components

When testing how a component responds to a Server Action:

- Mock the action boundary.
- Trigger the user interaction.
- Verify the resulting UI.
- Test loading, success, and error states where relevant.

Do not claim that a component test validates the actual server execution.

### Testing next/cache

If an action calls `revalidatePath()` or `revalidateTag()`, you can mock those functions and verify that the expected arguments are passed.

This verifies the call, not whether Next.js actually invalidated its cache.

### Testing redirect()

Next.js `redirect()` throws a special control-flow error.

When unit-testing an action, you can mock `redirect()` and verify that it was called with the expected destination.

Do not treat a mocked redirect test as proof that browser navigation works correctly. Full navigation behavior requires browser-level testing.

## Testing API Routes and Route Handlers

Next.js Route Handlers can be tested by calling their exported functions directly with standard `Request` objects.

Example pattern:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    consultorio: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/consultorio', () => {
  it('returns the expected response', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.consultorio.findMany).mockResolvedValue([
      // Fixture matching the actual query.
    ]);

    const request = new Request('http://localhost:3000/api/consultorio');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([
      // Expected response.
    ]);
  });
});
```

For error scenarios:

- Inspect the actual Route Handler.
- Determine whether it catches, transforms, or propagates errors.
- Assert the exact status code and response body defined by its implementation.
- Do not accept multiple possible status codes simply to make a test pass.

Direct handler tests do not validate the complete HTTP server or deployment runtime.

## Testing Forms and Validation

Test form behavior through accessible controls and visible results.

Important scenarios include:

- Required field validation.
- Invalid input.
- Valid submission.
- Submission failures.
- Disabled/loading states.
- Correct values passed to the submission handler.

Example:

```typescript
it('shows validation errors for required fields', async () => {
  render(<UserForm />)

  fireEvent.click(
    screen.getByRole('button', { name: 'Submit' })
  )

  expect(
    await screen.findByText('Name is required')
  ).toBeInTheDocument()
})
```

For valid submissions:

```typescript
it('submits valid form data', async () => {
  const mockSubmit = vi.fn()

  render(<UserForm onSubmit={mockSubmit} />)

  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John' },
  })

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'john@example.com' },
  })

  fireEvent.click(
    screen.getByRole('button', { name: 'Submit' })
  )

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    })
  })
})
```

Use the actual validation messages, field names, and component API from the project. Do not invent them.

## Testing Loading, Success, Empty, and Error States

Test state variations when they are part of the component's contract.

Example pattern:

```typescript
describe('UserList', () => {
  it('displays the loading state', () => {
    render(<UserList isLoading />)

    expect(
      screen.getByRole('progressbar')
    ).toBeInTheDocument()
  })

  it('displays the empty state', () => {
    render(<UserList users={[]} />)

    expect(
      screen.getByText('No users found')
    ).toBeInTheDocument()
  })

  it('displays loaded users', () => {
    render(
      <UserList users={[{ id: '1', name: 'Alice' }]} />
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
```

The component API and accessible loading indicator must be verified against the actual implementation.

Do not add artificial states or props solely to match an example.

## Testing Better Auth Authentication and Authorization

Authorization must be tested at the server boundary.

Important scenarios:

- Unauthenticated requests are rejected.
- Authenticated users without the required role or permission are rejected.
- Authorized users can perform the operation.
- Invalid or missing input is rejected independently of authentication.

Before writing Better Auth mocks:

1. Inspect the actual Better Auth configuration.
2. Inspect the project's session and user types.
3. Inspect how the application retrieves the session.
4. Inspect how roles and permissions are represented.
5. Build fixtures matching the actual implementation.

Do not assume that `role` exists on the default Better Auth user object. Do not copy invented session fields or hardcode a session shape from a generic example.

Example pattern:

```typescript
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));
```

Then configure the mocked session according to the actual project types and test the real authorization behavior.

A protected layout or client-side role check is not a substitute for server-side authorization.

For component-level auth UI:

- Test the actual session provider or component contract.
- Provide the appropriate session state.
- Verify the visible UI.
- Do not attempt to validate server authorization through a client-side component test.

## Testing Async Server Components

Vitest with jsdom is not a complete Next.js server runtime.

Async Server Components and framework-specific rendering behavior may not work with ordinary React Testing Library rendering.

For these components:

- Test extracted business logic and data-access functions independently.
- Test authorization logic independently.
- Test client components separately.
- Use browser-level or appropriate Next.js integration testing when the complete server-rendered behavior must be validated.

Do not claim that testing a data-fetching function alone validates the complete Server Component.

Playwright is not currently installed. Do not add it without a concrete requirement and approval.

## Prisma Integration Tests with a Test Database

Use real MongoDB integration tests only when testing actual database behavior is important.

These tests are different from unit tests that mock Prisma.

### Safety Requirements

- Use a dedicated MongoDB test database.
- Require an explicitly configured test connection string.
- Never silently fall back to the development or production database.
- Never run destructive cleanup against an unverified database.
- Keep test data isolated.
- Clean up only records created by the test.
- Avoid concurrent tests modifying the same records.
- Follow the project's Prisma client lifecycle.

Do not copy a database URL from the development environment into a test configuration.

### Test Database Configuration

Use an explicit environment variable such as:

```text
TEST_DATABASE_URL
```

Before connecting, verify that it exists and points to the dedicated test database.

If the configuration is missing, fail the integration-test setup rather than falling back to another database.

Do not add a second Prisma client or modify the main application configuration without first inspecting the existing client setup.

### Integration Test Organization

Use a clear filename convention, for example:

```text
consultorios.integration.test.ts
```

If the test requires Node APIs or a real Prisma connection, use the appropriate Vitest environment, such as:

```typescript
// @vitest-environment node
```

Example pattern:

```typescript
import { afterAll, describe, expect, it } from 'vitest';

import { prisma } from '@/lib/prisma';

describe('Consultorio integration tests', () => {
  const createdIds: string[] = [];

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.consultorio.deleteMany({
        where: {
          id: {
            in: createdIds,
          },
        },
      });
    }
  });

  it('creates and retrieves a consultorio', async () => {
    const created = await prisma.consultorio.create({
      data: {
        // Use fields valid for the actual Prisma schema.
      },
    });

    createdIds.push(created.id);

    const retrieved = await prisma.consultorio.findUnique({
      where: {
        id: created.id,
      },
    });

    expect(retrieved?.id).toBe(created.id);
  });
});
```

This is a structural example. Inspect the actual Prisma schema before supplying data fields.

The shared Prisma client lifecycle should be managed centrally. Do not independently disconnect a shared client in every test suite. If a dedicated integration-test client is created, manage its lifecycle in the corresponding shared setup and teardown.

Run integration tests separately from unit tests when the project configuration supports it. Use the actual Vitest CLI options and verify the command against the installed version.

## Regression Testing

When fixing a bug, write a test that reproduces the bug before or alongside the fix.

Example:

```typescript
describe('capitalize regression', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });
});
```

A regression test should:

- Reproduce the original failure.
- Verify the expected behavior.
- Remain useful after the implementation changes.

Do not create a test that merely repeats implementation details.

## Test Isolation and Cleanup

The current Vitest configuration includes:

```typescript
clearMocks: true,
restoreMocks: true,
```

Understand the difference:

- `clearMocks` clears mock call history.
- `restoreMocks` restores spies and replaced properties.
- Neither option automatically removes `vi.mock()` module mocks.

Use `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` when the test requires explicit setup or cleanup.

Avoid shared mutable state between tests.

For browser-like tests:

- Clean up rendered components.
- Restore modified globals.
- Restore spies when necessary.
- Avoid leaking timers, event listeners, or subscriptions.

Follow the existing setup file and React Testing Library cleanup behavior. Do not add redundant cleanup without a reason.

## Common Testing Anti-Patterns

1. **Testing implementation details instead of behavior**

   Avoid assertions against private state or internal methods. Prefer observable DOM output and public function results.

2. **Mocking the functionality under test**

   Do not mock a function and then claim to have tested its behavior. Mock its external dependencies instead.

3. **Using fireEvent for every interaction**

   Choose between `fireEvent` and `user-event` based on the behavior being tested. Use realistic interaction simulation when it materially matters.

4. **Testing private methods or internal state**

   Test through public interfaces such as props, accessible DOM elements, and returned values.

5. **Skipping or disabling tests to make the suite pass**

   Fix the underlying issue. Do not introduce `.skip`, `.only`, or weakened assertions as a workaround.

6. **Not waiting for asynchronous behavior**

   Use `findBy` for asynchronous DOM elements and `waitFor` for other asynchronous assertions.

7. **Testing too much in one test**

   Keep each test focused on one logical behavior.

8. **Mocking everything indiscriminately**

   Preserve the behavior of the units being tested. Mock only appropriate boundaries.

9. **Using meaningless test data**

   Use realistic, meaningful fixtures that make the scenario understandable.

10. **Only testing the happy path**

    Include relevant validation failures, authorization failures, and error cases.

11. **Using arbitrary delays**

    Avoid `setTimeout` and fixed sleeps to synchronize tests. Wait for observable conditions instead.

12. **Using `any` to silence test type errors**

    Build fixtures matching the actual TypeScript contracts. Use `unknown` and validation when handling untrusted data.

## Running Tests

The current project scripts are:

```bash
npm run test
```

Runs Vitest in interactive watch mode.

```bash
npm run test:run
```

Runs tests once.

```bash
npm run test:coverage
```

Runs tests with coverage reporting.

Run a specific file:

```bash
npm run test:run -- src/lib/utils/capitalize.test.ts
```

Run tests matching a name:

```bash
npm run test:run -- -t "capitalize"
```

For integration-test filtering, use the positional file filter supported by the installed Vitest version. Verify the command before documenting or using additional CLI options.

Do not claim tests pass unless the corresponding command was actually executed.

## Configuration Reference

### vitest.config.mts

The current configuration includes:

- `environment: 'jsdom'` — Provides a browser-like DOM for component tests.
- `globals: true` — Makes Vitest globals such as `describe`, `it`, and `expect` available without imports.
- `setupFiles` — Loads the project's Vitest setup file.
- `clearMocks: true` — Clears mock call history between tests.
- `restoreMocks: true` — Restores spies and replaced properties between tests.
- `coverage.provider: 'v8'` — Uses V8 for coverage reporting.
- Coverage reporters: `text` and `html`.

Preserve the existing configuration when adding test capabilities. Do not replace it with a generic configuration that removes project plugins, aliases, or setup files.

### vitest.setup.ts

The current setup imports:

```typescript
import '@testing-library/jest-dom/vitest';
```

This enables DOM assertions such as:

```typescript
expect(element).toBeInTheDocument();
expect(button).toBeDisabled();
expect(input).toHaveValue('text');
```

## TypeScript

- The project uses strict TypeScript.
- Tests must follow the same TypeScript strictness as production code.
- Never use `any` in test code.
- Never use `as any` to bypass TypeScript errors.
- Prefer explicit types, inferred types, and `unknown` where appropriate.
- Mock functions must use appropriate TypeScript signatures.
- Test fixtures must match the actual types and contracts.
- Use `@/*` imports for the configured `src/` alias.
- Prefer inferred types from actual functions and schemas.
- Use the generated Prisma client from the project's configured output.

## AI-Assisted Testing Workflow

When generating or modifying tests:

1. Inspect the implementation and its existing tests.
2. Inspect the relevant project dependencies and configuration.
3. Identify the behavior and important edge cases.
4. Choose the appropriate test level.
5. Mock only external boundaries.
6. Use existing project types, schemas, fixtures, and conventions.
7. Write deterministic tests with meaningful names.
8. Run the relevant test file.
9. Run the broader test suite when appropriate.
10. **Run ESLint checks** (`npm run lint` or project linter) on test files.
11. **Run TypeScript checks** (`npx tsc --skipLibCheck --noEmit <testfile>`) to verify no TypeScript errors in test code.
12. Report exactly what was tested and any remaining limitations.

Do not:

- Invent components, props, methods, database fields, or return types.
- Add dependencies without approval.
- Modify production code just to make a test easier unless the task requires it.
- Weaken assertions to make tests pass.
- Claim successful validation without running the relevant commands.
- **Mark work as complete if linting errors exist** in test files.
- **Mark work as complete if TypeScript errors specific to the test code exist** (dependency/configuration errors are acceptable, but test code must be error-free).
- Use `as any` or `as unknown` to suppress TypeScript errors — fix the underlying type issue instead.
- `as never` is acceptable when no other typing solution exists.
