import Validator from "validatorjs";
import { AxeRequest, LogService } from "../Services";
import { IModelService, IValidator } from "../Interfaces";
import { HttpMethods } from "../Enums";

class Validatorjs implements IValidator {
  constructor(supportedLanguages: string[]) {
    supportedLanguages.forEach((language) => {
      Validator.useLang(language);

      LogService.debug(
        `Validatorjs language pack has been imported: ${language}`,
      );
    });
  }
  async validate(req: AxeRequest, model: IModelService, formData: any) {
    // Setting the language
    Validator.useLang(req.currentLanguage.language);

    // Getting the validation rules
    const requestMethod: HttpMethods = req.method as unknown as HttpMethods;
    const validationRules = model.instance.getValidationRules(requestMethod);

    // Validating the data if there is any
    if (validationRules) {
      const validation = new Validator(formData, validationRules);

      // Return the validation errors
      if (validation.fails()) {
        return validation.errors;
      }
    }

    return null;
  }
}

export default Validatorjs;
