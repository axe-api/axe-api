import { IRequest, IResponse } from "../Interfaces";
import { DocumentationService } from "../Services";

export default async (req: IRequest, res: IResponse) => {
  const docs = DocumentationService.getInstance();
  res.json(docs.get().map((route) => `${route.method} ${route.url}`));
};
