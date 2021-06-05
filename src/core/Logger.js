import { LOG_LEVEL, LOG_COLORS } from "./../Constants.js";
const { fgRed, fgGreen, fgYellow, fgCyan, fgReset } = LOG_COLORS;

class Logger {
  constructor(level) {
    this.level = level;
  }

  error(message) {
    if (this.level <= LOG_LEVEL.ERROR) {
      console.error(fgRed, "[axe]", message, fgReset);
    }
  }

  warn(message) {
    if (this.level <= LOG_LEVEL.WARNING) {
      console.warn(fgYellow, "[axe]", message, fgReset);
    }
  }

  info(message) {
    if (this.level <= LOG_LEVEL.INFO) {
      console.info(fgCyan, "[axe]", message, fgReset);
    }
  }

  success(message) {
    if (this.level <= LOG_LEVEL.INFO) {
      console.info(fgGreen, "[axe]", message, fgReset);
    }
  }

  log(message) {
    if (this.level === LOG_LEVEL.ALL) {
      console.log(message);
    }
  }

  debug(message) {
    if (this.level === LOG_LEVEL.ALL) {
      console.log(message);
    }
  }
}

export default Logger;
