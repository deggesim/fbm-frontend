# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Fantabasket Manager — Angular 14 SPA (PWA) frontend for a fantasy basketball league manager. Talks to a separate REST backend (`fbm-server`, see `src/environments/`). UI copy, domain terms and error messages are in **Italian**; keep new user-facing strings Italian.

## Commands

Package manager is **pnpm** (Node 20, see `.nvmrc`). `package-lock.json` is also committed and kept in sync via `pnpm package`.

| Task | Command |
|---|---|
| Dev server (`localhost:4200`, dev config) | `pnpm start` |
| Production build → `dist/fbm-frontend/` | `pnpm build` |
| Watch build + static server on `:8080` (tests the service worker) | `pnpm sw` |
| Unit tests (Karma/Jasmine, non-headless Chrome, watch mode) | `pnpm test` |
| Format everything | `pnpm prettier` |
| Check formatting only | `pnpm format:check` |

Notes:
- **There are currently zero `*.spec.ts` files** — `pnpm test` boots Karma and runs nothing. Adding a spec next to the file under test is enough for it to be picked up (`src/test.ts` globs `**/*.spec.ts`). To run a single spec, use `fdescribe`/`fit`, or `pnpm ng test --include='**/some.component.spec.ts'`.
- **There is no linter.** `package.json`'s `precommit` script references a nonexistent `lint` script and `lint-staged` references `tslint`, which isn't installed — both are dead config. Formatting is Prettier-only.
- Production runs on a tiny Koa static server (`server.js`, `Procfile`) that rewrites everything to `index.html` for `PathLocationStrategy` routing.

## Architecture

Classic NgModule Angular (no standalone components). Root module `src/app/app.module.ts`, routing in `src/app/app-routing.module.ts`, all feature areas lazy-loaded behind `AuthGuard`: `home`, `teams`, `competitions`, `statistics`, `admin`.

### The three interceptors are where the cross-cutting behavior lives

Registered in `app.module.ts` in this order:

1. `AuthInterceptor` — reads `token` from `localStorage`, sets `Authorization: Bearer`.
2. `TenantInterceptor` (`core/league/services/`) — reads `selectedLeague` from the NgRx store and sets a `league` header. **The app is multi-tenant by league; nearly every backend call is implicitly scoped by this header.**
3. `GlobalInterceptor` — starts/stops the global spinner and converts every HTTP error status into an Italian toast, clearing auth state and redirecting home on 401.

Consequences for new code:
- Services should be thin `HttpClient` wrappers with **no** error handling or spinner logic (see `shared/services/player.service.ts` for the canonical shape). Extend the interceptors instead.
- To suppress the spinner on a request (polling, background calls), send the header `{ hideSpinner: 'true' }`.

### NgRx holds session state only, not domain data

`core/app.state.ts` has exactly five slices: `auth`, `user`, `selectedLeague`, `leagueInfo`, `router`. Reducers wired in `core/index.ts`; effects registered in `core.module.ts`. Feature modules have **no stores of their own**.

Domain data (rosters, lineups, fixtures, players…) is loaded by **route resolvers** in `shared/resolvers/` and read from `this.route.snapshot.data['key']` inside components — see `features/teams/teams-routing.module.ts`. Don't add feature data to the store; add a resolver.

Store conventions:
- Actions are `createAction` with `'[Domain] verb'` / `... success` / `... failed` triples.
- Effects do the HTTP call, fire the toast, and persist to `localStorage` (`core/local-storage.service.ts` owns the `token` / `expires_at` / `selectedLeague` keys).
- Navigation is dispatched, not called: `RouterActions.go({ path: [...] })`, handled by `core/router/store/router.effects.ts`. That file also owns the post-league-selection redirect, which branches on league `Status` and user `Role`.
- Selectors are plain functions on `AppState` (`selectedLeague`, `leagueInfo`, `user`); only `auth.selectors.ts` uses `createSelector`.
- `LeagueEffects.init$` rehydrates `selectedLeague` from `localStorage` on `ROOT_EFFECTS_INIT`.

### Layout

- `src/app/core/` — singletons: auth (service, guard, JWT interceptor, store), league + leagueInfo store, user store, router store, spinner, local storage, header/user-profile components.
- `src/app/features/<area>/` — lazy module + `*-routing.module.ts` + one folder per component. `admin/` is gated on `Role.SuperAdmin`.
- `src/app/shared/` — `SharedModule` (declares + exports the reusable components, pipes, directive), plus `services/` (HTTP), `resolvers/`, `util/` (pure functions: `lineup.ts`, `standings.ts`, `statistics.ts`, `validations.ts`), `constants/globals.ts` (`AppConfig` enum: lineup sizes, bonuses, default grade).
- `src/app/models/` — interfaces only. Most extend `FbmModel` (`_id`, `createdAt`, `updatedAt`, `league`). Domain enums live beside them: `Status` (league phase), `Role` (user), `PlayerStatus` (EXT/COM/STR/ITA), player roles in `player.ts`.

### Domain vocabulary

`League` (tenant) → `RealFixture` (real-world game day) → `Roster` (real player on a real `Team`) → `FantasyRoster` (a roster entry owned by a `FantasyTeam`, with `contract`/`yearContract`/`draft` flags) → `Lineup` (12 slots, 5 starters, rules in `shared/util/lineup.ts`). League lifecycle: `Preseason` → `RegularSeason` → `Postseason` → `Offseason`, exposed as booleans on `LeagueInfo` and used to gate UI.

## Conventions

- Prettier: 140 cols, single quotes, 2-space indent, semicolons. Component selector prefix is `fbm`; styles are SCSS.
- TypeScript is `strict` **except** `strictNullChecks` and `strictPropertyInitialization`, which are off — be explicit about null handling in new code. Angular `strictTemplates` **is** on.
- Path aliases `@app/*` and `@env/*` exist; note that most files import `src/environments/environment` directly rather than via `@env/`.
- Components use `templateUrl` (separate `.html`), constructor injection, and reactive forms via `FormBuilder`. Default change detection everywhere; the spinner relies on `AppComponent.ngAfterViewChecked` + manual `detectChanges()`.
- Subscriptions are generally not torn down (no `OnDestroy` / `takeUntil` in the codebase). Prefer the `async` pipe or `take(1)` in new code rather than adding to the pattern.
- UI stack: Bootstrap 5 + Bootswatch, `ngx-bootstrap` (modals, datepicker, pagination, sortable…), `@ng-select/ng-select` for typeaheads, `ngx-toastr` via `ToastService`, FontAwesome solid pack. Dates use **Luxon**, not `Date`; collection helpers use **lodash-es**.
- Service worker is enabled in both configs (`ngsw-config.json` / `ngsw-config.dev.json`); `AppUpdateService` prompts the user when a new version is available.
