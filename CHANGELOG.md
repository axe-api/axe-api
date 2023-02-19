# Release Notes

## [0.30.0 (???)](https://github.com/axe-api/axe-api/compare/0.30.0...?)

### Breaking Changes

- Added new Serizaliation folder [#125](https://github.com/axe-api/axe-api/issues/125)
- Added multiple version support [#137](https://github.com/axe-api/axe-api/issues/137)
- New hook/event folder structure [#146](https://github.com/axe-api/axe-api/issues/146)
- Limiting query features by configurations [#38](https://github.com/axe-api/axe-api/issues/38)

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
