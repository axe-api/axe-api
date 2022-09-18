import { Request } from "express";
import { camelCase } from "change-case";
import {
  IModelService,
  IRelation,
  IApplicationConfig,
  IHookParameter,
} from "../Interfaces";
import { Knex } from "knex";
import { IWith } from "../Interfaces";
import {
  HandlerTypes,
  Relationships,
  HookFunctionTypes,
  TimestampColumns,
} from "../Enums";
import ApiError from "../Exceptions/ApiError";
import { IoCService, ModelListService } from "../Services";

export const bindTimestampValues = (
  formData: Record<string, any>,
  columnTypes: TimestampColumns[] = [],
  model: IModelService
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
  req: Request,
  fillables: string[]
): Record<string, any> => {
  const formData: Record<string, any> = {};
  Object.keys(req.body).forEach((key) => {
    if (fillables.includes(key)) {
      formData[key] = req.body[key];
    }
  });
  return formData;
};

export const callHooks = async (
  model: IModelService,
  type: HookFunctionTypes,
  params: IHookParameter
) => {
  if (model.hooks[type]) {
    await model.hooks[type](params);
  }

  if (model.events[type]) {
    // Developers shouldn't be able to access transaction in events. Because
    // we don't await for the events. If the developer uses the transaction and
    // try to commit something, it would be lost cause the transaction could be
    // already completed.
    const database = (await IoCService.use("Database")) as Knex;
    params.database = database;

    // Calling the events
    model.events[type](params);
  }
};

export const getParentColumn = (relation: IRelation | null) => {
  if (!relation) {
    return null;
  }

  return camelCase(relation.foreignKey);
};

export const addForeignKeyQuery = (
  request: Request,
  query: Knex.QueryBuilder,
  relation: IRelation | null,
  parentModel: IModelService | null
) => {
  if (relation && parentModel) {
    const parentColumn = getParentColumn(relation);
    if (parentColumn) {
      query.where(relation.foreignKey, request.params[parentColumn]);
    }
  }
};

const getPrimaryOrForeignKeyByRelation = (
  relation: IRelation,
  dataField: string
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
  data: any[] | any,
  callback: (data: any, request: Request) => void,
  request: Request
): any[] | any => {
  if (!callback) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => callback(item, request));
  }

  return callback(data, request);
};

const globalSerializer = async (
  itemArray: any[] | any,
  handler: HandlerTypes,
  request: Request
) => {
  const Application = await IoCService.useByType<IApplicationConfig>("Config");

  if (!Application.serializers) {
    return itemArray;
  }

  const callbacks: ((data: any, request: Request) => void)[] = [];
  // Push all runable serializer into callbacks.
  Application.serializers.map((configSerializer) => {
    // Serialize data for all requests types.
    if (typeof configSerializer === "function") {
      callbacks.push(
        configSerializer as unknown as (data: any, request: Request) => void
      );
      return;
    }

    // Serialize data with specific handler like "PAGINATE" or "SHOW".
    if (configSerializer.handler.includes(handler)) {
      callbacks.push(
        ...(configSerializer.serializer as unknown as ((
          data: any,
          request: Request
        ) => void)[])
      );
      return;
    }
  });

  callbacks.forEach((callback) => {
    itemArray = serialize(itemArray, callback, request);
  });

  return itemArray;
};

export const serializeData = async (
  itemArray: any[] | any,
  modelSerializer: (data: any, request: Request) => void,
  handler: HandlerTypes,
  request: Request
): Promise<any[]> => {
  itemArray = serialize(itemArray, modelSerializer, request);
  itemArray = await globalSerializer(itemArray, handler, request);
  return itemArray;
};

export const filterHiddenFields = (
  itemArray: any[],
  hiddens: string[] | null
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

export const getRelatedData = async (
  data: any[],
  withArray: IWith[],
  model: IModelService,
  modelList: ModelListService,
  database: Knex | Knex.Transaction,
  handler: HandlerTypes,
  request: Request
) => {
  if (withArray.length === 0) {
    return;
  }

  const models = modelList.get();

  for (const clientQuery of withArray) {
    // Find the relation of the model. If the model doesn't have any relationship like the
    // user wants, we can't show anything.
    const definedRelation = model.relations.find(
      (relation) => relation.name === clientQuery.relationship
    );
    if (!definedRelation) {
      throw new ApiError(`Undefined relation: ${clientQuery.relationship}`);
    }

    // Find the foreign model by the relationship
    const foreignModel = models.find(
      (model) => model.name === definedRelation.model
    );
    if (!foreignModel) {
      continue;
    }

    let dataField = "primaryKey";
    let searchField = "foreignKey";
    if (definedRelation.type !== Relationships.HAS_MANY) {
      dataField = "foreignKey";
      searchField = "primaryKey";
    }

    const dataFieldKey = getPrimaryOrForeignKeyByRelation(
      definedRelation,
      dataField
    );
    const searchFieldKey = getPrimaryOrForeignKeyByRelation(
      definedRelation,
      searchField
    );

    // We should find the parent Primary Key values.
    const parentPrimaryKeyValues: any[] = data.map(
      (item) => item[dataFieldKey] as any
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
        (item) => item.name
      );

      // Removing relationship values from the select column list
      selectColumns = selectColumns.filter(
        (column) => !possibleThirthLevelRelations.includes(column)
      );

      // We should check if the column is defined on the table.
      const undefinedColumns = selectColumns.filter(
        (column) => !foreignModel.columnNames.includes(column)
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

    // Fetching related records by foreignKey and primary key values.
    let relatedRecords = await database(foreignModel.instance.table)
      .select(selectColumns)
      .whereIn(searchFieldKey, parentPrimaryKeyValues);

    // We should serialize related data if there is any serialization function
    relatedRecords = await serializeData(
      relatedRecords,
      foreignModel.instance.serialize,
      handler,
      request
    );

    // We should hide hidden fields if there is any
    filterHiddenFields(relatedRecords, foreignModel.instance.hiddens);

    // We should try to get child data if there is any on the query
    if (clientQuery.children.length > 0) {
      await getRelatedData(
        relatedRecords,
        clientQuery.children,
        foreignModel,
        modelList,
        database,
        handler,
        request
      );
    }

    // Binding relation data to the parent rows.
    data.forEach((row) => {
      let values = relatedRecords.filter(
        (item) => item[searchFieldKey] === row[dataFieldKey]
      );
      if (definedRelation.type === Relationships.HAS_ONE) {
        values = values.length > 0 ? values[0] : null;
      }
      row[camelCase(definedRelation.name)] = values;
    });
  }
};
