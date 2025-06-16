# `addRequest()`

You can add an interceptor function to manipulate the HTTP request before sending it.

```ts
import api, { IRequest } from "axe-api-client";

api.interceptors.addRequest((request: IRequest) => {
  // you manipulate the IRequest object before the sending
  return request;
});
```
