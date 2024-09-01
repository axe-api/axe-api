# Error Codes

You can find Axe API error details on this page.

## `UNACCEPTABLE_VERSION_NAME`

The version name must be alpha-numeric. The following version names are acceptable;

- `v1`
- `v12`
- `beta`
- `alfa`

The following version names are not acceptable;

- `v1%`
- `v1-`
- `v1/`
- `v1;`

## `VERSION_CONFIG_NOT_FOUND`

Each version must have a config file which is called `config.ts`. For example;

`/app/v1/config.ts`

```ts
import { IVersionConfig } from "axe-api";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en-GB", "en", "tr", "de"],
  defaultLanguage: "en-GB",
};

export default config;
```

## `TABLE_DOESNT_HAVE_ANY_COLUMN`

It means that your model is not relevant to a database table correctly. Axe API uses the plural version of the model name. For example;

- `User.ts` => `users`

You have to be sure the name that is looking from Axe API and the database table name is the same.

:::tip
You can specify the name in the model definitions; [Table Name](/reference/model-table)
:::

## `RESERVED_VERSION_NAME`

The following names can not be used as a version names;

- `Config`
- `Events`
- `Hooks`
- `Models`
- `Serialization`

## `UNDEFINED_COLUMN`

This error means a column that is used in some of your models is not found on the database table. You should be sure that;

- All model files are using the correct database table
- The model file uses the correct columns on the database table.
- The database table has the correct column.

## `UNDEFINED_RELATION_MODEL`

This error means that a relationship definition is pointing to a model which is not found.

## `UNDEFINED_HOOK_MODEL_RELATION`

That error means that there are some unknown model names under Hooks or Events folder. You must use the same model name in the hook and event folder.

Let's assume that you have a model called `User.ts`. You must have the following folders for this model;

- `app/v1/Hooks/User/*.ts`
- `app/v1/Events/User/*.ts`

:::warning
You can not use a model name that can not be related to a model for the same version. You have to have a model called `User.ts` in your model folder.
:::

## `UNACCEPTABLE_HOOK_FILE`

You can not define a hook or event file in directly the hooks or events folder. All of your hooks and events should be defined under a model name.

Wrong:

- `app/v1/Hooks/UserHook.ts`
- `app/v1/Event/UserEven.ts`

Correct:

- `app/v1/Hooks/User/onBeforePaginate.ts`
- `app/v1/Event/User/onBeforePaginate.ts`
