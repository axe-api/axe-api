import { Request, Response, NextFunction } from "express";
import { AcceptLanguageResolver } from "../Resolvers";
import { getVersionByRequest } from "../Helpers";

export default async (req: Request, res: Response, next: NextFunction) => {
  // Application configuration is need for the default setting.
  const version = await getVersionByRequest(req);

  // Setting the current language by the supported, default and the client prefences
  req.currentLanguage = AcceptLanguageResolver.resolve(
    req.get("accept-language") || "",
    version.config.supportedLanguages || ["en"],
    version.config.defaultLanguage || "en"
  );

  // Adding the `Content-Language` header to the response object
  res.setHeader("Content-Language", req.currentLanguage.title);

  next();
};
