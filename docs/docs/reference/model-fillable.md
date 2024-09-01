# Model.`fillable()`

By default, we don't allow the user to send any data to create or update a record, because of security issues. If you want to allow what kind of data can be filled, you should use `fillable` getter in your model.

```ts
import { Model } from "axe-api";

class Users extends Model {
  get fillable() {
    return ["email", "name", "surname", "age"];
  }
}

export default User;
```

In this example, **email**, **name**, **surname** and **age** columns can be editable by users in **CREATE** and **UPDATE** handlers. If you have a field like **my_secret** and you don't want to make it fillable by users, you **shouldn't** add it to this array. Then it will be safe and only editable by yourself.

On the other hand, you can decide different fillable column list by the HTTP method type. For example, usually, we don't want to change the email in the profile update request because it takes too many actions such as sending a confirmation email.

```ts
import { Model, HttpMethods } from "axe-api";

class Users extends Model {
  get fillable() {
    return {
      [HttpMethods.POST]: ["email", "name", "surname", "age"],
      [HttpMethods.PUT]: ["name", "surname", "age"],
    };
  }
}

export default User;
```

Like the code above, changing **email** has more complex logic because of security. So you may not want to make it editable in update actions.
