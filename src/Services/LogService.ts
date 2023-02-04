import { LogLevels } from "../Enums";
import { LOG_COLORS } from "../constants";

const { fgRed, fgGreen, fgYellow, fgCyan, fgReset } = LOG_COLORS;

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
      console.error(fgRed, "[axe]", message, fgReset);
    }
  }

  warn(message: string) {
    if (this.level >= LogLevels.WARNING) {
      console.warn(fgYellow, "[axe]", message, fgReset);
    }
  }

  info(message: string) {
    if (this.level >= LogLevels.INFO) {
      console.info(fgCyan, "[axe]", message, fgReset);
    }
  }

  success(message: string) {
    if (this.level >= LogLevels.INFO) {
      console.info(fgGreen, "[axe]", message, fgReset);
    }
  }

  log(message: string) {
    if (this.level === LogLevels.ALL) {
      console.log(message);
    }
  }

  debug(message: string) {
    if (this.level === LogLevels.ALL) {
      console.log(message);
    }
  }
}

export default LogService;
