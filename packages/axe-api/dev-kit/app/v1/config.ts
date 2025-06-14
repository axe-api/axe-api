import { IVersionConfig, allow, QueryFeature } from "../../../index";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en"],
  defaultLanguage: "en",
  query: {
    limits: [allow(QueryFeature.All)],
    defaults: {
      perPage: 10,
      minPerPage: 5,
      maxPerPage: 100,
    },
  },
  formidable: {},
};

export default config;
