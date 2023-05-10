import { IVersionConfig, allow, QueryFeature } from "axe-api";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en", "de"],
  defaultLanguage: "en",
  query: {
    limits: [allow(QueryFeature.All)],
    defaults: {
      perPage: 10,
      minPerPage: 1,
      maxPerPage: 30,
    },
  },
};

export default config;
