import fs from "fs";
import path from "path";

class FileResolver {
  async resolve<T>(directory: string): Promise<Record<string, T>> {
    const results: Record<string, T> = {};

    if (!fs.existsSync(directory)) {
      return results;
    }

    const files = (await fs.readdirSync(directory, { withFileTypes: true }))
      .filter((item) => !item.isDirectory())
      .filter(
        (filename) =>
          filename.name.includes(".ts") || filename.name.includes(".js")
      )
      .map((item) => item.name);
    for (const file of files) {
      const configFile = path.join(directory, file);
      const { default: content } = await import(configFile);
      const key = file.replace(".ts", "").replace(".js", "");
      if (content?.prototype) {
        results[key] = new content();
      } else {
        results[key] = content as T;
      }
    }
    return results;
  }

  async resolveContent(directory: string): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    if (!fs.existsSync(directory)) {
      return results;
    }

    const files = await fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map((item) => item.name);
    for (const file of files) {
      const configFile = path.join(directory, file);
      const content = await import(configFile);
      const key = file.replace(".ts", "").replace(".js", "");
      results[key] = content;
    }
    return results;
  }
}

export default FileResolver;
