import { RELATIONSHIPS } from "./../constants.js";
import { camelCase } from "change-case";
import HttpResponse from "./../core/HttpResponse.js";
import IoC from '../core/IoC.js';

const getInputFromBody = (body, field) => {
  if (!body) {
    return null;
  }
  let value = null;
  for (const key of Object.keys(body)) {
    if (key.trim() === field.trim()) {
      value = body[key];
      break;
    }
  }
  return value;
};

export const getFormData = (request, fillable) => {
  let fields = fillable;
  if (!Array.isArray(fillable)) {
    fields = fillable[request.method] ? fillable[request.method] : [];
  }

  const filtered = {};
  for (const field of fields) {
    filtered[field] = getInputFromBody(request.body, field);
  }

  return filtered;
};

export const getFormValidation = (method, validations) => {
  if (!validations) {
    return undefined;
  }

  if (validations[method]) {
    return validations[method];
  }

  if (validations.POST || validations.PUT) {
    return undefined;
  }

  return validations;
};

export const callHooks = async (model, type, data) => {
  if (model.hooks[type]) {
    await model.hooks[type](data);
  }

  if (model.events[type]) {
    const context = {
      ...data,
    };

    // Developers shouldn't be able to access transaction in events. Because
    // we don't await for the events. If the developer uses the transaction and
    // try to commit something, it would be lost cause the transaction could be
    // already completed.
    if (context.trx) {
      delete context.trx;
    }

    model.events[type](context);
  }
};

export const getRelatedData = async (
  data,
  withArray,
  model,
  models,
  database,
  handler
) => {
  if (withArray.length === 0) {
    return;
  }

  for (const clientQuery of withArray) {
    // Find the relation of the model. If the model doesn't have any relationship like the
    // user wants, we can't show anything.
    const definedRelation = model.instance.relations.find(
      (relation) => relation.name === clientQuery.relationship
    );
    if (!definedRelation) {
      throw new HttpResponse(
        400,
        `Undefined relation: ${clientQuery.relationship}`
      );
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
    if (definedRelation.type !== RELATIONSHIPS.HAS_MANY) {
      dataField = "foreignKey";
      searchField = "primaryKey";
    }

    // We should find the parent Primary Key values.
    const parentPrimaryKeyValues = data.map(
      (item) => item[definedRelation[dataField]]
    );

    // Selecting the special field for the relations
    let selectColumns = "*";
    if (clientQuery.fields.length > 0) {
      selectColumns = [...clientQuery.fields, definedRelation[searchField]];

      if (definedRelation.type === RELATIONSHIPS.HAS_MANY) {
        selectColumns.push(definedRelation[dataField]);
      }

      // We should check if any select column is a relationship name. If so,
      // we should remove that column name from the select columns
      const possibleThirthLevelRelations = foreignModel.instance.relations.map(
        (item) => item.name
      );

      // Deteching the other relations
      const workList = selectColumns.filter((column) =>
        possibleThirthLevelRelations.includes(column)
      );

      // Removing relationship values from the select column list
      selectColumns = selectColumns.filter(
        (column) => !possibleThirthLevelRelations.includes(column)
      );

      // Adding relationship request as the child objects
      clientQuery.children = [
        ...clientQuery.children,
        ...workList.map((relationship) => {
          return {
            relationship,
            fields: [],
            children: [],
          };
        }),
      ];

      // We should check if the column is defined on the table.
      const undefinedColumns = selectColumns.filter(
        (column) => !foreignModel.instance.columnNames.includes(column)
      );
      if (undefinedColumns.length > 0) {
        throw new HttpResponse(
          400,
          `Undefined columns: ${undefinedColumns.join(", ")}`
        );
      }
    }

    // We should add the HAS_ONE relation's foreignKeys incase the developer
    // wants the related data but didn't set the foreignKey column
    if (Array.isArray(selectColumns)) {
      const requiredForeignKeys = foreignModel.instance.relations
        .filter((item) => item.type === RELATIONSHIPS.HAS_ONE)
        .map((item) => item.foreignKey);
      selectColumns.push(...requiredForeignKeys);
    }

    // Fetching related records by foreignKey and primary key values.
    let relatedRecords = await database(foreignModel.instance.table)
      .select(selectColumns)
      .whereIn(definedRelation[searchField], parentPrimaryKeyValues);

    // We should serialize related data if there is any serialization function
    relatedRecords = await serializeData(
      relatedRecords,
      foreignModel.instance.serialize,
      handler
    );

    // We should hide hidden fields if there is any
    filterHiddenFields(relatedRecords, foreignModel.instance.hiddens);

    // We should try to get child data if there is any on the query
    if (clientQuery.children.length > 0) {
      await getRelatedData(
        relatedRecords,
        clientQuery.children,
        foreignModel,
        models,
        database,
        handler
      );
    }

    // Binding relation data to the parent rows.
    data.forEach((row) => {
      let values = relatedRecords.filter(
        (item) =>
          item[definedRelation[searchField]] === row[definedRelation[dataField]]
      );
      if (definedRelation.type === RELATIONSHIPS.HAS_ONE) {
        values = values.length > 0 ? values[0] : null;
      }
      row[definedRelation.name] = values;
    });
  }
};

export const filterHiddenFields = (itemArray, hiddens) => {
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

export const bindTimestampValues = (formData, columnTypes = [], model) => {
  for (const columnType of columnTypes) {
    if (model.instance[columnType]) {
      formData[model.instance[columnType]] = new Date();
    }
  }
};

const serialize = async (data, callback) => {
  if (!callback) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(callback);
  }

  return [data].map(callback)[0];
}

const globalSerializer = async (itemArray, handler) => {
  const { Application } = await IoC.use("Config");

  if (!Application.serializers) {
    return itemArray;
  }

  let callbacks = [];
  // Push all runable serializer into callbacks. 
  Application.serializers.map(configSerializer => {
    // Serialize data for all requests types.
    if (typeof configSerializer === "function") {
      callbacks.push(configSerializer);
      return
    }

    // Serialize data with specific handler like "PAGINATE" or "SHOW".
    if (typeof configSerializer === "object" && configSerializer.handler.includes(handler)) {
      // Handle multiple serializer.
      if (Array.isArray(configSerializer.serializer)) {
        configSerializer.serializer.forEach(fn => callbacks.push(fn));
        return
      }
      callbacks.push(configSerializer.serializer)
      return
    }
  })

  while (callbacks.length !== 0) {
    itemArray = await serialize(itemArray, callbacks.shift());
  }
  return itemArray;
};

export const serializeData = async (itemArray, modelSerializer, handler) => {
  itemArray = await serialize(itemArray, modelSerializer);
  itemArray = await globalSerializer(itemArray, handler);
  return itemArray;
};

export const getParentColumn = (relation) => {
  if (!relation) {
    return null;
  }

  return camelCase(relation.foreignKey);
};

export const addForeignKeyQuery = (request, query, relation, parentModel) => {
  if (relation && parentModel) {
    const parentColumn = getParentColumn(relation);
    query.where(relation.foreignKey, request.params[parentColumn]);
  }
};
