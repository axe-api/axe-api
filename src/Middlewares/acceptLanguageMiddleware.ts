import { AcceptLanguageResolver } from "../Resolvers";
import { getVersionByRequest } from "../Helpers";
import { IRequestPack } from "src/Interfaces";

export default async (context: IRequestPack) => {
  // // Application configuration is need for the default setting.
  // const version = await getVersionByRequest(context.req);
  // // Setting the current language by the supported, default and the client prefences
  // context.req.currentLanguage = AcceptLanguageResolver.resolve(
  //   (context.req.header("accept-language") as string) || "",
  //   version.config.supportedLanguages || ["en"],
  //   version.config.defaultLanguage || "en"
  // );
  // Adding the `Content-Language` header to the response object
  // TODO: Fix it
  // context.res.setHeader("Content-Language", context.req.currentLanguage.title);
};
