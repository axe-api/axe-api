import { APIService } from "../Services";
import { generateTable } from "./generateTable";
import path from "path";
import fs from "fs";

export const generateTypes = async () => {
  const api = APIService.getInstance();

  const tables: string[] = [];

  for (const version of api.versions) {
    for (const model of version.modelList.get()) {
      tables.push(await generateTable(model));
    }
  }

  const content = tables.join("\\");
  const filepath = path.join(process.cwd(), "app", "generated-types.ts");

  fs.writeFileSync(filepath, content);
};
