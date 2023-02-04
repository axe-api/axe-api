import { ApiError } from "axe-api";

const onBeforeForceDelete = async () => {
  throw new ApiError("This is just a test message.");
};

export { onBeforeForceDelete };
