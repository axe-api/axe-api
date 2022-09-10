import path from "path";
import { IFolders } from "../Interfaces";

class FolderResolver {
  resolve(appFolder: string): IFolders {
    return {
      App: appFolder,
      Config: path.join(appFolder, "app", "Config"),
      Events: path.join(appFolder, "app", "Events"),
      Hooks: path.join(appFolder, "app", "Hooks"),
      Middlewares: path.join(appFolder, "app", "Middlewares"),
      Models: path.join(appFolder, "app", "Models"),
    };
  }
}

export default FolderResolver;
