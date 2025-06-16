# AxeRequest

`AxeRequest` is the request object that you can use in events, hooks and middlewarees.

For example;

```ts
import { IContext } from "axe-api";

export default async (context: IContext) => {
  const { req } = context;
};
```

## `url`

You can get the current URL object.

```ts
const url: URL = context.url;
```

## `params`

Gets the current URL params.

```ts
const params: object = context.params;
```

## `query`

Gets the URLSearchParams value.

```ts
const query: URLSearchParams = context.query;
```

## `method`

Gets the current HTTP method.

```ts
const method: string = context.method;
```

## `body`

Gets the current HTTP body.

```ts
const body: object = context.body;
```

## `currentLanguage`

Gets the current language selection by the language configuration and HTTP client request.

```ts
const language: ILanguage = context.currentLanguage;
```

This is the `ILanguage` interface content;

```ts
interface ILanguage {
  // The full title of the language. Eg: en-gb
  title: string;

  // The current language. Eg: en
  language: string;

  // The region value. Eg: gb
  region?: string | null;
}
```

## `original`

Gets the original HTTP request object.

```ts
import { IncomingMessage } from "http";

const original: IncomingMessage = context.original;
```

## `files`

Gets the uploaded files and fields. It uses the [formidable](https://github.com/node-formidable/formidable) library.

```ts
import { Fields, Files } from "formidable";

const yourAsyncFunction = async () => {
  const [fields, files] = await context.files();
};
```

## `header`

Gets the HTTP Request header by the key.

```ts
const value: string | undefined = context.header("authorization");
```
