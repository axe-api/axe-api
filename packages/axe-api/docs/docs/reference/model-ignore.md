# Model.`ignore()`

In case you don't want to create routes for a model, Axe API provides ignore getter. Using the ignore getter you can block the model for auto-route creation. By default, ignore getter returns false. But you can change the value like the following code;

```ts
import { Model } from "axe-api";

class User extends Model {
  get ignore() {
    return true;
  }
}

export default User;
```

With this configuration, `User` model's routes wouldn't be created automatically.
