import path from "path";
import { IGeneralHooks, IFolders } from "../Interfaces";
import { IoCService } from "../Services";
import { FileResolver } from ".";

class GeneralHookResolver {
  public static async resolve(): Promise<IGeneralHooks> {
    const folders = (await IoCService.use("Folders")) as IFolders;
    const fileResolver = new FileResolver();
    const content = await fileResolver.resolveContent(
      path.join(folders.App, "app")
    );

    if (content && content.init) {
      const { onBeforeInit = null, onAfterInit = null } = content.init;
      return { onBeforeInit, onAfterInit } as IGeneralHooks;
    }

    return {
      onBeforeInit: null,
      onAfterInit: null,
    } as unknown as IGeneralHooks;
  }
}

export default GeneralHookResolver;
