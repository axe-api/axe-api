import HttpResponse from "./../core/HttpResponse.js";
import { RELATIONSHIPS } from "../constants.js";

class QueryParser {
  constructor({ model, models }) {
    this.model = model;
    this.models = models;
    this.createdJoins = [];
    this.relationColumns = [];
    this.usedConditionColumns = new Set();
  }

  applyFields(query, fields) {
    // Users should be able to select some fields to show.
    if (!Array.isArray(fields)) {
      query.select(`${this.model.instance.table}.${fields}`);
    } else if (fields.length > 0 && fields != "*") {
      const fullPathFields = fields.map((field) => {
        if (field.includes(".") === false) {
          return `${this.model.instance.table}.${field}`;
        }
        return field;
      });
      query.select([...fullPathFields, ...this.relationColumns]);
    } else {
      query.select(`${this.model.instance.table}.*`);
    }
  }

  applySorting(query, sort) {
    if (sort.length === 0) {
      return;
    }

    sort.forEach((item) => {
      query.orderBy(item.field, item.type);
    });
  }

  applyWheresInsideGroup(sub, ruleSet) {
    // If there is not any query, we don't have to filter the data.
    if (!ruleSet) {
      return;
    }

    if (Array.isArray(ruleSet)) {
      for (const item of ruleSet) {
        // If the item is not an array, it means that it is a standard condition
        if (Array.isArray(item) === false) {
          this._applyConditionRule(sub, item);
        } else {
          // If the item is an array, we should create the query recursively.
          if (item[0].prefix === "or") {
            sub.orWhere((sub) => {
              this.applyWheresInsideGroup(sub, item);
            });
          } else {
            sub.where((sub) => {
              this.applyWheresInsideGroup(sub, item);
            });
          }
        }
      }
    } else {
      this._applyConditionRule(sub, ruleSet);
    }
  }

  applyWheres(query, ruleSet) {
    query.where((sub) => {
      this.applyWheresInsideGroup(sub, ruleSet);
    });

    this._applyRelatedQueryJoins(query, ruleSet);
  }

  get(query) {
    const conditions = this._parseSections(this._getSections(query));
    const usedColumns = this._getUsedColumns(conditions);
    const undefinedColumns = usedColumns.filter((columnName) => {
      let currentModel = this.model;
      let realColumName = columnName;
      if (columnName.includes(".")) {
        const [table, splittedColumnName] = columnName.split(".");
        currentModel = this.models.find(
          (model) => model.instance.table === table
        );
        realColumName = splittedColumnName;
      }
      return !currentModel.instance.columnNames.includes(realColumName);
    });

    if (undefinedColumns.length > 0) {
      throw new HttpResponse(400, {
        message: `Undefined column names: ${undefinedColumns.join(",")}`,
      });
    }

    return conditions;
  }

  _getUsedColumns(conditions) {
    return [
      ...conditions.fields,
      ...conditions.sort.map((item) => item.field),
      ...Array.from(this.usedConditionColumns),
    ];
  }

  _applyConditionRule(sub, ruleSet) {
    const method = this._getConditionMethodName(ruleSet);
    const zeroArguments = ["Null", "NotNull"];
    const oneArguments = ["In", "NotIn", "Between", "NotBetween"];

    const fullFieldPath = `${ruleSet.table}.${ruleSet.field}`;

    if (zeroArguments.indexOf(ruleSet.condition) > -1) {
      return sub[`${method}${ruleSet.condition}`](fullFieldPath);
    }

    if (oneArguments.indexOf(ruleSet.condition) > -1) {
      return sub[`${method}${ruleSet.condition}`](fullFieldPath, ruleSet.value);
    }

    return sub[method](fullFieldPath, ruleSet.condition, ruleSet.value);
  }

  _applyRelatedQueryJoins(query, ruleSet) {
    if (!ruleSet) {
      return;
    }

    if (Array.isArray(ruleSet)) {
      for (const item of ruleSet) {
        // If the item is not an array, it means that it is a standard condition
        if (Array.isArray(item) === false) {
          this._applyJoinIfNecessary(query, item);
        } else {
          this._applyRelatedQueryJoins(query, item);
        }
      }
    } else {
      this._applyJoinIfNecessary(query, ruleSet);
    }
  }

  _applyJoinIfNecessary(query, ruleSet) {
    if (ruleSet.table !== this.model.instance.table) {
      this._addJoinOnce(query, ruleSet);
    }
  }

  _addJoinOnce(query, { model, relation }) {
    if (this.createdJoins.includes(relation.name)) {
      return;
    }

    const tableName = model.instance.table;
    const primaryKey = `${model.instance.table}.${relation.primaryKey}`;
    const foreignKey = `${this.model.instance.table}.${relation.foreignKey}`;
    query.leftJoin(tableName, primaryKey, foreignKey);
    this.createdJoins.push(relation.name);
  }

  _getSections(query) {
    if (typeof query !== "object") {
      throw new Error("You have to send an object to get sections.");
    }

    const sections = {
      q: null,
      page: null,
      per_page: null,
      sort: null,
      fields: null,
      with: null,
    };

    for (const key of Object.keys(query)) {
      if (sections[key] === undefined) {
        continue;
      }

      sections[key] = query[key];
    }

    return sections;
  }

  _parseSections(sections) {
    if (sections.q) {
      const queryContent = sections.q.replace(/%20/g, "").replace(/ /g, "");

      // Users can send an unacceptable query string. We shouldn't allow them to
      // send unacceptable structure because of security reasons.
      try {
        sections.q = JSON.parse(queryContent);
      } catch (err) {
        throw new HttpResponse(400, {
          message: `Unacceptable query string: ${queryContent}`,
        });
      }
    }

    sections.page = this._parsePage(sections.page);
    sections.per_page = this._parsePerPage(sections.per_page);
    sections.fields = this._parseFields(sections.fields);
    sections.sort = this._parseSortingOptions(sections.sort);
    sections.q = this._parseCondition(sections.q);
    sections.with = this._parseWith(this._parseWithSections(sections.with));
    this._addRelationColumns(sections.with);

    return sections;
  }

  _parsePage(content) {
    const value = parseInt(content);

    if (isNaN(value)) {
      return 1;
    }

    if (value <= 0) {
      return 1;
    }

    return value;
  }

  _parsePerPage(content) {
    const value = parseInt(content);

    if (isNaN(value) || value <= 1 || value > 10000) {
      return 10;
    }

    return value;
  }

  _parseFields(content) {
    if (!content) {
      return [];
    }

    // User should be able to select "all" fields.
    if (content.trim() === "*") {
      return "*";
    }

    const fields = content.split(",");
    fields.forEach((field) => {
      this._shouldBeAcceptableColumn(field);
    });
    return fields;
  }

  _parseSortingOptions(content) {
    // If there is not any sorting options, we don't have to return any value
    if (!content) {
      return [];
    }

    const result = [];
    for (let field of content.split(",")) {
      let type = "ASC";
      if (field.indexOf("-") === 0) {
        type = "DESC";
        field = field.substr(1);
      }

      if (field.indexOf("+") === 0) {
        field = field.substr(1);
      }

      this._shouldBeAcceptableColumn(field);
      result.push({
        field,
        type,
      });
    }
    return result;
  }

  _parseConditions(conditions) {
    if (!Array.isArray(conditions)) {
      throw new Error("An array should be sent to parseConditions() method.");
    }

    return conditions.map((condition) => {
      return this._parseCondition(condition);
    });
  }

  _parseCondition(content) {
    if (Array.isArray(content)) {
      return this._parseConditions(content);
    }

    if (!content) {
      return null;
    }

    const wheres = [];
    for (const key in content) {
      wheres.push(this._parseConditionObject(content, key));
    }

    return wheres;
  }

  _parseConditionObject(content, key) {
    const where = {
      prefix: null,
      model: this.model,
      table: this.model.instance.table,
      field: key,
      condition: "=",
      value: content[key],
    };

    // Sometimes we can have basic OR operations for queries
    if (where.field.indexOf("$or.") === 0) {
      where.prefix = "or";
      where.field = where.field.replace("$or.", "");
    }

    if (where.field.indexOf("$and.") === 0) {
      where.prefix = "and";
      where.field = where.field.replace("$and.", "");
    }

    // If there is not any value, it means that we should check nullable values
    if (where.value === null) {
      // If the client wants to see not nullable values
      if (this._hasSpecialStructure(where.field, ".$not")) {
        where.field = where.field.replace(".$not", "");
        where.condition = "NotNull";
      } else {
        // So, it means that the clients wants to see null valus
        where.condition = "Null";
      }
    } else {
      // If there is value, we should check it
      this._applySpecialCondition(where, "$not", "<>");
      this._applySpecialCondition(where, "$gt", ">");
      this._applySpecialCondition(where, "$gte", ">=");
      this._applySpecialCondition(where, "$lt", "<");
      this._applySpecialCondition(where, "$lte", "<=");
      this._applySpecialCondition(where, "$like", "LIKE");
      this._applySpecialCondition(where, "$notLike", "NOT LIKE");
      this._applySpecialCondition(where, "$in", "In");
      this._applySpecialCondition(where, "$notIn", "NotIn");
      this._applySpecialCondition(where, "$between", "Between");
      this._applySpecialCondition(where, "$notBetween", "NotBetween");
    }

    if (where.condition === "In" || where.condition === "NotIn") {
      where.value = where.value.split(",");
    }

    if (where.condition === "Between" || where.condition === "NotBetween") {
      where.value = where.value.split(":");
    }

    if (where.condition === "LIKE" || where.condition === "NOT LIKE") {
      where.value = where.value.replace(/\*/g, "%");
    }

    // This means that the condition is related with another table
    if (where.field.includes(".")) {
      const [relationName, field] = where.field.split(".");

      const relation = this.model.instance.relations.find(
        (item) =>
          item.name === relationName && item.type === RELATIONSHIPS.HAS_ONE
      );

      if (!relation) {
        throw new HttpResponse(400, {
          message: `Unacceptable query field: ${relationName}.${field}`,
        });
      }

      const relatedModel = this.models.find(
        (item) => item.name === relation.model
      );

      if (!relatedModel) {
        throw new HttpResponse(400, {
          message: `Undefined model name: ${relation.model}`,
        });
      }

      where.model = relatedModel;
      where.table = relatedModel.instance.table;
      where.relation = relation;
      where.field = field;
    }

    this._shouldBeAcceptableColumn(where.field);
    this.usedConditionColumns.add(`${where.table}.${where.field}`);

    return where;
  }

  _parseWithSections(content) {
    if (!content) {
      return [];
    }
    return content.split(",");
  }

  _parseWith(items) {
    const result = [];
    for (const item of items) {
      let relationship = item;
      let fields = [];
      let children = [];

      const columnIndex = relationship.indexOf("{");
      if (columnIndex > -1) {
        fields = this._splitWithRecursive(
          relationship.substr(
            columnIndex + 1,
            relationship.length - columnIndex - 2
          )
        );

        relationship = relationship.substr(0, columnIndex);
      }

      // We are checking there is any children
      children = fields.filter(
        (field) => field.indexOf("{") > -1 || field.indexOf(".") > -1
      );

      // Field list shouldn't have any related table
      fields = fields.filter(
        (field) => field.indexOf("{") === -1 && field.indexOf(".") === -1
      );

      // We should validate fields are correct.
      fields.forEach((field) => {
        this._shouldBeAcceptableColumn(field);
      });

      // We should calculate recursivly all of childre
      children = this._parseWith(children);

      result.push({
        relationship,
        fields,
        children,
      });
    }
    return result;
  }

  _splitWithRecursive(content) {
    const result = [];
    let startAt = 0;
    let subcounter = 0;
    for (let position = 0; position < content.length; position++) {
      const current = content[position];

      if (current === "{") {
        subcounter++;
      }

      if (current === "}") {
        subcounter--;
      }

      if (current === "|" && subcounter === 0) {
        result.push(content.substr(startAt, position - startAt));
        startAt = position + 1;
      }
    }

    result.push(content.substr(startAt));
    return result;
  }

  _applySpecialCondition(where, structure, condition) {
    structure = `.${structure}`;
    if (this._hasSpecialStructure(where.field, structure)) {
      where.field = where.field.replace(structure, "");
      where.condition = condition;
    }
  }

  _addRelationColumns(withs) {
    withs.forEach((item) => {
      const relation = this.model.instance.relations.find(
        (i) => i.name === item.relationship
      );
      if (!relation) {
        throw new HttpResponse(400, {
          message: `Undefined relation: ${item.relationship}`,
        });
      }

      this.relationColumns.push(
        `${this.model.instance.table}.${relation.foreignKey}`
      );
    });
  }

  _getConditionMethodName(ruleSet) {
    if (ruleSet.prefix === "or") {
      return "orWhere";
    }
    return "where";
  }

  _hasSpecialStructure(field, structure) {
    if (field.indexOf(structure) === -1) {
      return false;
    }

    if (field.indexOf(structure) === field.length - structure.length) {
      return true;
    }

    return false;
  }

  _shouldBeAcceptableColumn(field) {
    const regex = /^[0-9,a-z,A-Z_.]+$/;
    if (!field.match(regex)) {
      throw new HttpResponse(400, {
        message: `Unacceptable field name: ${field}`,
      });
    }

    if (field.indexOf(".") === 0 || field.indexOf(".") === field.length - 1) {
      throw new HttpResponse(400, {
        message: `You have to define the column specefically: ${field}`,
      });
    }
  }
}

export default QueryParser;
