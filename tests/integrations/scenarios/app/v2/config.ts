import { IVersionConfig, allow, QueryFeature } from "axe-api";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en", "de"],
  defaultLanguage: "en",
  query: {
    limits: [allow(QueryFeature.All)],
  },
};

export default config;
