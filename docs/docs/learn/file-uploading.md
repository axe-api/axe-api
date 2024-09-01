# File uploading

<p class="description">
Axe API provides file-uploading helpers. We are going to explain here how it is easy to add file uploading support to your API.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>How to upload files?</li>
  <li>How to handle files?</li>
  <li>How to send a file upload request to the server?</li>
</ul>

## Getting started

File uploading is an important part of APIs. You can use many different techniques and methods. We are going to explain how you can add the [formidable](https://www.npmjs.com/package/formidable) library to your API.

## Installing dependencies

First of all, let's install the dependencies. We are going to use the [formidable](https://www.npmjs.com/package/formidable) library.

```bash
$ npm install --save formidable
```

## Handling files

In Axe API, you are ready to handle files whenever you want. Let's assume that we have a `User` model and we are going to upload files in the creating new user.

We should create the following hook file;

::: code-group

```ts [app/v1/Hooks/User/onBeforeInsert.ts]
import { IContext, ApiError } from "axe-api";

export default async ({ formData, req }: IContext) => {
  const [fields, files] = await req.files();

  if (files.length === 0) {
    throw new ApiError("The file parameter is required!");
  }

  // TODO: upload file in anywhere like AWS S3, etc.

  // set the path to the original formData
  formData.path_name = "s3://filename.jpg";
};
```

:::

You can upload the file wherever you want. Also, you can set the user's model data to be saved for the file location.

:::tip
The `req.files()` method calls the `parse()` function of `formidable` library. You can get more information from the [library documentation here](https://github.com/node-formidable/formidable#with-nodejs-http-module).
:::

## Sending request

The only change is the request type.

You should send the file to the Axe API server like the following example;

```bash {2}
$ curl --location 'localhost:3000/api/v1/users' \
  --form 'file=@"/Users/my-user/Download/axe-api.png"' \
  --form 'name="John"' \
  --form 'surname="Locke"'
```

## Next steps

In this section, we simply demonstrate a file-uploading example.

In the next section, we are going to discuss about Authentication.
