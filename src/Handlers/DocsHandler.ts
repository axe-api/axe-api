import { IRequest, IResponse } from "../Interfaces";
import { APIService, DocumentationService } from "../Services";

export default async (req: IRequest, res: IResponse) => {
  const docs = DocumentationService.getInstance();
  const api = APIService.getInstance();

  res.json({
    routes: docs.get(),
    versions: api.versions.map((version) => {
      return {
        ...version,
        config: {
          ...version.config,
          transaction: undefined,
        },
        folders: undefined,
        modelList: undefined,
        models: version.modelList.get(),
      };
    }),
  });
};
