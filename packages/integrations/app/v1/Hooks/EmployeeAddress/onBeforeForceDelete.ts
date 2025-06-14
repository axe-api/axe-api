import { ApiError } from "axe-api";

export default async () => {
  throw new ApiError("This is just a test message.");
};
