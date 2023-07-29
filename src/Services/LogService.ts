import { LogLevels } from "../Enums";
import { LOG_COLORS } from "../constants";

class LogService {
  private static instance: LogService;
  private level: LogLevels;

  constructor(level: LogLevels) {
    this.level = level;
  }

  static setInstance(level: LogLevels) {
    LogService.instance = new LogService(level);
  }

  static getInstance(): LogService {
    return LogService.instance;
  }

  error(message: string) {
    if (this.level >= LogLevels.ERROR) {
      console.error(LOG_COLORS.fgRed, "[axe]", message, LOG_COLORS.fgReset);
    }
  }

  warn(message: string) {
    if (this.level >= LogLevels.WARNING) {
      console.warn(LOG_COLORS.fgYellow, "[axe]", message, LOG_COLORS.fgReset);
    }
  }

  info(message: string) {
    if (this.level >= LogLevels.INFO) {
      console.info(LOG_COLORS.fgCyan, "[axe]", message, LOG_COLORS.fgReset);
    }
  }

  success(message: string) {
    if (this.level >= LogLevels.INFO) {
      console.info(LOG_COLORS.fgGreen, "[axe]", message, LOG_COLORS.fgReset);
    }
  }

  debug(message: string) {
    this.log(message);
  }

  log(message: string) {
    if (this.level === LogLevels.ALL) {
      console.log(message);
    }
  }
}

export default LogService;
