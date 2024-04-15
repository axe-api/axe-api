import logger from "pino";

class LogService {
  private static logger: logger.Logger;

  static setInstance(options?: logger.LoggerOptions | undefined) {
    if (options) {
      options.customLevels = {
        ...options.customLevels,
        axe: 100,
      };

      if (options.transport) {
        options.transport = {
          ...options.transport,
          options: {
            ...options?.transport?.options,
            customLevels: [
              "trace:10",
              "debug:20",
              "info:30",
              "serious:35",
              "warn:40",
              "error:50",
              "fatal:60",
              options?.transport?.options?.customLevels || "",
              `axe:100`,
            ].join(","),
          },
        };
      }
    }

    LogService.logger = logger(options);
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

  static axe(message: string) {
    (LogService.logger as any).axe(message);
  }
}

export default LogService;
