import { HttpMethods } from "../Enums";
import { IModelService, IValidator } from "../Interfaces";
import { AxeRequest, LogService } from "../Services";
import { validate, setLocales, LanguageType, ILocale } from "robust-validator";

class RobustValidator implements IValidator {
  constructor(supportedLanguages: string[]) {
    import("robust-validator").then((pkg) => {
      for (const language of supportedLanguages) {
        const languagePack = pkg[language];

        if (!languagePack) {
          throw new Error(
            `The language is not supported by robust-validator: ${language}`,
          );
        }

        setLocales(languagePack as ILocale);
        LogService.debug(
          `Robust-validator language pack has been imported: ${language}`,
        );
      }
    });
  }

  async validate(req: AxeRequest, model: IModelService, formData: any) {
    // Getting the validation rules
    const requestMethod: HttpMethods = req.method as unknown as HttpMethods;
    const validationRules = model.instance.getValidationRules(requestMethod);

    // Validating the data if there is any
    if (validationRules) {
      const result = await validate(formData, validationRules, {
        language: req.currentLanguage.language as LanguageType,
      });
      if (result.isInvalid) {
        const errors: Record<string, string[]> = {};

        Object.keys(result.errors).forEach((field) => {
          if (!errors[field]) {
            errors[field] = [];
          }

          errors[field].push(
            ...result.errors[field].map((item) => item.message),
          );
        });

        return {
          errors,
        };
      }
    }

    return null;
  }
}

export default RobustValidator;
