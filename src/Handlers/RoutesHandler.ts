import { AxeResponse } from "../Interfaces";
import { DocumentationService } from "../Services";

export default async (req: any, res: AxeResponse) => {
  const docs = DocumentationService.getInstance();
  res.json(docs.get().map((route) => `${route.method} ${route.url}`));
};
