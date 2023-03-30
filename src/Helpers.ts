import chalk from "chalk";
import { paramCase } from "change-case";
import { APIService } from "./Services";
import { IVersion, IRequest } from "./Interfaces";

export const getVersionByRequest = async (req: IRequest): Promise<IVersion> => {
  // Application configuration is need for the default setting.
  const api = APIService.getInstance();
  const matchedVersion = api.versions.find((version) => {
    const path = `/${api.config.prefix}/${version.name}`;
    return req.path.indexOf(path) === 0;
  });

  if (!matchedVersion) {
    throw new Error(`Version is not matched: ${req.path}`);
  }

  return matchedVersion;
};

export const consoleAxeError = (error: any) => {
  const putWithSpace = (text: string, max: number): string[] => {
    const diff = max - text.length + 3;
    for (let index = 0; index <= diff; index++) {
      text = `${text} `;
    }

    text = `   ${text}`;

    if (text.length > 77) {
      let lines = [];
      text = text.trim();
      for (let step = 0; step < text.length / 70; step++) {
        lines.push(text.substring(0, 70));
        text = text.substring(70);
      }
      lines.push(text);

      lines = lines.map((line) => putWithSpace(line, max));
      return lines.flat();
    }

    return [text];
  };

  const getMaxLength = (code: string, message: string) => {
    let maxLength: number = message.length;

    if (code.length > message.length) {
      maxLength = code.length;
    }

    if (maxLength > 70) {
      maxLength = 70;
    }

    return maxLength;
  };

  const maxLength = getMaxLength(error.code, error.message);

  const messages = [
    "\n",
    ...putWithSpace(" ", maxLength),
    ...putWithSpace(`[${error.code}]`, maxLength),
    ...putWithSpace(" ", maxLength),
    ...putWithSpace(error.message, maxLength),
    ...putWithSpace(" ", maxLength),
  ];
  console.log(chalk.bgRed.white(messages.join("\n")));

  console.log(
    chalk.cyan(
      [
        "\n",
        "You can find more in the documentation;",
        `https://axe-api.com/errors.html#${paramCase(error.code)}`,
      ].join("\n")
    )
  );
};
