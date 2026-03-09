# Project Guidelines

## Code Style

- Prettier enforces 140-char lines, single quotes, 2-space indentation.

## Architecture

- Entry point is `src/main.ts` and root module is `src/app/app.module.ts`.
- Core services/state live under `src/app/core/`.
- Feature areas are under `src/app/features/` with shared UI in `src/app/shared/`.
- Global state is managed via NgRx with `src/app/core/app.state.ts`.

## Build and Test

- `pnpm start` starts the Angular dev server.
- `pnpm build` produces production output in `dist/fbm-frontend/`.
- `pnpm test` runs Karma/Jasmine tests.
- Formatting helpers: `pnpm format:check` and `pnpm prettier`.

## Conventions

- HTTP behavior is centralized in core interceptors; prefer extending existing ones.
- Environment values are sourced from `src/environments/`.
- `strictNullChecks` is disabled; be explicit about null handling in new code.
