/* eslint-disable no-prototype-builtins */
import path from "path";
import fs from "fs";
import { pascalCase } from "change-case";
import { HandlerTypes, HttpMethods } from "../Enums";
import { IModelService, IRouteDocumentation } from "../Interfaces";
import NodeCache from "node-cache";
import { APIService, DocumentationService } from "../Services";

const cache = new NodeCache();

const DATA_TYPE_MAP = [
  {
    type: "string",
    values: [
      "char",
      "varchar",
      "text",
      "tinytext",
      "mediumtext",
      "longtext",
      "enum",
      "set",
      "varbinary",
      "blob",
      "tinyblob",
      "mediumblob",
      "longblob",
      "date",
      "datetime",
      "timestamp",
      "time",
      "year",
    ],
  },
  {
    type: "number",
    values: [
      "tinyint",
      "smallint",
      "mediumint",
      "int",
      "integer",
      "bigint",
      "bigint unsigned",
      "float",
      "double",
      "decimal",
      "numeric",
    ],
  },
  {
    type: "boolean",
    values: ["boolean", "binary"],
  },
];

const SUMMARY_TEXTS: Record<string, string> = {
  [HandlerTypes.INSERT]: "Add a new {model}",
  [HandlerTypes.PAGINATE]: "Retrieve a paginated list of {model}s",
  [HandlerTypes.SHOW]: "Retrieve details of a {model}",
  [HandlerTypes.UPDATE]: "Update an existing {model}",
  [HandlerTypes.DELETE]: "Delete a {model}",
  [HandlerTypes.FORCE_DELETE]: "Force delete a {model}",
  [HandlerTypes.PATCH]: "Apply partial updates to a {model}",
  [HandlerTypes.ALL]: "Get all items on {model}",
  [HandlerTypes.SEARCH]: "Full-text search on {model}",
};

const DESCRIPTION_TEXTS: Record<string, string> = {
  [HandlerTypes.INSERT]: "Add a new {model}",
  [HandlerTypes.PAGINATE]: "Retrieve a paginated list of {model}s",
  [HandlerTypes.SHOW]: "Retrieve details of a {model} by primary key",
  [HandlerTypes.UPDATE]: "Update an existing {model} by primary key",
  [HandlerTypes.DELETE]: "Delete a {model} by primary key",
  [HandlerTypes.FORCE_DELETE]: "Force delete a {model} by primary key",
  [HandlerTypes.PATCH]: "Apply partial updates to a {model} by primary key",
  [HandlerTypes.ALL]: "Get all items on {model}",
  [HandlerTypes.SEARCH]: "Full-text search on {model} by using ElasticSearch",
};

const SINGLE_RETURN_ENDPOINTS: string[] = [
  HandlerTypes.INSERT,
  HandlerTypes.PATCH,
  HandlerTypes.SHOW,
  HandlerTypes.UPDATE,
];

const ALLOWED_2XX_HANDLERS: string[] = [
  HandlerTypes.ALL,
  HandlerTypes.PAGINATE,
  HandlerTypes.SEARCH,
  HandlerTypes.PATCH,
  HandlerTypes.SHOW,
  HandlerTypes.UPDATE,
];

const POSSIBLE_404_HANDLERS: string[] = [
  HandlerTypes.DELETE,
  HandlerTypes.FORCE_DELETE,
  HandlerTypes.PATCH,
  HandlerTypes.SHOW,
  HandlerTypes.UPDATE,
];

const NO_CONTENT_HANDLERS: string[] = [
  HandlerTypes.DELETE,
  HandlerTypes.FORCE_DELETE,
];

const ALLOWED_REQUEST_BODY_HANDLERS: string[] = [
  HandlerTypes.INSERT,
  HandlerTypes.UPDATE,
  HandlerTypes.PATCH,
];

const ALLOWED_QUERY_HANDLERS: string[] = [
  HandlerTypes.ALL,
  HandlerTypes.SHOW,
  HandlerTypes.PAGINATE,
];

const PAGINATION_SCHEMA = {
  type: "object",
  properties: {
    total: {
      type: "integer",
      default: 1,
    },
    lastPage: {
      type: "integer",
      default: 1,
    },
    perPage: {
      type: "integer",
      default: 10,
    },
    currentPage: {
      type: "integer",
      default: 1,
    },
    from: {
      type: "integer",
      default: 0,
    },
    to: {
      type: "integer",
      default: 10,
    },
  },
};

const ERROR_SCHEMA = {
  type: "object",
  properties: {
    error: {
      type: "string",
      default: "An error occorred",
    },
  },
};

const VALIDATION_ERROR_SCHEMA = {
  type: "object",
  properties: {
    errors: {
      type: "object",
    },
  },
};

const toPropertyType = (datatype: string) => {
  for (const item of DATA_TYPE_MAP) {
    if (item.values.includes(datatype)) {
      return item.type;
    }
  }

  return datatype;
};

const toEndpointSummary = (endpoint: IRouteDocumentation) => {
  const value = SUMMARY_TEXTS[endpoint.handler] || "";
  return value.replace("{model}", endpoint.model.toLowerCase());
};

const toEndpointDescription = (endpoint: IRouteDocumentation) => {
  const value = DESCRIPTION_TEXTS[endpoint.handler] || "";
  return value.replace("{model}", endpoint.model.toLowerCase());
};

const to2XXResponse = (endpoint: IRouteDocumentation) => {
  // Single item response
  if (SINGLE_RETURN_ENDPOINTS.includes(endpoint.handler)) {
    return {
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${endpoint.model}`,
          },
        },
      },
    };
  }

  // All response
  if (endpoint.handler === HandlerTypes.ALL) {
    return {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: `#/components/schemas/${endpoint.model}`,
            },
          },
        },
      },
    };
  }

  return {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: `#/components/schemas/${endpoint.model}`,
              },
            },
            pagination: {
              $ref: `#/components/schemas/Pagination`,
            },
          },
        },
      },
    },
  };
};

const toEndpointResponse = (endpoint: IRouteDocumentation) => {
  const response: any = {};

  if (ALLOWED_2XX_HANDLERS.includes(endpoint.handler)) {
    response["200"] = {
      ...to2XXResponse(endpoint),
      description: "OK",
    };
  }

  if (endpoint.handler === HandlerTypes.INSERT) {
    response["201"] = {
      ...to2XXResponse(endpoint),
      description: "Created",
    };
    response["400"] = {
      description: "Bad request",
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/ValidationError`,
          },
        },
      },
    };
  }

  if (NO_CONTENT_HANDLERS.includes(endpoint.handler)) {
    response["204"] = {
      description: "No Content",
    };
  }

  if (
    POSSIBLE_404_HANDLERS.includes(endpoint.handler) ||
    endpoint.parentModel
  ) {
    response["404"] = {
      description: "Not Found",
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/Error`,
          },
        },
      },
    };
  }

  return response;
};

const toFillableFieldProperties = (model: IModelService) => {
  const fields = model.instance.getFillableFields(HttpMethods.POST);
  const properties: any = {};

  for (const field of fields) {
    const column = model.columns.find((item) => item.name === field);
    if (column) {
      properties[column.name] = {
        type: toPropertyType(column.data_type),
        format: column.data_type,
      };
    }
  }

  return properties;
};

const toRequestBody = (endpoint: IRouteDocumentation) => {
  if (ALLOWED_REQUEST_BODY_HANDLERS.includes(endpoint.handler) === false) {
    return undefined;
  }

  const bodySchema = `${endpoint.model}${pascalCase(endpoint.method)}Body`;
  return {
    description: "Update an existent pet in the store",
    content: {
      "application/json": {
        schema: {
          $ref: `#/components/requestBodies/${bodySchema}`,
        },
      },
    },
    required: true,
  };
};

const toRequestParameters = (endpoint: IRouteDocumentation) => {
  const parameters: any = [
    {
      in: "header",
      name: "Accept-Language",
      schema: {
        type: "string",
        example: "en;q=0.8, de;q=0.7, *;q=0.5",
      },
      required: false,
    },
  ];

  if (endpoint.url.includes(":")) {
    const sections = endpoint.url
      .split("/")
      .filter((item) => item.includes(":"))
      .map((item) => item.replace(":", ""));

    for (const section of sections) {
      parameters.push({
        in: "path",
        name: section,
        required: true,
      });
    }
  }

  if (endpoint.handler === HandlerTypes.PAGINATE) {
    parameters.push(
      ...[
        {
          name: "page",
          in: "query",
          description: "The page number to list",
          required: false,
          schema: {
            type: "integer",
            default: 1,
          },
        },
        {
          name: "per_page",
          in: "query",
          description: "Number of records to list on a page",
          required: false,
          schema: {
            type: "integer",
            default: 10,
          },
        },
        {
          name: "sort",
          in: "query",
          description: "The field to sort the data (ASC: id, DESC: -id)",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
    );
  }

  if (endpoint.handler === HandlerTypes.SEARCH) {
    parameters.push(
      ...[
        {
          name: "text",
          in: "query",
          description: "The search text",
          required: true,
          schema: {
            type: "string",
            default: "",
          },
        },
        {
          name: "page",
          in: "query",
          description: "The page number to list",
          required: false,
          schema: {
            type: "integer",
            default: 1,
          },
        },
        {
          name: "per_page",
          in: "query",
          description: "Number of records to list on a page",
          required: false,
          schema: {
            type: "integer",
            default: 10,
          },
        },
        {
          name: "fields",
          in: "query",
          description: "The model fields that can be fetched",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "with",
          in: "query",
          description: "Listable related models",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
    );
  }

  if (ALLOWED_QUERY_HANDLERS.includes(endpoint.handler)) {
    parameters.push(
      ...[
        {
          name: "fields",
          in: "query",
          description: "The model fields that can be fetched",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "with",
          in: "query",
          description: "Listable related models",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "trashed",
          in: "query",
          description: "List of deleted data with soft-delete",
          required: false,
          schema: {
            type: "integer",
            default: 0,
          },
        },
        {
          name: "q",
          in: "query",
          description: "JSON query to filter data",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
    );
  }

  return parameters;
};

const deepMerge = (base: any, source: any) => {
  // Check if either base or source is not an object, or if source is null
  if (
    typeof base !== "object" ||
    typeof source !== "object" ||
    source === null
  ) {
    return source;
  }

  // Create a copy of the base object to avoid modifying it directly
  const merged = { ...base };

  // Loop through all properties in the source object
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // If the key exists in the base object and both values are objects, merge recursively
      if (
        base.hasOwnProperty(key) &&
        typeof base[key] === "object" &&
        typeof source[key] === "object"
      ) {
        merged[key] = deepMerge(base[key], source[key]);
      } else {
        // If the key does not exist in the base object or one of the values is not an object, assign the source value to the merged object
        merged[key] = source[key];
      }
    }
  }

  return merged;
};

const generateDocumentation = async () => {
  const docs = DocumentationService.getInstance();
  const api = APIService.getInstance();

  let baseSchema = {
    info: {
      title: "Axe API",
      description: "Edit your swagger/index.ts file",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  };

  const swaggerBasePath = path.join(api.appFolder, "swagger");
  if (
    fs.existsSync(`${swaggerBasePath}.ts`) ||
    fs.existsSync(`${swaggerBasePath}.js`)
  ) {
    const { default: userDefinedSchema } = await import(swaggerBasePath);
    baseSchema = userDefinedSchema;
  }

  const schemas: any = {};
  const requestBodies: any = {};
  const firstVersion = api.versions.at(0);

  if (!firstVersion) {
    throw new Error("The version is not found!");
  }

  for (const model of firstVersion.modelList.get()) {
    const properties: any = {};
    for (const column of model.columns) {
      properties[column.name] = {
        type: toPropertyType(column.data_type),
        format: column.data_type,
      };
    }
    schemas[model.name] = {
      type: "object",
      properties,
    };

    if (model.instance.handlers.includes(HandlerTypes.INSERT)) {
      requestBodies[`${model.name}${pascalCase(HttpMethods.POST)}Body`] = {
        type: "object",
        properties: toFillableFieldProperties(model),
      };
    }

    if (model.instance.handlers.includes(HandlerTypes.UPDATE)) {
      requestBodies[`${model.name}${pascalCase(HttpMethods.PUT)}Body`] = {
        type: "object",
        properties: toFillableFieldProperties(model),
      };
    }

    if (model.instance.handlers.includes(HandlerTypes.PATCH)) {
      requestBodies[`${model.name}${pascalCase(HttpMethods.PATCH)}Body`] = {
        type: "object",
        properties: toFillableFieldProperties(model),
      };
    }
  }

  const modelPatterns: Record<string, string> = {};

  const paths: any = {};
  for (const endpoint of docs.get()) {
    if (paths[endpoint.url] === undefined) {
      paths[endpoint.url] = {};
    }

    modelPatterns[endpoint.url] = endpoint.model;

    const path: any = {
      tags: [endpoint.model],
      summary: toEndpointSummary(endpoint),
      description: toEndpointDescription(endpoint),
      operationId: `${endpoint.handler}${endpoint.model}`,
      responses: toEndpointResponse(endpoint),
      parameters: toRequestParameters(endpoint),
    };

    const requestBody = toRequestBody(endpoint);
    if (requestBody) {
      path.requestBody = requestBody;
    }

    paths[endpoint.url][endpoint.method.toLowerCase()] = path;
  }

  const modelPatternsKeys = Object.keys(modelPatterns);

  // Added custom endpoint
  for (const custom of docs.getCustoms()) {
    if (paths[custom.url] === undefined) {
      paths[custom.url] = {};
    }

    const samePattern = modelPatternsKeys.find((key) =>
      custom.url.startsWith(key),
    );
    const tags = [];
    if (samePattern) {
      tags.push(modelPatterns[samePattern]);
    }

    paths[custom.url][custom.method.toLowerCase()] = {
      tags,
      description: "Custom endpoint",
    };
  }

  const builded = {
    openapi: "3.0.0",
    paths,
    components: {
      schemas: {
        ...schemas,
        Pagination: PAGINATION_SCHEMA,
        Error: ERROR_SCHEMA,
        ValidationError: VALIDATION_ERROR_SCHEMA,
      },
      requestBodies,
    },
  };

  return deepMerge(baseSchema, builded);
};

export default async () => {
  const cached: string | undefined = cache.get("axe-api-documentation");
  if (cached) {
    return JSON.parse(cached);
  }

  const documentation = await generateDocumentation();
  cache.set("axe-api-documentation", JSON.stringify(documentation));
  return documentation;
};
