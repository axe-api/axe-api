import { spawn } from "child_process";

class Runner {
  constructor(name) {
    console.log("runner", name);
    this.child = spawn("node", ["serve.js", name]);
    this.child.stdout.on("data", (data) => {
      process.stdout.write(`${data}`);
    });

    this.child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
  }

  kill() {
    this.child.kill("SIGINT");
  }
}

export default Runner;
