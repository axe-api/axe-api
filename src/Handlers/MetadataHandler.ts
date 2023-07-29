import { APIService, DocumentationService } from "../Services";
import AxeRequest from "../Services/AxeRequest";
import AxeResponse from "../Services/AxeResponse";

export default async (req: AxeRequest, res: AxeResponse) => {
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
