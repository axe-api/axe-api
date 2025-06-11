import AxeRequest from "../Services/AxeRequest";
import AxeResponse from "../Services/AxeResponse";
import swaggerBuilder from "../Builders/SwaggerBuilder";
import { LogService } from "../Services";

export default async (_req: AxeRequest, res: AxeResponse) => {
  try {
    res.json(await swaggerBuilder());
  } catch (error: any) {
    LogService.error(error);
    res.status(500).json({ error: error.message });
  }
};
