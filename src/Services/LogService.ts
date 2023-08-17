import logger from "pino";

class LogService {
  private static logger: logger.Logger;

  static setInstance(options?: logger.LoggerOptions | undefined) {
    LogService.logger = logger(options);
    LogService.logger.info("ADAS");
  }

  static instance() {
    return LogService.logger;
  }

  static error(message: string) {
    LogService.logger.error(message);
  }

  static warn(message: string) {
    LogService.logger.warn(message);
  }

  static info(message: string) {
    LogService.logger.info(message);
  }

  static debug(message: string) {
    LogService.logger.debug(message);
  }
}

export default LogService;
