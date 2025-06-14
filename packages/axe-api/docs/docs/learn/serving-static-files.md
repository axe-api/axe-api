# Serving static files

<p class="description">
Axe API allows developers to serve static file easily.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is serving static files?</li>
  <li>How to serve static files?</li>
</ul>

## Getting started

Static files, like CSS, JavaScript, and images, remain unchanged during application runtime. Unlike dynamically generated content, they play a vital role in enhancing aesthetics and functionality. Axe API can serve these files statically. Ensuring appealing web design, static files are essential as modern users expect visually pleasing websites, necessitating at least some CSS styling.

## `serve-static` Middleware

You can use [serve-static](https://www.npmjs.com/package/serve-static) middleware in your apps.

First, you need to install it:

```bash
$ npm install serve-static
```

Then you can add the middleware in any `onBeforeInit` or `onAfterInit` functions like the following example:

::: code-group

```ts [app/v1/init.ts]
import { App } from "axe-api";
import serveStatic from "serve-static";
import path from "path";

const onBeforeInit = async (app: App) => {
  app.use(serveStatic(path.join(__dirname, "..", "..", "static")));
};

const onAfterInit = async (app: App) => {
  // Set global error handler.
};

export { onBeforeInit, onAfterInit };
```

:::

After the middleware integration, you can serve all static files under `static` directory.

## Next steps

In this section, we tried to explain how you can serve static files.

In the next section, we are going to talk about how to create authentication system to your API.
