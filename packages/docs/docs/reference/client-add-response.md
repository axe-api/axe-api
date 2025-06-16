# `addResponse()`

You can add an interceptor function for each HTTP response.

```ts
import api from "axe-api-client";

api.interceptors.addResponse((response: Response) => {
  // console.log(response);
});
```
