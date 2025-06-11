import AxeRequest from "../Services/AxeRequest";
import AxeResponse from "../Services/AxeResponse";
import { DocumentationService } from "../Services";

export default async (_req: AxeRequest, res: AxeResponse) => {
  const docs = DocumentationService.getInstance();
  res.json(docs.get().map((route) => `${route.method} ${route.url}`));
};
