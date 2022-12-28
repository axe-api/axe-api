import { Request, Response, NextFunction } from "express";
import { IoCService } from "../Services";
import { IApplicationConfig } from "../Interfaces";
import { AcceptLanguageResolver } from "../Resolvers";

export default async (req: Request, res: Response, next: NextFunction) => {
  // Application configuration is need for the default setting.
  const configs = await IoCService.use("Config");
  const application = configs.Application as IApplicationConfig;
  const { supportedLanguages, defaultLanguage } = application;

  // Setting the current language by the supported, default and the client prefences
  req.currentLanguage = AcceptLanguageResolver.resolve(
    req.get("accept-language") || "",
    supportedLanguages || ["en"],
    defaultLanguage || "en"
  );

  // Adding the `Content-Language` header to the response object
  res.setHeader("Content-Language", req.currentLanguage.title);

  next();
};
