# Validate your data

<p class="description">
Validating data is a crucial part of APIs to provide well-structured data to clients. Instead of complex solutions, Axe API support well-designed data validation practices.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is the data validation?</li>
  <li>How to validate your model data?</li>
  <li>How to validate your data for different HTTP methods?</li>
  <li>How do approach validation errors?</li>
  <li>How to add custom validations?</li>
</ul>

## What is the validation?

In the context of APIs, validation refers to the process of verifying the _correctness_, _integrity_, and _conformity_ of data or requests being sent or received through the API.

API validation typically involves checking the data or parameters against predefined rules or specifications to ensure that they meet the required format, structure, and constraints. This validation can include various aspects such as data type validation, length or size constraints, range checks, pattern matching, and more.

API validation helps ensure that the API receives valid inputs and rejects or handles any invalid or malformed requests appropriately. It helps maintain the integrity of the system, prevents errors or unexpected behavior, and improves the overall security of the API.

For example, if an API expects a parameter to be an integer within a certain range, validation would verify if the input is indeed an integer and falls within the specified range. If the input fails the validation, an appropriate error response can be returned to the client, indicating the issue with the input.

API validation is an essential part of building robust and reliable systems that interact with external applications or services, as it helps enforce data integrity, prevent data corruption, and ensure the smooth functioning of the API.

## Model-based validations

Axe API uses **_model-based_** validations to create a common validation structure on the data.

Let's look at the following example;

::: code-group

```ts {4-10} [User.ts]
import { Model } from "axe-api";

class Users extends Model {
  get validations() {
    return {
      email: "required|email|max:255",
      name: "required|max:50",
      surname: "required|max:50",
    };
  }
}

export default User;
```

:::

By the model definition, data validation rules have been defined on the model. This means the HTTP client will get a validation error if it doesn't provide the correct information.

Example cURL request and the response is defined in the following example;

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/users
```

```json [HTTP Response]
{
  "errors": {
    "email": ["The email field is required."],
    "name": ["The name field is required."],
    "surname": ["The surname field is required."]
  }
}
```

:::

As a developer, you must define your rules and Axe API handles the rest.

## Method-based validations

You might need different validation rules for different HTTP methods.

For example, the email field might be required while creating a new user. But, it might not be required while updating the user. In this case, Axe API allows you to define **_method-based_** validation rules.

Let's check the following example;

::: code-group

```ts {6-10} [User.ts]
import { Model } from "axe-api";

class Users extends Model {
  get validations() {
    return {
      POST: {
        email: "required|email|max:255",
        name: "required|max:50",
        surname: "required|max:50",
      },
      PUT: {
        name: "required|max:50",
        surname: "required|max:50",
      },
    };
  }
}

export default User;
```

:::

We've defined **_method-based_** validations for the `User` model in this example. Axe API validates the data by the HTTP method type by the example model.

## Understanding errors

Let's take the following error message as an example;

::: code-group

```json [HTTP Response]
{
  "errors": {
    "email": ["The email field is required."],
    "name": ["The name field is required."],
    "surname": ["The surname field is required."]
  }
}
```

:::

Axe API responds to invalid requests with the [400 Bad Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400). So you can understand if everything is fine by the checking HTTP status code.

In the response body, you can see the `errors` property that contains all errors. `errors` is an object, and each key of that object represents the field name.

Each field key has a validation error list that describes what kind of errors have occurred.

Axe API executes all the validation rules on all the fields. So you should be able to see all errors at the same time.

:::tip
Axe API supports internationalization the of validation errors. You can check the **[Internationalization](/learn/i18n)** page to get more information.
:::

## Custom validation rules

Axe API uses [validatorjs](https://github.com/mikeerickson/validatorjs) under the hood. You can use all validation rules on that library.

Nevertheless, basic form validation rules may not be enough to validate all of your data. You can use the [hooks](/learn/hooks-and-events) to validate the data to your requirements in that case.

## Next step

Validating user data is easy and well-structured in Axe API. Just you need to define validation rules by model or HTTP methods.

We are going to talk about auto-created API documentation for your APIs.
