import { spawn } from "child_process";
import { attemptMySQL } from "./helpers.js";

class MySQLComponser {
  up() {
    console.log("Starting docker containers...");
    const child = spawn("docker", [
      "compose",
      "-f",
      "docker-compose.mysql.yml",
      "up",
      "-d",
    ]);
    child.stdout.on("data", (data) => {
      process.stdout.write(`${data}`);
    });
  }

  down() {
    console.log("Downing docker containers...");
    const child = spawn("docker", [
      "compose",
      "-f",
      "docker-compose.mysql.yml",
      "down",
    ]);
    child.stdout.on("data", (data) => {
      process.stdout.write(`${data}`);
    });
  }

  async waitForDatabase() {
    return new Promise((resolve) => {
      attemptMySQL(3307, resolve);
    });
  }
}

export default MySQLComponser;
