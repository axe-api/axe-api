import { ApiError } from "axe-api";

export const onBeforeForceDelete = async () => {
  throw new ApiError("This is just a test message.");
};
