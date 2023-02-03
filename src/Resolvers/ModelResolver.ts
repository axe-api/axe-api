import { Knex } from "knex";
import { SchemaInspector } from "knex-schema-inspector/lib/types/schema-inspector";
import { Column } from "knex-schema-inspector/lib/types/column";
import { IFolders, IModelService, IColumn, IRelation } from "../Interfaces";
import FileResolver from "./FileResolver";
import Model from "../Model";
import { HookFunctionTypes, Extensions } from "../Enums";
import {
  ModelService,
  LogService,
  IoCService,
  ModelListService,
} from "../Services";
import { DEFAULT_METHODS_OF_MODELS } from "../constants";
import { SerializationFunction } from "../Types";

class ModelResolver {
  async resolve() {
    const logger = await IoCService.useByType<LogService>("LogService");
    const modelList = new ModelListService(await this.getModelList());
    await this.setModelRelations(modelList);
    await this.setDatabaseColumns(modelList);
    await this.setModelHooks(modelList, Extensions.Hooks);
    await this.setModelHooks(modelList, Extensions.Events);
    await this.setModelSerializations(modelList);
    IoCService.singleton("ModelListService", () => modelList);
    logger.info("All models have been resolved.");
  }

  private async setModelRelations(modelList: ModelListService) {
    for (const model of modelList.get()) {
      const relationMethods = this.getInstanceMethods(model);

      for (const relationMethod of relationMethods) {
        const relationFunction = (model.instance as any)[relationMethod];

        if (typeof relationFunction !== "function") {
          throw new Error(
            `Model relation definition should be a function: ${model.name}.${relationMethod}`
          );
        }

        const definition: IRelation = relationFunction.call(model.instance);
        definition.name = relationMethod;

        model.relations.push(definition);
      }
    }
  }

  private async getModelList(): Promise<IModelService[]> {
    const list: IModelService[] = [];
    const folders = (await IoCService.use("Folders")) as IFolders;
    const fileResolver = new FileResolver();
    const models = await fileResolver.resolve<Model>(folders.Models);

    for (const key in models) {
      list.push(new ModelService(key, models[key]));
    }

    return list;
  }

  private async setDatabaseColumns(modelList: ModelListService) {
    const database = (await IoCService.use("Database")) as Knex;
    const schemaInspector = (await IoCService.use("SchemaInspector")) as (
      knex: Knex
    ) => SchemaInspector;
    const inspector = schemaInspector(database);
    const columns: IColumn[] = [];
    for (const table of await inspector.tables()) {
      const dbColumns: Column[] = await inspector.columnInfo(table);
      columns.push(
        ...dbColumns.map((column) => {
          return {
            ...column,
            table_name: table,
          };
        })
      );
    }

    for (const model of modelList.get()) {
      const modelColumns = columns.filter(
        (column) => column.table_name === model.instance.table
      );

      if (modelColumns.length === 0) {
        throw new Error(
          `The "${model.instance.table}" table doesn't have any column. Are you sure about the table name?`
        );
      }

      model.setColumns(modelColumns);
    }
  }

  private async setModelHooks(
    modelList: ModelListService,
    hookType: Extensions
  ) {
    const folders = (await IoCService.use("Folders")) as IFolders;
    const fileResolver = new FileResolver();
    const folder =
      hookType === Extensions.Hooks ? folders.Hooks : folders.Events;
    const hooks = await fileResolver.resolveContent(folder);

    for (const model of modelList.get()) {
      const hookFileName = `${model.name}${hookType
        .toString()
        .replace("s", "")}`;

      if (hooks[hookFileName]) {
        const keys: string[] = Object.keys(hooks[hookFileName]);
        keys.forEach((key: string) => {
          const strEnum = key as unknown as HookFunctionTypes;
          const hookFunctionType: HookFunctionTypes =
            HookFunctionTypes[strEnum];
          model.setExtensions(
            hookType,
            hookFunctionType,
            hooks[hookFileName][key]
          );
        });
      }
    }
  }

  private async setModelSerializations(modelList: ModelListService) {
    const folders = (await IoCService.use("Folders")) as IFolders;
    const fileResolver = new FileResolver();
    const folder = folders.Serialization;
    const serializations = await fileResolver.resolveContent(folder);

    for (const model of modelList.get()) {
      const fileName = `${model.name}Serialization`;
      if (serializations[fileName]) {
        const file = serializations[fileName];
        model.setSerialization(file.default as any as SerializationFunction);
      }
    }
  }

  private getInstanceMethods(obj: IModelService) {
    const properties: string[] = Object.getOwnPropertyNames(
      obj.instance.constructor.prototype
    );
    return properties.filter(
      (name) => !DEFAULT_METHODS_OF_MODELS.includes(name)
    );
  }
}

export default ModelResolver;
