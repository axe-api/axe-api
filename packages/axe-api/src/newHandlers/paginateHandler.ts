import { IncomingMessage, ServerResponse } from "http";

export default (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "paginate handler" }));
};
