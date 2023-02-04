import { IGeneralHooks, IVersion } from "../Interfaces";
import { FileResolver } from ".";

class GeneralHookResolver {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  public async resolve(): Promise<IGeneralHooks> {
    const fileResolver = new FileResolver();
    const content = await fileResolver.resolveContent(
      this.version.folders.root
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
