import { spawn } from "child_process";
import { MySQL } from "./dockerComposers/index.js";

class DockerComposer {
  static get(database) {
    database = database.toLowerCase();
    const map = {
      mysql: MySQL,
    };
    if (map[database]) {
      return new map[database]();
    }

    throw new Error(`Undefined docker composer type: ${database}`);
  }
}

export default DockerComposer;
