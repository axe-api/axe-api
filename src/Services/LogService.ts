import winston from "winston";
import { LogLevels } from "../Enums";
import { LOG_COLORS } from "../constants";

class LogService {
  private static instance: winston.Logger;

  static setInstance(options?: winston.LoggerOptions | undefined) {
    LogService.instance = winston.createLogger(options);
  }

  static emerg(message: string) {
    LogService.instance.emerg(message);
  }

  static alert(message: string) {
    LogService.instance.alert(message);
  }

  static crit(message: string) {
    LogService.instance.crit(message);
  }

  static error(message: string) {
    LogService.instance.error(message);
  }

  static warning(message: string) {
    LogService.instance.warning(message);
  }

  static notice(message: string) {
    LogService.instance.notice(message);
  }

  static info(message: string) {
    LogService.instance.info(message);
  }

  static debug(message: string) {
    LogService.instance.debug(message);
  }
}

export default LogService;
