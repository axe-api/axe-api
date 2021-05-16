import { callHooks, getParentColumn } from "./helpers.js";
import { HOOK_FUNCTIONS, RELATIONSHIPS } from "./../Constants.js";

const getRelatedData = async (data, withArray, model, models, database) => {
  if (withArray.length > 0) {
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
        const possibleThirthLevelRelations =
          foreignModel.instance.relations.map((item) => item.name);

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
            item[definedRelation[searchField]] ===
            row[definedRelation[dataField]]
        );
        if (definedRelation.type === RELATIONSHIPS.HAS_ONE) {
          values = values.length > 0 ? values[0] : null;
        }
        values = row[definedRelation.name] = values;
      });
    }
  }
};

export default async (pack) => {
  const {
    request,
    response,
    model,
    models,
    queryParser,
    database,
    relation,
    parentModel,
  } = pack;

  // We should parse URL query string to use as condition in Lucid query
  const conditions = queryParser.get(request.query);

  // Creating a new database query
  const query = database.from(model.instance.table);

  // Users should be able to select some fields to show.
  queryParser.applyFields(query, conditions.fields);

  // Binding parent id if there is.
  if (relation && parentModel) {
    const parentColumn = getParentColumn(request);
    query.where(relation.foreignKey, request.params[parentColumn]);
  }

  // Users should be able to filter records
  queryParser.applyWheres(query, conditions.q);

  // // Users should be able to add relationships to the query
  // this.queryParser.applyRelations(query, conditions.with);
  await callHooks(model, HOOK_FUNCTIONS.onBeforePaginate, {
    ...pack,
    conditions,
    query,
  });

  // User should be able to select sorting fields and types
  queryParser.applySorting(query, conditions.sort);

  const result = await query.paginate({
    perPage: conditions.per_page,
    currentPage: conditions.page,
  });

  // We should try to get related data if there is any
  await getRelatedData(result.data, conditions.with, model, models, database);

  await callHooks(model, HOOK_FUNCTIONS.onAfterPaginate, {
    ...pack,
    result,
    conditions,
    query,
  });

  return response.json(result);
};
