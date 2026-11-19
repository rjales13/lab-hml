# Engineering Standards

These standards apply across this repository. **MUST** marks a requirement; **SHOULD** marks a default to follow unless the task or an established pattern justifies otherwise.

## Architecture

- **MUST** build on the existing Next.js 16 App Router, React 19, and strict TypeScript setup; use `@/*` for imports from `src/`.
- **MUST** keep routes and layouts in `src/app/`, feature-specific screens/forms/schemas/actions in `src/templates/<feature>/`, shared components in `src/components/`, and shared hooks, contexts, models, and utilities in their existing `src/` areas.
- **SHOULD** keep components focused: extract reusable UI when it serves multiple features, and keep persistence and business rules out of presentation components.
- **MUST** use the existing Prisma schema and generated Prisma client for MongoDB data access; do not edit generated client files.
- **MUST NOT** introduce abstractions, factories, wrappers, or generic utilities without a concrete need. Prefer straightforward solutions over speculative extensibility.
- **SHOULD** favor small, cohesive changes that fit the current structure over introducing new layers or abstractions.

## TypeScript

- **MUST** preserve `strict` type checking and define explicit contracts for component props, action inputs, and returned data.
- **MUST NOT** introduce `any`. Prefer precise types, `unknown` plus validation for untrusted values, and schema-inferred form types.
- **MUST NOT** use type assertions to bypass errors when a type guard, schema, or corrected contract can express the actual invariant.
- **SHOULD** use descriptive PascalCase type/interface names, camelCase values and functions, and `use`-prefixed hook names. Keep filenames kebab-case and follow existing names when changing legacy code.

## React and Next.js

- **MUST** default to Server Components. Add `'use client'` only for browser APIs, state/effects, event handlers, or client-only providers; keep the client boundary as small as practical.
- **MUST** perform privileged data access and authorization on the server. Validate every Server Action input on the server; client-side form validation is for user experience, not a security boundary.
- **SHOULD** fetch data in the nearest appropriate server component or action, and use the existing React Query setup only where client-side query behavior is needed.
- **MUST** preserve Next.js navigation and cache behavior when changing mutations, including revalidation where affected pages depend on updated data.
- **MUST** use semantic HTML, associate labels with controls, expose validation/errors accessibly, and support keyboard interaction.
- **SHOULD** prefer composition and focused components over large components with many conditional branches or boolean props.
- **SHOULD** avoid unnecessary client-side JavaScript, repeated requests, and expensive work during render.

## Testing

- **MUST** test observable behavior and important edge cases, not implementation details. Structure tests with Arrange, Act, and Assert phases and keep them deterministic.
- **MUST** add regression tests when fixing bugs.
- **MUST** verify loading, success, empty, and error states when they are relevant to the component or feature.
- **MUST NOT** write tests solely to increase coverage numbers.
- **MUST** include appropriate tests for every new feature.
- **MUST NOT** test private methods, internal component state, or implementation details.
- **MUST** mock external dependencies and boundaries, not the functionality under test.
- **MUST NOT** skip, disable, or weaken tests merely to make the suite pass.
- **MUST** run the relevant tests before considering a task complete and report any failures.
- **SHOULD** use explicit, descriptive test names.
- **SHOULD** use Vitest and React Testing Library for unit/component behavior; mock only external boundaries that make a test unreliable or unnecessarily costly.
- **SHOULD** colocate unit and component tests with the code they cover, following existing project conventions.
- **SHOULD** use Playwright for browser-level flows only when it is configured and available in the project. Playwright is not currently listed in `package.json`; do not add it solely to satisfy this guidance.
- Existing commands: `npm run lint`, `npm run test:run` (one-shot), and `npm run test` (interactive). There is no dedicated type-check script in `package.json`; do not report a separate type-check as available.

## Code Quality and Security

- **MUST** reuse existing validation schemas, shared utilities, and components rather than duplicating rules or behavior.
- **MUST** handle errors explicitly: do not silently swallow failures or return success-shaped fallbacks. Log only what is needed to diagnose failures and provide safe, useful user-facing feedback.
- **MUST** authenticate and authorize every protected server operation using the server-side Better Auth session and the required role. A protected layout or client-side role check alone is not authorization.
- **MUST** validate and constrain untrusted input before using it in database operations or external requests.
- **MUST** keep database operations consistent with the existing Prisma schema and data relationships.
- **MUST** handle nullable and optional database fields explicitly.
- **SHOULD** avoid unnecessary database queries and fetch only the data required.
- **MUST** keep secrets and private configuration server-side; never expose them through `NEXT_PUBLIC_*`, client props, source control, or logs. Do not log sensitive personal or clinical data.
- **SHOULD** use the existing Tailwind CSS and shared UI conventions, and avoid adding dependencies when current project tools can solve the problem.

## AI-Assisted Changes

- **MUST** inspect the relevant code and tests before editing, follow established patterns, and limit changes to the requested scope.
- **MUST NOT** claim that lint, type-checking, or tests pass unless the corresponding command was actually run; state clearly what was and was not verified.
- **SHOULD** update directly related documentation when behavior or established conventions change.
