import { IncomingMessage, ServerResponse } from "http";
import { NextFunction } from "../Types";

export default (
  _err: any,
  _req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => {
  // Sett the HTTP status code
  res.statusCode = 500;

  // Set the default HTTP message
  res.write(
    JSON.stringify({
      error: "Internal server error",
    }),
  );

  res.end();
  next();
};
