import { QueryFeature, QueryFeatureType } from "../Enums";
import { IModelService, IQueryLimitConfig } from "../Interfaces";
import ApiError from "../Exceptions/ApiError";

const QueryFeatureMap: Record<QueryFeature, Array<QueryFeature>> = {
  [QueryFeature.All]: [
    QueryFeature.FieldsAll,
    QueryFeature.Sorting,
    QueryFeature.Limits,
    QueryFeature.WhereEqual,
    QueryFeature.WhereNotEqual,
    QueryFeature.WhereGt,
    QueryFeature.WhereGte,
    QueryFeature.WhereLt,
    QueryFeature.WhereLte,
    QueryFeature.WhereLike,
    QueryFeature.WhereNotLike,
    QueryFeature.WhereIn,
    QueryFeature.WhereNotIn,
    QueryFeature.WhereBetween,
    QueryFeature.WhereNotBetween,
    QueryFeature.WhereNull,
    QueryFeature.WhereNotNull,
    QueryFeature.Trashed,
    QueryFeature.WithHasOne,
    QueryFeature.WithHasMany,
  ],
  [QueryFeature.FieldsAll]: [QueryFeature.FieldsAll],
  [QueryFeature.Sorting]: [QueryFeature.Sorting],
  [QueryFeature.Limits]: [QueryFeature.Limits],
  [QueryFeature.WhereAll]: [
    QueryFeature.WhereEqual,
    QueryFeature.WhereNotEqual,
    QueryFeature.WhereGt,
    QueryFeature.WhereGte,
    QueryFeature.WhereLt,
    QueryFeature.WhereLte,
    QueryFeature.WhereLike,
    QueryFeature.WhereNotLike,
    QueryFeature.WhereIn,
    QueryFeature.WhereNotIn,
    QueryFeature.WhereBetween,
    QueryFeature.WhereNotBetween,
    QueryFeature.WhereNull,
    QueryFeature.WhereNotNull,
  ],
  [QueryFeature.WhereEqual]: [QueryFeature.WhereEqual],
  [QueryFeature.WhereNotEqual]: [QueryFeature.WhereNotEqual],
  [QueryFeature.WhereGt]: [QueryFeature.WhereGt],
  [QueryFeature.WhereGte]: [QueryFeature.WhereGte],
  [QueryFeature.WhereLt]: [QueryFeature.WhereLt],
  [QueryFeature.WhereLte]: [QueryFeature.WhereLte],
  [QueryFeature.WhereLike]: [QueryFeature.WhereLike],
  [QueryFeature.WhereNotLike]: [QueryFeature.WhereNotLike],
  [QueryFeature.WhereIn]: [QueryFeature.WhereIn],
  [QueryFeature.WhereNotIn]: [QueryFeature.WhereNotIn],
  [QueryFeature.WhereBetween]: [QueryFeature.WhereBetween],
  [QueryFeature.WhereNotBetween]: [QueryFeature.WhereNotBetween],
  [QueryFeature.WhereNull]: [QueryFeature.WhereNull],
  [QueryFeature.WhereNotNull]: [QueryFeature.WhereNotNull],
  [QueryFeature.Trashed]: [QueryFeature.Trashed],
  [QueryFeature.WithAll]: [QueryFeature.WithHasOne, QueryFeature.WithHasMany],
  [QueryFeature.WithHasOne]: [QueryFeature.WithHasOne],
  [QueryFeature.WithHasMany]: [QueryFeature.WithHasMany],
};

const generatePermission = (
  type: QueryFeatureType,
  feature: QueryFeature,
  keys: string[] | null[] = []
): IQueryLimitConfig[] => {
  const features = QueryFeatureMap[feature];

  if (keys.length === 0) {
    keys = [null];
  }

  return features
    .map((subFeature) => {
      return keys.map((key) => {
        return {
          type,
          feature: subFeature,
          key,
        };
      });
    })
    .flat();
};

export const allow = (
  feature: QueryFeature,
  keys: string[] = []
): IQueryLimitConfig[] => {
  return generatePermission(QueryFeatureType.Allow, feature, keys);
};

export const deny = (
  feature: QueryFeature,
  keys: string[] = []
): IQueryLimitConfig[] => {
  return generatePermission(QueryFeatureType.Deny, feature, keys);
};

export const valideteQueryFeature = (
  model: IModelService,
  feature: QueryFeature,
  key: string | null = null,
  errorDescription?: string
) => {
  const errorDetail = errorDescription ? ` (${errorDescription})` : "";

  const rules = model.queryLimits.filter(
    (limit) => limit.feature === feature && limit.key === null
  );

  if (key) {
    const keyRules = model.queryLimits.filter(
      (limit) => limit.feature === feature && limit.key === key
    );

    if (keyRules.length > 0) {
      const lastKeyRule = keyRules[keyRules.length - 1];
      if (lastKeyRule?.type === QueryFeatureType.Deny) {
        throw new ApiError(
          `Unsupported query feature${errorDetail}: ${feature.toString()} [${key}]`
        );
      }
      return;
    }
  }

  if (rules.length === 0) {
    throw new ApiError(
      `Unsupported query feature${errorDetail}: ${feature.toString()}`
    );
  }

  const lastRule = rules[rules.length - 1];
  if (lastRule?.type === QueryFeatureType.Deny) {
    throw new ApiError(
      `Unsupported query feature${errorDetail}: ${feature.toString()}`
    );
  }
};
