# GitHub Copilot Instructions — axe-api

## Project overview

**axe-api** is a TypeScript-first Node.js framework for building REST APIs quickly. It works on top of Express.js and Knex (SQL query builder), using a **model-driven, convention-over-configuration** approach where declaring a `Model` class is enough to automatically expose paginate, show, insert, update, patch, and delete HTTP endpoints.

This repository is a **Lerna monorepo** with the following packages:

| Package           | Path                     | Purpose                           |
| ----------------- | ------------------------ | --------------------------------- |
| `axe-api`         | `packages/axe-api/`      | Core framework library            |
| `axe-api-dev-kit` | `packages/dev-kit/`      | Local development sandbox app     |
| `integrations`    | `packages/integrations/` | Integration test suite (multi-DB) |
| `docs`            | `packages/docs/`         | VitePress documentation site      |

---

## Tech stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js
- **HTTP layer**: Express.js
- **Database**: Knex query builder + knex-schema-inspector (supports MySQL, MariaDB, PostgreSQL, SQLite, CockroachDB)
- **Test runner**: Vitest
- **Validation**: `validatorjs` or `robust-validator` (configurable)
- **Search**: Elasticsearch (`@elastic/elasticsearch`)
- **Caching/Rate-limit**: Redis or in-memory adaptor
- **DI container**: Custom `IoCService` (static, string-keyed)
- **Env config**: `dotenv`

---

## Repository layout (`packages/axe-api/src/`)

```
Builders/        ModelTreeBuilder, RouterBuilder, IndexBuilder
Exceptions/      Custom AxeError types
Handlers/        Express route handler entry points (RequestHandler, SwaggerHandler, …)
Middlewares/     Express middlewares (rate limit, etc.)
Phases/          Per-handler pipeline phases (query, hook, event, validation, …)
Resolvers/       ModelResolver, VersionResolver, VersionConfigResolver
Services/        Singleton services (IoCService, LogService, APIService, …)
Steps/           Reusable pipeline step wrappers (Phase, Hook, Event)
Validators/      ValidatorFactory
Enums.ts         All enums (HandlerTypes, HookFunctionTypes, Relationships, …)
Interfaces.ts    All TypeScript interfaces
Types.ts         Type aliases (PhaseFunction, HandlerFunction, …)
constants.ts     DEFAULT_HANDLERS, DEFAULT_APP_CONFIG, step definitions, …
Model.ts         Base Model class
Server.ts        Server bootstrap class
```

---

## Core concepts

### Model

Every API resource is represented by a class that extends `Model`. Getters define its behaviour — never constructor assignments.

```typescript
import { Model, HandlerTypes } from "axe-api";

class User extends Model {
  get primaryKey() {
    return "id";
  }
  get table() {
    return "users";
  } // default: snake_case plural of class name

  get fillable() {
    return {
      POST: ["name", "email", "password"],
      PUT: ["name", "email"],
      PATCH: ["name"],
    };
  }

  get validations() {
    return {
      POST: { name: "required|min:1|max:100", email: "required|email" },
    };
  }

  get handlers() {
    return [
      HandlerTypes.PAGINATE,
      HandlerTypes.SHOW,
      HandlerTypes.INSERT,
      HandlerTypes.UPDATE,
    ];
  }
}

export default User;
```

Key `Model` getters:

| Getter        | Type                                                    | Default                            |
| ------------- | ------------------------------------------------------- | ---------------------------------- |
| `primaryKey`  | `string`                                                | `"id"`                             |
| `table`       | `string`                                                | plural snake_case of class name    |
| `fillable`    | `string[] \| IMethodBaseConfig<string[]>`               | `[]`                               |
| `validations` | `ModelValidation \| IMethodBaseConfig<ModelValidation>` | `{}`                               |
| `handlers`    | `HandlerTypes[]`                                        | all except FORCE_DELETE and SEARCH |
| `middlewares` | `ModelMiddleware`                                       | `[]`                               |
| `transaction` | `boolean \| IHandlerBasedTransactionConfig[]`           | `false`                            |
| `cache`       | `ICacheConfiguration \| IHandlerBasedCacheConfig[]`     | disabled                           |
| `serializers` | serializer array                                        | `[]`                               |

### HandlerTypes enum

```typescript
HandlerTypes.INSERT; // POST   /resource
HandlerTypes.PAGINATE; // GET    /resource
HandlerTypes.SHOW; // GET    /resource/:id
HandlerTypes.UPDATE; // PUT    /resource/:id
HandlerTypes.PATCH; // PATCH  /resource/:id
HandlerTypes.DELETE; // DELETE /resource/:id
HandlerTypes.FORCE_DELETE; // DELETE /resource/:id/force
HandlerTypes.ALL; // GET    /resource/all  (no pagination)
HandlerTypes.SEARCH; // GET    /resource/search  (Elasticsearch)
```

### Relationships

Defined as getters on the `Model` returning `IRelation` objects.

```typescript
hasMany(relatedModel: typeof Model, foreignKey: string, localKey?: string): IRelation
hasOne(relatedModel: typeof Model, foreignKey: string, localKey?: string): IRelation
belongsTo(relatedModel: typeof Model, foreignKey: string, otherKey?: string): IRelation
```

### Hooks & Events (`HookFunctionTypes`)

Files placed in `app/v1/Hooks/` are auto-discovered. Each export is a `PhaseFunction`:

```typescript
// app/v1/Hooks/UserHooks.ts
import { IContext } from "axe-api";

export const onBeforeInsert = async ({
  formData,
  req,
  res,
  model,
  database,
}: IContext) => {
  formData.createdAt = new Date();
};

export const onAfterInsert = async ({ item, req, res }: IContext) => {
  // send welcome email, etc.
};
```

Available hooks follow the pattern `onBefore<Operation>` / `onAfter<Operation>` for every `HandlerTypes` value (e.g. `onBeforePaginate`, `onAfterDelete`).

### Events

Same signature as hooks but executed asynchronously (fire-and-forget) after the response is sent. Files live in `app/v1/Events/`.

### IoCService

Static IoC container. Always use `await IoCService.use<T>()` for async resolution.

```typescript
// register
IoCService.singleton("Mailer", () => new NodeMailer(config));

// resolve
const mailer = await IoCService.use<NodeMailer>("Mailer");
```

Pre-registered singletons: `"Database"` (Knex), `"Redis"`, `"Elastic"`, `"App"`, `"SchemaInspector"`.

### PhaseFunction / pipeline

Internal request processing is composed of ordered `Phase`, `Hook`, and `Event` steps. When adding a new built-in handler, add its step pipeline in `constants.ts` following existing patterns in `DEFAULT_HANDLERS_STEPS`.

---

## Coding conventions

### TypeScript

- Always use **strict TypeScript**; avoid `any` except where third-party types are unavailable.
- Prefer `interface` for object shapes, `type` for unions/aliases/function signatures.
- All interfaces go in `Interfaces.ts`; all type aliases go in `Types.ts`; all enums go in `Enums.ts`.
- Export types/interfaces individually (no barrel `export * from`).

### Naming

- Classes: `PascalCase`
- Files: `PascalCase` for classes (`UserHandler.ts`), `camelCase` for utilities (`helpers.ts`)
- Enums: `PascalCase` key names, string values
- Constants: `UPPER_SNAKE_CASE`

### JSDoc

Every public method and getter must have a JSDoc block with `@example` and `@tutorial` pointing to `https://axe-api.com/reference/`.

### File structure

- One class per file.
- Group related files in the matching uppercase folder (`Handlers/`, `Services/`, `Phases/`, …). Do not create new top-level folders without discussion.

### Error handling

Throw `AxeError` (from `Exceptions/`) for user-facing errors. The `Server` class catches these and logs them via `LogService.error()` without crashing; unknown errors are re-thrown.

---

## Testing

### Unit tests (`packages/axe-api/tests/unit/`)

- Framework: **Vitest**
- File pattern: `**/*.spec.ts`
- Use mock models from `tests/unit/__Mocks/` — add new mocks there, do not create inline ad-hoc classes.
- Run: `npm run test` inside `packages/axe-api/`

### Integration tests (`packages/integrations/`)

- Spin up a real database with the matching `composes/docker-compose.<db>.yml`
- Run with the helper script: `sh run-tests.sh <db> <concurrency>` (e.g. `sh run-tests.sh sqlite 5`)
- Supported databases: `sqlite`, `mysql`, `mysql57`, `mysql2`, `mariadb`, `postgres11`–`postgres15`, `cockroach`
- Test files live in `packages/integrations/tests/`

### What to test

- Unit-test any new logic added to `Model`, `Services`, `Handlers`, `Resolvers`, `Builders`, or `Validators`.
- Integration-test any new HTTP handler or query-layer change.
- Maintain high coverage for the core `Model` class.

---

## Versioning and app layout (user-facing app structure)

A user's axe-api application has this layout:

```
app/
  config.ts          # IApplicationConfig
  v1/                # API version directory
    config.ts        # AxeVersionConfig
    init.ts          # (optional) version init hook
    Models/          # Model class files
    Hooks/           # Hook files (HookFunctionTypes exports)
    Events/          # Event files
    Handlers/        # Custom handler overrides
    Serialization/   # Serializer functions
```

Multiple versions (`v1/`, `v2/`, …) are supported out of the box. The `VersionResolver` discovers them automatically.

---

## Building

```bash
# Build the core library
cd packages/axe-api && npm run build

# Watch mode during development
cd packages/axe-api && npm run build:watch

# Run the dev-kit sandbox
cd packages/dev-kit && npm run dev
```

---

## Linting & formatting

```bash
npm run lint              # ESLint
npm run prettier:check    # Prettier check
npm run prettier:write    # Auto-fix formatting
```

Prettier and ESLint configs are at the `packages/axe-api/` level. Match the existing indentation (2-space, double-quotes in the tsconfig output, single-quotes in source).

---

## PR / contribution guidelines

- Branch from `main`, prefix branches with the issue number: `123-short-description`.
- PR title must reference the issue: `Fixed #123 — short description`.
- Every new feature needs unit tests; every new handler/query change needs an integration test.
- Do not modify `build/` — it is generated.
- Do not add new `package.json` dependencies to the root or `dev-kit`; add them only to the package that needs them.
