const fs = require("fs");
fs.rmSync("temp-kit", { recursive: true, force: true });
fs.rmSync("dev-kit", { recursive: true, force: true });
fs.rmSync("dev-kit.ts", { recursive: true, force: true });
fs.rmSync(".env", { recursive: true, force: true });
