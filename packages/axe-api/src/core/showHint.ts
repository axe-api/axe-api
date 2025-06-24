import { existsSync, readFileSync, unlinkSync, watch, writeFileSync } from "fs";
import { join, relative } from "path";
import { Hint } from "../Types";
import { Resource } from "src/definers";
import { tmpdir } from "os";

const showChangedFile = (filename: string) => {
  const relativePath = relative(process.cwd(), filename);
  console.log(`\n🔥 You just changed ${relativePath}`);
};

const defaultHinter = (filename: string) => {
  showChangedFile(filename);
};

const resourceHinter = (filename: string, resource: Resource<unknown>) => {
  showChangedFile(filename);

  if (resource.config.handlers.length === 0) {
    console.log(
      `\n\n🧩 Resource "${resource.config.tableName}" has no handlers.`,
    );
    console.log(
      `💡 Use ${resource.config.tableName}.handlers() to bring it to life.`,
    );
  }

  // console.log(resource.config);
};

type HintFunction = (filename: string, module: any) => void;

const HINT_MAP: Record<Hint, HintFunction> = {
  router: defaultHinter,
  resource: resourceHinter,
};

export const showHint = async (root: string) => {
  const watchPath = join(root, ".");

  const hintFile = join(tmpdir(), ".last-change-hint");

  watch(watchPath, { recursive: true }, (eventType, filename) => {
    if (eventType === "change" && filename) {
      const fullPath = join(watchPath, filename);
      writeFileSync(hintFile, fullPath, "utf-8");
    }
  });

  if (existsSync(hintFile)) {
    const fullPath = readFileSync(hintFile, "utf-8").trim();
    unlinkSync(hintFile);

    const mod = await import(fullPath);
    if (mod.default.hint) {
      const hintFunction = HINT_MAP[mod.default.hint as Hint];
      hintFunction(fullPath, mod.default);
    } else {
      defaultHinter(fullPath);
    }
  }
};
