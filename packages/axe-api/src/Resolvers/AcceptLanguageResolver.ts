import { IAcceptedLanguage, ILanguage } from "../Interfaces";

class AcceptLanguageResolver {
  static resolve(
    value: string,
    supportedLanguages: string[],
    defaultLanguage: string,
  ): ILanguage {
    value = value.trim();

    if (value === "*") {
      return this.toLanguageObject(defaultLanguage);
    }

    const languages = this.toSortedPreferences(value);

    const perfectMatch = languages.find((item) =>
      supportedLanguages.includes(item.language.title),
    );

    const anyMatch = languages.find((item) =>
      supportedLanguages.includes(item.language.language),
    );

    if (perfectMatch && !anyMatch) {
      return perfectMatch.language;
    }

    if (!perfectMatch && anyMatch) {
      return anyMatch.language;
    }

    if (perfectMatch && anyMatch) {
      if (perfectMatch.quality >= anyMatch.quality) {
        return perfectMatch.language;
      } else {
        return this.toLanguageObject(anyMatch.language.language);
      }
    }

    return this.toLanguageObject(defaultLanguage);
  }

  static toLanguageObject(key = ""): ILanguage {
    const [language, region] = key.split("-");
    return {
      title: key,
      language,
      region: region || null,
    };
  }

  private static toSortedPreferences(value: string): IAcceptedLanguage[] {
    // Splitting by language definitons
    const keys = value.split(",").map((key) => key.trim());
    const languages: IAcceptedLanguage[] = [];

    for (const key of keys) {
      // Splitting by the quality values
      const [code, quality] = key.split(";");

      // Parsing the language code and the quality value
      const item: IAcceptedLanguage = {
        language: this.toLanguageObject(code),
        quality: quality ? parseFloat(quality.replace("q=", "")) : 1,
      };

      languages.push(item);
    }

    // Sorting ASC
    languages.sort((a, b) => {
      if (a.quality === b.quality) {
        return 0;
      }

      if (a.quality === null) {
        return 1;
      }

      if (b.quality === null) {
        return -1;
      }

      return a.quality < b.quality ? 1 : -1;
    });

    return languages;
  }
}

export default AcceptLanguageResolver;
