import { RELATIONSHIPS } from "./../Constants.js";

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

export const getParentColumn = (request) => {
  const sections = request.route.path
    .replace("/api/", "")
    .split("/")
    .filter((item) => item !== ":id" && item.indexOf(":") > -1);
  if (sections.length > 0) {
    return sections[sections.length - 1].replace(":", "");
  }
  return null;
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
      continue;
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
    }

    // Fetching related records by foreignKey and primary key values.
    const relatedRecords = await database(foreignModel.instance.table)
      .select(selectColumns)
      .whereIn(definedRelation[searchField], parentPrimaryKeyValues);

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
      values = row[definedRelation.name] = values;
    });
  }
};

export const filterHiddenFields = (itemArray, hiddens) => {
  if (hiddens.length === 0 || itemArray.length === 0) {
    return;
  }

  itemArray.forEach((item) => {
    hiddens.forEach((hidden) => {
      delete item[hidden];
    });
  });
};
