import { AxeConfig, IValidator } from "../Interfaces";
import RobustValidator from "./RobustValidator";
import { APIService } from "../Services";

class ValidatorFactory {
  static resolve(config: AxeConfig): IValidator {
    const api = APIService.getInstance();

    const supportedLanguages = [
      ...new Set(
        api.versions.map((version) => version.config.supportedLanguages).flat(),
      ),
    ];

    switch (config.validator) {
      case "validatorjs":
        throw new Error("validatorjs is not supported anymore.");
      case "robust-validator":
        return new RobustValidator(supportedLanguages);
      default:
        throw new Error(`Undefined validator library: ${config.validator}`);
    }
  }
}

export default ValidatorFactory;
