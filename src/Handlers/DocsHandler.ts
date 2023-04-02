import { APIService, DocumentationService } from "../Services";

export default async (req: any, res: any) => {
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
