import { Request, Response, NextFunction } from "express";
import { AcceptLanguageResolver } from "../Resolvers";
import { getVersionByRequest } from "../Helpers";
import AxeRequest from "../Services/AxeRequest";

export default async (req: AxeRequest, res: Response, next: NextFunction) => {
  // Application configuration is need for the default setting.
  const version = await getVersionByRequest(req);

  // Setting the current language by the supported, default and the client prefences
  req.currentLanguage = AcceptLanguageResolver.resolve(
    (req.header("accept-language") as string) || "",
    version.config.supportedLanguages || ["en"],
    version.config.defaultLanguage || "en"
  );

  // Adding the `Content-Language` header to the response object
  res.setHeader("Content-Language", req.currentLanguage.title);

  next();
};
