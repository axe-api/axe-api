# Model.`validations()`

Everybody needs to form validation in their API. Axe API uses <a href="https://www.npmjs.com/package/validatorjs" target="_blank" rel="noreferrer">validatorjs</a> internally.

The thing you should do to define validations is adding a validation method to your model. The validation method should return an object which describes how form validation should be.

```ts
import { Model } from "axe-api";

class Users extends Model {
  get validations() {
    return {
      email: "required|email",
      name: "required|max:50",
      surname: "required|max:50",
      age: "max:100",
    };
  }
}

export default User;
```

This form validation method will be triggered before **CREATE** and **UPDATE** handlers.

On the other hand, if you want to use different validation rules in **creating** and **updating** a model record, you can use following structure;

```ts
import { Model, HttpMethods } from "axe-api";

class Users extends Model {
  get validations() {
    return {
      [HttpMethods.POST]: {
        email: "required|email",
        name: "required|max:50",
      },
      [HttpMethods.PUT]: {
        name: "required|max:50",
      },
    };
  }
}

export default User;
```

If the form data doesn't provide validation rules, Axe API will respond as a validation error like this;

```json
{
  "errors": {
    "email": ["The email field is required."],
    "name": ["The name field is required."]
  }
}
```

:::tip
HTTP status code will be 400 (Bad Request) in that HTTP response.
:::
