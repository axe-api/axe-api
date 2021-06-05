import { RELATIONSHIPS } from "./../Constants.js";
import { camelCase } from "change-case";
import HttpResponse from "./../core/HttpResponse.js";

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
    model.events[type](data);
  }
};

export const getParentColumn = (relation) => {
  if (!relation) {
    return null;
  }

  return camelCase(relation.foreignKey);
};

export const getRelatedData = async (
  data,
  withArray,
  model,
  models,
  database
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

    // Fetching related records by foreignKey and primary key values.
    let relatedRecords = await database(foreignModel.instance.table)
      .select(selectColumns)
      .whereIn(definedRelation[searchField], parentPrimaryKeyValues);

    // We should serialize related data if there is any serialization function
    relatedRecords = serializeData(
      relatedRecords,
      foreignModel.instance.serialize
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
        database
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

export const serializeData = (itemArray, serialize) => {
  if (!serialize) {
    return itemArray;
  }

  if (Array.isArray(itemArray)) {
    return itemArray.map(serialize);
  }

  return [itemArray].map(serialize)[0];
};
