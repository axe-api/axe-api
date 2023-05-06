import { IModelService, IWith, IRelation } from '../Interfaces';
import ApiError from '../Exceptions/ApiError';

interface IExpression {
  key: string;
  children: IExpression[];
}

class WithQueryResolver {
  model: IModelService;
  models: IModelService[];

  constructor(model: IModelService, models: IModelService[]) {
    this.model = model;
    this.models = models;
  }

  resolve(expression: string): IWith[] {
    const result: IWith[] = [];
    const root: IExpression = {
      key: 'root',
      children: [],
    };
    const currentModel = this.model;
    this.toNestedArray(root, expression);
    this.resolveRelationsByKey(result, null, root.children, currentModel);

    return result;
  }

  private resolveRelationsByKey(
    result: IWith[],
    fields: string[] | null,
    expressions: IExpression[],
    model: IModelService
  ) {
    for (const expression of expressions) {
      if (expression.key.trim().length === 0) {
        continue;
      }

      const relationFunction = (model.instance as any)[expression.key];
      if (typeof relationFunction === 'function') {
        const definition: IRelation = relationFunction.call(model.instance);
        const relationModel = this.models.find(
          (item) => item.name === definition.model
        );

        if (relationModel === undefined) {
          throw new ApiError(
            `Undefined relation model: ${definition.model} (${expression.key})`
          );
        }

        const data: IWith = {
          relationship: expression.key,
          relationModel,
          fields: [],
          children: [],
        };

        if (expression.children.length > 0) {
          this.resolveRelationsByKey(
            data.children,
            data.fields,
            expression.children,
            relationModel
          );
        }

        result.push(data);
      } else if (fields !== null) {
        if (model.columnNames.includes(expression.key)) {
          fields.push(expression.key);
        } else {
          throw new ApiError(
            `It is not a field or a relation: ${expression.key}`
          );
        }
      } else {
        throw new ApiError(`Unknown expression: ${expression.key}`);
      }
    }
  }

  private toNestedArray(root: IExpression, expression: string) {
    const groups = this.splitByGroups(expression);
    for (const group of groups) {
      const key = this.getKey(group);
      if (key) {
        const child: IExpression = {
          key,
          children: [],
        };

        this.toNestedArray(child, this.getGroupValue(group));

        root.children.push(child);
      } else {
        root.children.push(
          ...group.split('|').map((field) => {
            return {
              key: field,
              children: [],
            } as IExpression;
          })
        );
      }
    }
  }

  private getKey = (group: string) => {
    const firstIndex = group.indexOf('{');
    if (firstIndex > -1) {
      return group.substring(0, firstIndex);
    }

    return null;
  };

  private getGroupValue = (group: string) => {
    const firstIndex = group.indexOf('{');
    if (firstIndex > -1) {
      return group.substring(firstIndex + 1, group.length - 1);
    }

    return group;
  };

  private splitByGroups(expression: string): string[] {
    const result: string[] = [];
    let bracket = 0;
    let startedAt = 0;

    for (let index = 0; index < expression.length; index++) {
      const char = expression[index];
      if (char === '{') {
        bracket++;
      } else if (char === '}') {
        bracket--;
      }

      if (bracket === 0 && char === ',') {
        result.push(expression.substring(startedAt, index));
        startedAt = index + 1;
      }
    }

    result.push(expression.substring(startedAt, expression.length));

    return result;
  }
}

export default WithQueryResolver;
