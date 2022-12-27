import { Request, Response, NextFunction } from "express";
import parser from "accept-language-parser";
import { IoCService } from "../Services";
import { IApplicationConfig } from "../Interfaces";

export default async (req: Request, res: Response, next: NextFunction) => {
  // Application configuration is need for the default setting.
  const configs = await IoCService.use("Config");
  const application = configs.Application as IApplicationConfig;
  const { defaultLanguage } = application;

  // Parsing the `accept-language` value
  req.acceptedLanguages = parser.parse(
    req.headers["accept-language"] || defaultLanguage
  );

  // Getting the current language by the accept-langauge and the default language
  // value. This values can be used anywhere in the API because the values would
  // be carried by Express.Request
  req.language =
    req.acceptedLanguages.length > 0
      ? req.acceptedLanguages.at(0)?.code || defaultLanguage
      : defaultLanguage;

  next();
};
