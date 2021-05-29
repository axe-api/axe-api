import getModels from "./ModelResolver.js";
import getModelTree from "./TreeResolver.js";
import setRelations from "./RelationResolver.js";
import setHooks from "./HookResolver.js";
import setRoutes from "./RouteResolver.js";
import detectTableColumns from "./AutoColumnDetection.js";
import checkModelColumns from "./ColumnChecks.js";

export {
  getModels,
  getModelTree,
  setRelations,
  setHooks,
  setRoutes,
  detectTableColumns,
  checkModelColumns,
};
