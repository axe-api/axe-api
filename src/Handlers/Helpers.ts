import crypto from "crypto";
import { camelCase } from "change-case";
import {
  IModelService,
  IRelation,
  IQuery,
  IVersion,
  IWith,
  IContext,
  ICacheConfiguration,
  IHandlerBasedCacheConfig,
} from "../Interfaces";
import { Knex } from "knex";
import {
  HandlerTypes,
  Relationships,
  HookFunctionTypes,
  TimestampColumns,
  QueryFeature,
  CacheStrategies,
} from "../Enums";
import ApiError from "../Exceptions/ApiError";
import { IoCService, LogService, ModelListService } from "../Services";
import { PhaseFunction, SerializationFunction } from "../Types";
import { valideteQueryFeature } from "../Services/LimitService";
import {
  NUMERIC_PRIMARY_KEY_TYPES,
  DEFAULT_CACHE_CONFIGURATION,
  RelationQueryFeatureMap,
} from "../constants";
import AxeRequest from "../Services/AxeRequest";
import RedisAdaptor from "../Middlewares/RateLimit/RedisAdaptor";

export const bindTimestampValues = (
  formData: Record<string, any>,
  model: IModelService,
  columnTypes: TimestampColumns[] = [],
) => {
  if (
    columnTypes.includes(TimestampColumns.CREATED_AT) &&
    model.instance.createdAtColumn
  ) {
    formData[model.instance.createdAtColumn] = new Date();
  }

  if (
    columnTypes.includes(TimestampColumns.UPDATED_AT) &&
    model.instance.updatedAtColumn
  ) {
    formData[model.instance.updatedAtColumn] = new Date();
  }
};

export const getMergedFormData = (
  req: AxeRequest,
  fillables: string[],
): Record<string, any> => {
  const formData: Record<string, any> = {};

  Object.keys(req?.body || {}).forEach((key) => {
    if (fillables.includes(key)) {
      formData[key] = req.body[key];
    }
  });
  return formData;
};

export const callHooks = async (
  model: IModelService,
  type: HookFunctionTypes,
  params: IContext,
) => {
  if (model.hooks[type]) {
    const hookFunction: PhaseFunction = model.hooks[type];
    await hookFunction(params);
  }

  if (model.events[type]) {
    // Developers shouldn't be able to access transaction in events. Because
    // we don't await for the events. If the developer uses the transaction and
    // try to commit something, it would be lost cause the transaction could be
    // already completed.
    const database = await IoCService.use<Knex>("Database");
    params.database = database;

    // Calling the events
    model.events[type](params);
  }
};

export const getParentColumn = (
  model: IModelService,
  relation: IRelation | null,
) => {
  if (!relation) {
    return null;
  }

  return camelCase(`${model.name}-${relation.primaryKey}`);
};

export const checkPrimaryKeyValueType = (model: IModelService, value: any) => {
  // We should check the parameter type
  const primaryColumn = model.columns.find(
    (column) => column.name === model.instance.primaryKey,
  );

  if (
    NUMERIC_PRIMARY_KEY_TYPES.includes(primaryColumn?.data_type || "") &&
    isNaN(parseInt(value))
  ) {
    throw new ApiError(`Unacceptable parameter: ${value}`);
  }
};

export const addForeignKeyQuery = (
  request: AxeRequest,
  query: Knex.QueryBuilder,
  relation: IRelation | null,
  parentModel: IModelService | null,
) => {
  if (relation && parentModel) {
    const parentColumn = getParentColumn(parentModel, relation);
    if (parentColumn) {
      query.where(relation.foreignKey, request.params[parentColumn]);
    }
  }
};

const getPrimaryOrForeignKeyByRelation = (
  relation: IRelation,
  dataField: string,
) => {
  if (dataField === "primaryKey") {
    return relation.primaryKey;
  }
  return relation.foreignKey;
};

const uniqueByMap = <T>(array: T[]): T[] => {
  const map = new Map();
  for (const item of array) {
    map.set(item, item);
  }
  return Array.from(map.values());
};

const serialize = (
  data: any,
  callback: SerializationFunction | null,
  request: AxeRequest,
): any => {
  if (!callback) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => callback(item, request));
  }

  return callback(data, request);
};

const globalSerializer = async (
  version: IVersion,
  itemArray: any,
  handler: HandlerTypes,
  request: AxeRequest,
) => {
  if (!version.config.serializers) {
    return itemArray;
  }

  const callbacks: ((data: any, request: AxeRequest) => void)[] = [];
  // Push all runable serializer into callbacks.
  version.config.serializers.map((configSerializer) => {
    // Serialize data for all requests types.
    if (typeof configSerializer === "function") {
      callbacks.push(
        configSerializer as unknown as (data: any, request: AxeRequest) => void,
      );
      return;
    }

    // Serialize data with specific handler like "PAGINATE" or "SHOW".
    if (configSerializer.handler.includes(handler)) {
      callbacks.push(
        ...(configSerializer.serializer as unknown as ((
          data: any,
          request: AxeRequest,
        ) => void)[]),
      );
    }
  });

  callbacks.forEach((callback) => {
    itemArray = serialize(itemArray, callback, request);
  });

  return itemArray;
};

export const serializeData = async (
  version: IVersion,
  itemArray: any,
  modelSerializer: SerializationFunction | null,
  handler: HandlerTypes,
  request: AxeRequest,
): Promise<any[]> => {
  itemArray = serialize(itemArray, modelSerializer, request);
  itemArray = await globalSerializer(version, itemArray, handler, request);
  return itemArray;
};

export const filterHiddenFields = (
  itemArray: any[],
  hiddens: string[] | null,
) => {
  if (hiddens === null) {
    return;
  }

  if (hiddens.length === 0 || itemArray.length === 0) {
    return;
  }

  itemArray.forEach((item) => {
    hiddens.forEach((hidden) => {
      if (item[hidden] !== undefined) {
        delete item[hidden];
      }
    });
  });
};

export const addSoftDeleteQuery = (
  model: IModelService,
  conditions: IQuery | null,
  query: Knex.QueryBuilder,
) => {
  if (conditions !== null && conditions?.trashed === true) {
    valideteQueryFeature(model, QueryFeature.Trashed);
    return;
  }

  if (model.instance.deletedAtColumn) {
    query.whereNull(model.instance.deletedAtColumn);
  }
};

export const getRelatedData = async (
  version: IVersion,
  data: any[],
  withArray: IWith[],
  model: IModelService,
  modelList: ModelListService,
  database: Knex | Knex.Transaction,
  handler: HandlerTypes,
  request: AxeRequest,
) => {
  if (withArray.length === 0) {
    return;
  }

  const models = modelList.get();

  for (const clientQuery of withArray) {
    // Find the relation of the model. If the model doesn't have any relationship like the
    // user wants, we can't show anything.
    const definedRelation = model.relations.find(
      (relation) => relation.name === clientQuery.relationship,
    );
    if (!definedRelation) {
      throw new ApiError(`Undefined relation: ${clientQuery.relationship}`);
    }

    // Find the foreign model by the relationship
    const foreignModel = models.find(
      (model) => model.name === definedRelation.model,
    );
    if (!foreignModel) {
      continue;
    }

    // Validating the query limit
    valideteQueryFeature(
      model,
      RelationQueryFeatureMap[definedRelation.type],
      `${model.instance.table}.${definedRelation.name}`,
      `${model.instance.table}.${definedRelation.name}`,
    );

    let dataField = "primaryKey";
    let searchField = "foreignKey";
    if (definedRelation.type !== Relationships.HAS_MANY) {
      dataField = "foreignKey";
      searchField = "primaryKey";
    }

    const dataFieldKey = getPrimaryOrForeignKeyByRelation(
      definedRelation,
      dataField,
    );
    const searchFieldKey = getPrimaryOrForeignKeyByRelation(
      definedRelation,
      searchField,
    );

    // We should find the parent Primary Key values.
    const parentPrimaryKeyValues: any[] = data.map(
      (item) => item[dataFieldKey],
    );

    // Selecting the special field for the relations
    let selectColumns: string[] = ["*"];
    if (clientQuery.fields.length > 0) {
      selectColumns = [...clientQuery.fields, searchFieldKey];

      if (definedRelation.type === Relationships.HAS_MANY) {
        selectColumns.push(dataFieldKey);
      }

      // We should check if any select column is a relationship name. If so,
      // we should remove that column name from the select columns
      const possibleThirthLevelRelations = foreignModel.relations.map(
        (item) => item.name,
      );

      // Removing relationship values from the select column list
      selectColumns = selectColumns.filter(
        (column) => !possibleThirthLevelRelations.includes(column),
      );

      // We should check if the column is defined on the table.
      const undefinedColumns = selectColumns.filter(
        (column) => !foreignModel.columnNames.includes(column),
      );
      if (undefinedColumns.length > 0) {
        throw new ApiError(`Undefined columns: ${undefinedColumns.join(", ")}`);
      }
    }

    // We should add the HAS_ONE relation's foreignKeys incase the developer
    // wants the related data but didn't set the foreignKey column
    if (selectColumns.length > 0 && selectColumns[0] !== "*") {
      const requiredForeignKeys = foreignModel.relations
        .filter((item) => item.type === Relationships.HAS_ONE)
        .map((item) => item.foreignKey);
      selectColumns.push(...requiredForeignKeys);
    }

    selectColumns = uniqueByMap(selectColumns);

    const foreignModelQuery = database(foreignModel.instance.table).select(
      selectColumns,
    );

    // If the model is supported soft-delete we should check the data.
    if (foreignModel.instance.deletedAtColumn) {
      foreignModelQuery.whereNull(foreignModel.instance.deletedAtColumn);
    }

    // Fetching related records by foreignKey and primary key values.
    let relatedRecords = await foreignModelQuery.whereIn(
      searchFieldKey,
      parentPrimaryKeyValues,
    );

    // Adding related data source to the request tags to set cache tag values
    const { primaryKey } = foreignModel.instance;
    const cacheConfig = foreignModel.getCacheConfiguration(handler);
    const tagPrefix = cacheConfig?.tagPrefix
      ? `${cacheConfig?.tagPrefix}:`
      : "";
    request.original.tags.push(
      ...relatedRecords.map(
        (i: any) => `${tagPrefix}${foreignModel.name}:${i[primaryKey]}`,
      ),
    );

    // We should serialize related data if there is any serialization function
    relatedRecords = await serializeData(
      version,
      relatedRecords,
      foreignModel.serialize,
      handler,
      request,
    );

    // We should hide hidden fields if there is any
    filterHiddenFields(relatedRecords, foreignModel.instance.hiddens);

    // We should try to get child data if there is any on the query
    if (clientQuery.children.length > 0) {
      await getRelatedData(
        version,
        relatedRecords,
        clientQuery.children,
        foreignModel,
        modelList,
        database,
        handler,
        request,
      );
    }

    // Binding relation data to the parent rows.
    data.forEach((row) => {
      let values = relatedRecords.filter(
        (item) => item[searchFieldKey] === row[dataFieldKey],
      );
      if (definedRelation.type === Relationships.HAS_ONE) {
        values = values.length > 0 ? values[0] : null;
      }
      row[camelCase(definedRelation.name)] = values;
    });
  }
};

export const isBoolean = (value: any): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  value = ((value || "") as string).trim().toLocaleLowerCase();

  if (value === "true" || value === "1" || value === "on" || value === "yes") {
    return true;
  }

  return false;
};

export const getModelCacheConfiguration = (
  model: IModelService,
  apiConfig: ICacheConfiguration,
  versionConfig: ICacheConfiguration | null,
  handler: string,
): ICacheConfiguration => {
  let base: ICacheConfiguration = {
    ...DEFAULT_CACHE_CONFIGURATION,
    ...apiConfig,
  };

  if (model.instance.cache) {
    const data: any = model.instance.cache;

    if (Array.isArray(data)) {
      const handlerBasedConfigs = data as IHandlerBasedCacheConfig[];
      for (const item of handlerBasedConfigs) {
        const isFound = item.handlers.map((i) => i as string).includes(handler);
        if (isFound) {
          base = {
            ...base,
            ...item.cache,
          };
          return base;
        }
      }
    } else {
      base = {
        ...base,
        ...(data as ICacheConfiguration),
      };
      return base;
    }
  }

  if (versionConfig) {
    base = {
      ...base,
      ...versionConfig,
    };
  }

  return base;
};

export const defaultCacheKeyFunction = (req: AxeRequest) => {
  return JSON.stringify({
    url: req.url,
    method: req.method,
    headers: req.original.headers,
  });
};

export const toCacheKey = (context: IContext) => {
  const { model, handlerType } = context;
  const config = model.getCacheConfiguration(handlerType);
  const keyData = config?.cacheKey
    ? config.cacheKey(context.req)
    : defaultCacheKeyFunction(context.req);
  const key = crypto.createHash("sha256").update(keyData).digest("hex");
  return toCachePrefix(config?.cachePrefix) + key;
};

export const putCache = async (context: IContext, data: any) => {
  // Getting the correct configuration
  const { model, handlerType } = context;
  const config = model.getCacheConfiguration(handlerType);

  // Check if the cache enable for this handler
  if (config?.enable) {
    // Getting the redis service
    const redis = await IoCService.use<RedisAdaptor>("Redis");
    // Generating the cache key
    const key = toCacheKey(context);
    console.log("HERE", key);

    // Setting the tags if the cache configuration of the model has been set as
    // tag-based cache invalidation strategy. Which means, the key cached value
    // can be deleted if the tagged items updated/delete
    if (config.invalidation === CacheStrategies.TagBased) {
      redis.tags(context.req.original.tags, key);
    }

    // Putting the cache data
    redis.set(key, JSON.stringify(data), config.ttl || 1000);
    if (config.responseHeader) {
      context.res.header(config.responseHeader, "Missed");
    }

    // Logging
    LogService.debug(`\t🔄 redis.cache(${key},${config.ttl})`);
  }
};

export const clearCacheTags = async (tag: string) => {
  const redis = await IoCService.use<RedisAdaptor>("Redis");
  const members = await redis.getTagMemebers(tag);
  if (members.length > 0) {
    await redis.delete(members);
  }
};

export const toCachePrefix = (value: string | undefined | null) => {
  return value ? `${value}:` : "";
};
