# Release Notes

## [1.4.3 (2024-08-31)](https://github.com/axe-api/axe-api/compare/1.4.3...1.4.2)

### Fixed

- Security upgrades
- Removed `nodemon`.

## [1.4.2 (2024-07-26)](https://github.com/axe-api/axe-api/compare/1.4.2...1.4.1)

### Fixed

- Security upgrades

## [1.4.1 (2024-04-20)](https://github.com/axe-api/axe-api/compare/1.4.1...1.4.0)

### Fixed

- Text query issue [#438](https://github.com/axe-api/axe-api/issues/438)

## [1.4.0 (2024-04-20)](https://github.com/axe-api/axe-api/compare/1.4.0...1.3.1)

### Features

- Unified Axe CLI is implemented [#143](https://github.com/axe-api/axe-api/issues/143)

## [1.3.1 (2024-04-15)](https://github.com/axe-api/axe-api/compare/1.3.1...1.3.0)

### Fixed

- Fixed redis connection issues [#281](https://github.com/axe-api/axe-api/issues/281)
- Dependency upgrades

## [1.3.0 (2024-04-08)](https://github.com/axe-api/axe-api/compare/1.3.0...1.2.0)

### Features

- `index.ts` file for hook functions [#400](https://github.com/axe-api/axe-api/issues/400)
- Dependency upgrades

## [1.2.0 (2024-03-16)](https://github.com/axe-api/axe-api/compare/1.2.0...1.1.0)

### Features

- Advanced hook types [#390](https://github.com/axe-api/axe-api/issues/390)
- Short serialization file name [#391](https://github.com/axe-api/axe-api/issues/391)

## [1.1.0 (2024-02-18)](https://github.com/axe-api/axe-api/compare/1.1.0...1.0.11)

### Features

- Disabling auto-route creation for has-many relations [#366](https://github.com/axe-api/axe-api/pull/366)
- Supporting robus-validator library [#368](https://github.com/axe-api/axe-api/pull/368)
- Fixed security issues
- Dependency upgrades.

### Fixed

- Dependency upgrades.

## [1.0.11 (2024-02-07)](https://github.com/axe-api/axe-api/compare/1.0.11...1.0.10)

### Fixed

- Dependency upgrades.

## [1.0.10 (2024-01-15)](https://github.com/axe-api/axe-api/compare/1.0.10...1.0.9)

### Fixed

- Missing query features on the ALL handler [#330](https://github.com/axe-api/axe-api/issues/330)

## [1.0.9 (2024-01-14)](https://github.com/axe-api/axe-api/compare/1.0.9...1.0.8)

### Fixed

- [serve-static](https://www.npmjs.com/package/serve-static) middleware type error [#326](https://github.com/axe-api/axe-api/issues/326)

## [1.0.8 (2024-01-12)](https://github.com/axe-api/axe-api/compare/1.0.8...1.0.7)

### Fixed

- Security fix [#43](https://github.com/axe-api/axe-api/security/dependabot/43)
- Dependabot upgrades.

## [1.0.7 (2024-01-06)](https://github.com/axe-api/axe-api/compare/1.0.7...1.0.6)

### Fixed

- Connect middleware errors [#308](https://github.com/axe-api/axe-api/issues/308)
- Dependabot upgrades.

## [1.0.6 (2023-12-31)](https://github.com/axe-api/axe-api/compare/1.0.6...1.0.5)

### Fixed

- Fixed query field need to be string error on postgres table [#305](https://github.com/axe-api/axe-api/issues/305)

## [1.0.5 (2023-12-21)](https://github.com/axe-api/axe-api/compare/1.0.5...1.0.4)

### Fixed

- Dependabot upgrades.

## [1.0.4 (2023-12-21)](https://github.com/axe-api/axe-api/compare/1.0.4...1.0.3)

### Fixed

- Dependabot upgrades.

## [1.0.3 (2023-12-20)](https://github.com/axe-api/axe-api/compare/1.0.3...1.0.2)

### Fixed

- Dependabot upgrades.

## [1.0.2 (2023-12-17)](https://github.com/axe-api/axe-api/compare/1.0.2...1.0.1)

### Fixed

- Redis-related connection issue [#281](https://github.com/axe-api/axe-api/issues/281)

## [1.0.1 (2023-12-15)](https://github.com/axe-api/axe-api/compare/1.0.1...1.0.0)

### Fixed

- Auto-caching issue [#279](https://github.com/axe-api/axe-api/issues/279)

## [1.0.0 (2023-12-15)](https://github.com/axe-api/axe-api/compare/1.0.0...0.31.7)

### Breaking changes

- Express.js has been removed. Axe API uses the http module instead. [#47](https://github.com/axe-api/axe-api/issues/47)

### Features

- Pino logger integration [#227](https://github.com/axe-api/axe-api/issues/227)
- Internal rate limiter [#262](https://github.com/axe-api/axe-api/issues/262)
- JSDocs comments [#242](https://github.com/axe-api/axe-api/issues/242)
- Swagger integration [#268](https://github.com/axe-api/axe-api/issues/268)
- DB informations should be logged [#269](https://github.com/axe-api/axe-api/issues/269)
- Auto-caching support [#153](https://github.com/axe-api/axe-api/issues/153)
- Full-text search [#276](https://github.com/axe-api/axe-api/issues/276)

### Bugs

- All configurations should have a default value [#154](https://github.com/axe-api/axe-api/issues/154)
- Creating new record should return 201 status code [#261](https://github.com/axe-api/axe-api/issues/261)
- Transaction support is not able to used under model middlewares [#175](https://github.com/axe-api/axe-api/issues/175)
- Checking foreign key values on insert/update [#176](https://github.com/axe-api/axe-api/issues/176)
- Checking foreignKey value if exists on the table in related queries [#132](https://github.com/axe-api/axe-api/issues/132)

## [0.31.7 (2023-12-01)](https://github.com/axe-api/axe-api/compare/0.31.7...0.31.6)

### Fixed

- Security updates. ([#42](https://github.com/axe-api/axe-api/security/dependabot/42)

## [0.31.6 (2023-10-22)](https://github.com/axe-api/axe-api/compare/0.31.6...0.31.5)

### Fixed

- Security updates. ([#40](https://github.com/axe-api/axe-api/security/dependabot/40), [#41](https://github.com/axe-api/axe-api/security/dependabot/41))

## [0.31.5 (2023-09-09)](https://github.com/axe-api/axe-api/compare/0.31.5...0.31.4)

### Fixed

- URL parameter naming issue [#168](https://github.com/axe-api/axe-api/issues/168)
- `LIKE` operator should not be able to use on non-string columns [#96](https://github.com/axe-api/axe-api/issues/96)

## [0.31.4 (2023-07-27)](https://github.com/axe-api/axe-api/compare/0.31.4...0.31.3)

### Fixed

- Fixed `$in` and `$between` queries [#252](https://github.com/axe-api/axe-api/issues/252)
- Fixed wrong HTTP status codes

### Internal

- Added integrations tests for MariaDB, CockroachDB, and SQLite

## [0.31.3 (2023-07-19)](https://github.com/axe-api/axe-api/compare/0.31.3...0.31.2)

### Fixed

- Security fixes.

## [0.31.2 (2023-07-04)](https://github.com/axe-api/axe-api/compare/0.31.2...0.31.1)

### Fixed

- Fixed many internal issues. [#219](https://github.com/axe-api/axe-api/issues/219), [#174](https://github.com/axe-api/axe-api/issues/174), [#183](https://github.com/axe-api/axe-api/issues/183), [#149](https://github.com/axe-api/axe-api/issues/149), [#186](https://github.com/axe-api/axe-api/issues/186)

## [0.31.1 (2023-05-08)](https://github.com/axe-api/axe-api/compare/0.31.1...0.31.0)

### Fixed

- The app crashes on database errors [#155](https://github.com/axe-api/axe-api/issues/155)
- We should return 404 if the record is not found [#169](https://github.com/axe-api/axe-api/issues/169)
- An error should be thrown if the per_page value is not acceptable [#172](https://github.com/axe-api/axe-api/issues/172)

## [0.31.0 (2023-05-05)](https://github.com/axe-api/axe-api/compare/0.31.0...0.30.3)

### Features

- Added new auto-created documentation values [#179](https://github.com/axe-api/axe-api/issues/179)

### Fixed

- Fixed PostgreSQL-related issues [#204](https://github.com/axe-api/axe-api/issues/204)

## [0.30.3 (2023-05-05)](https://github.com/axe-api/axe-api/compare/0.30.3...0.30.2)

### Fixed

- Fixed security issues on dependencies.

## [0.30.2 (2023-04-18)](https://github.com/axe-api/axe-api/compare/0.30.2...0.30.1)

### Features

- Event/Hook type warning added [#163](https://github.com/axe-api/axe-api/issues/163)

## [0.30.1 (2023-04-15)](https://github.com/axe-api/axe-api/compare/0.30.1...0.30.0)

### Fixed

- Fixed URL slash character difference between windows and \*nix [#164](https://github.com/axe-api/axe-api/issues/164)

## [0.30.0 (2023-04-05)](https://github.com/axe-api/axe-api/compare/0.30.0...0.22.0)

### Breaking Changes

- Added new Serizaliation folder [#125](https://github.com/axe-api/axe-api/issues/125)
- New hook/event folder structure [#146](https://github.com/axe-api/axe-api/issues/146)
- Limiting query features by configurations [#38](https://github.com/axe-api/axe-api/issues/38)
- Removing external dependencies from axe-core [#151](https://github.com/axe-api/axe-api/issues/151)

## [0.22.0 (2023-01-29)](https://github.com/axe-api/axe-api/compare/0.22.0...0.21.0)

### Features

- Added Soft-Deleting feature [#41](https://github.com/axe-api/axe-api/issues/41)

### Fixed

- Fixed model relation route URLs [#141](https://github.com/axe-api/axe-api/issues/141)

## [0.21.0 (2022-12-28)](https://github.com/axe-api/axe-api/compare/0.21.0...0.20.4)

### Features

- Added `i18n` support. [#44](https://github.com/axe-api/axe-api/issues/44)

## [0.20.4 (2022-12-24)](https://github.com/axe-api/axe-api/compare/0.20.4...0.20.3)

### Fixed

- Fixed [#124](https://github.com/axe-api/axe-api/issues/124)
- Throwing errors in the `development` environment has been fixed.
- Unbuilt integration test issue has been fixed.

## [0.20.3 (2022-12-24)](https://github.com/axe-api/axe-api/compare/0.20.3...0.20.0)

### Fixed

- NPM publish bugs

## [0.20.0 (2022-12-24)](https://github.com/axe-api/axe-api/compare/0.20.0...0.19.2)

In the whole application, TypeScript becomes the new language except for migration files and it's structure. You can read the documentation about how to migrate from `0.19.2` to `0.20.0`.

### Breaking Changes

#### Naming Changes

- File extensions: `User.js` to `User.ts`
- `LOG_LEVELS` constant variable has been changed with `LogLevels` enum.
- `HANDLERS` constant variable has been changed with `HandlerTypes` enum.
- `IoC` service has been renamed as `IoCService`.
- Hooks and Event files' names should be singular;
  - `UserHooks.js` => `UserHook.ts`
  - `UserEvents.js` => `UserEvent.ts`

#### Interface Changes

- `validations()` getter should return `IMethodBaseValidations` interface.
- In hook functions, `IHookParameter` interface should be used as the parameter type.
- Init functions (`onBeforeInit`, `onAfterInit`) should be use the `Express` type;
  - `const onBeforeInit = async ({ app }) => {` => `const onBeforeInit = async (app: Express) => {`
  - `const onAfterInit = async ({ app }) => {` => `const onAfterInit = async (app: Express) => {`
- Application config should be implemented `IApplicationConfig` interface.

#### Implementation Changes

- Starting server part has been changed;
  - `const server = new Server(appFolder)` => `const server = new Server()`
  - `server.listen()` => `server.start(__dirname);`
- `knexfile.js` should not use the `app/Application/Config.js` anymore.

## [0.19.2 (2022-01-22)](https://github.com/axe-api/axe-api/compare/0.19.2...0.19.1)

### Fixed

- Fixed the calling `onBeforePaginate` and `onBeforeShow` hooks bug.

## [0.19.1 (2022-01-22)](https://github.com/axe-api/axe-api/compare/0.19.1...0.19.0)

### Fixed

- knex.js version update.

## [0.19.0 (2021-12-05)](https://github.com/axe-api/axe-api/compare/0.19.0...0.18.1)

### Fixed

- [#110](https://github.com/axe-api/axe-api/issues/110)

### Enhancements

- [#106](https://github.com/axe-api/axe-api/issues/106)

## [0.18.1 (2021-12-02)](https://github.com/axe-api/axe-api/compare/0.18.1...0.18.0)

### Fixed

- [#117](https://github.com/axe-api/axe-api/issues/117)

## [0.18.0 (2021-11-30)](https://github.com/axe-api/axe-api/compare/0.18.0...0.17.5)

### Fixed

- [#115](https://github.com/axe-api/axe-api/issues/115)
- [#114](https://github.com/axe-api/axe-api/issues/114)

### Enhancements

- [#113](https://github.com/axe-api/axe-api/issues/113)
- [#107](https://github.com/axe-api/axe-api/issues/107)
- [#108](https://github.com/axe-api/axe-api/issues/108)

## [0.17.5 (2021-11-27)](https://github.com/axe-api/axe-api/compare/0.17.5...0.17.4)

### Fixed

- [#111](https://github.com/axe-api/axe-api/issues/111)

## [0.17.4 (2021-10-28)](https://github.com/axe-api/axe-api/compare/0.17.4...0.17.3)

### Fixed

- [#97](https://github.com/axe-api/axe-api/issues/97)
- [#104](https://github.com/axe-api/axe-api/issues/104)

## [0.17.3 (2021-10-28)](https://github.com/axe-api/axe-api/compare/0.17.3...0.17.2)

### Fixed

- [#98](https://github.com/axe-api/axe-api/issues/98)

## [0.17.2 (2021-10-17)](https://github.com/axe-api/axe-api/compare/0.17.2...0.17.1)

### Fixed

- Fixed table join on the related table filter.

## [0.17.1 (2021-10-17)](https://github.com/axe-api/axe-api/compare/0.17.1...0.17.0)

### Fixed

- Query bug on child models [#93](https://github.com/axe-api/axe-api/issues/93)

## [0.17.0 (2021-10-17)](https://github.com/axe-api/axe-api/compare/0.17.0...0.16.0)

### Fixed

- Related query column name check bug has been fixed.

### Features

- Global serializer for HTTP results [#37](https://github.com/axe-api/axe-api/issues/37)

## [0.16.0 (2021-10-06)](https://github.com/axe-api/axe-api/compare/0.16.0...0.15.0)

### Features

- Fixes [#89](https://github.com/axe-api/axe-api/issues/89)

## [0.15.0 (2021-10-03)](https://github.com/axe-api/axe-api/compare/0.15.0...0.14.1)

### Features

- Fixes [#87](https://github.com/axe-api/axe-api/issues/87)

## [0.14.1 (2021-09-20)](https://github.com/axe-api/axe-api/compare/0.14.1...0.14.0)

### Fixed

- Fixes [#83](https://github.com/axe-api/axe-api/issues/83)

## [0.14.0 (2021-09-15)](https://github.com/axe-api/axe-api/compare/0.14.0...0.13.3)

### Features

- General hooks definition feature has been added. ([#81](https://github.com/axe-api/axe-api/issues/81))

## [0.13.3 (2021-09-15)](https://github.com/axe-api/axe-api/compare/0.13.2...0.13.3)

### Fixed

- Fixed CORS bugs.

## [0.13.2 (2021-08-20)](https://github.com/axe-api/axe-api/compare/0.13.1...0.13.2)

### Fixed

- Fixes [#27](https://github.com/axe-api/axe-api/issues/27)
- Fixes [#29](https://github.com/axe-api/axe-api/issues/29)
- Fixes [#75](https://github.com/axe-api/axe-api/issues/75)
- Fixes [#78](https://github.com/axe-api/axe-api/issues/78)

## [0.13.1 (2021-08-09)](https://github.com/axe-api/axe-api/compare/0.13.0...0.13.1)

### Fixed

- Fixes [#69](https://github.com/axe-api/axe-api/issues/69)
- Fixes [#70](https://github.com/axe-api/axe-api/issues/70)
- Fixes [#71](https://github.com/axe-api/axe-api/issues/71)
- Fixes [#72](https://github.com/axe-api/axe-api/issues/72)

## [0.13.0 (2021-07-25)](https://github.com/axe-api/axe-api/compare/0.12.2...0.13.0)

### Features

- PostgreSQL database analyzer and integration tests have been added.

## [0.12.2 (2021-07-24)](https://github.com/axe-api/axe-api/compare/0.12.1...0.12.2)

### Fixed

- Throwing an error if the primary key column isn't in the database table bug has been fixed. (#61)[https://github.com/axe-api/axe-api/issues/61]
- Using numeric column name bug has been fixed. (#24)[https://github.com/axe-api/axe-api/issues/24]

## [0.12.1 (2021-07-24)](https://github.com/axe-api/axe-api/compare/0.12.0...0.12.1)

### Fixed

- Fixed security issues.
