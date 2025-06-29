import { Resource } from "./useResource";
import {
  DefaultHandler,
  ExtractResource,
  PaginateHandlerConfig,
} from "./xTypes";

export type PaginateHandler<ResourceType> = DefaultHandler<ResourceType> & {
  /**
   * @internal
   */
  config: PaginateHandlerConfig<ResourceType>;
  allowedFields(columns: Array<keyof ResourceType>): void;
  setMinPerPage(perPage: number): void;
  setDefaultPerPage(perPage: number): void;
  setMaxPerPage(perPage: number): void;
  patch(config: Partial<PaginateHandlerConfig<ResourceType>>): void;
  getConfig(): unknown;
};

export const usePaginateHandler = <AnyResource>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resource: Resource<AnyResource>,
) => {
  type ResourceType = ExtractResource<AnyResource>;

  const config: PaginateHandlerConfig<ResourceType> = {
    type: "paginate",
    minPerPage: 5,
    defaultPerPage: 10,
    maxPerPage: 100,
    allowedFields: [],
  };

  return {
    config,
    allowedFields(columns: Array<keyof ResourceType>) {
      config.allowedFields = Array.from(new Set(columns));
    },
    setMinPerPage(perPage: number) {
      config.minPerPage = perPage;
    },
    setDefaultPerPage(perPage: number) {
      config.defaultPerPage = perPage;
    },
    setMaxPerPage(perPage: number) {
      config.maxPerPage = perPage;
    },
    patch(patch: Partial<PaginateHandlerConfig<ResourceType>>) {
      Object.assign(config, patch);
    },
    getConfig() {
      return config;
    },
  } as PaginateHandler<ResourceType>;
};
