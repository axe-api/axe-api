import { LOG_LEVEL } from "./../Constants.js";

class Logger {
  constructor(level) {
    this.level = level;
  }

  error(message) {
    if (this.level <= LOG_LEVEL.ERROR) {
      console.error(message);
    }
  }

  warn(message) {
    if (this.level <= LOG_LEVEL.WARNING) {
      console.warn(message);
    }
  }

  info(message) {
    if (this.level <= LOG_LEVEL.INFO) {
      console.info(message);
    }
  }

  log(message) {
    if (this.level <= LOG_LEVEL.ALL) {
      console.log(message);
    }
  }
}

export default Logger;
