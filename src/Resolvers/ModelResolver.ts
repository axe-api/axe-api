import { Knex } from "knex";
import path from "path";
import fs from "fs";
import { readdir } from "fs/promises";
import { SchemaInspector } from "knex-schema-inspector/lib/types/schema-inspector";
import { Column } from "knex-schema-inspector/lib/types/column";
import { IModelService, IColumn, IRelation, IVersion } from "../Interfaces";
import FileResolver from "./FileResolver";
import Model from "../Model";
import { HookFunctionTypes, Extensions, AxeErrorCode } from "../Enums";
import {
  ModelService,
  LogService,
  IoCService,
  ModelListService,
} from "../Services";
import { DEFAULT_METHODS_OF_MODELS } from "../constants";
import { SerializationFunction } from "../Types";
import AxeError from "../Exceptions/AxeError";

class ModelResolver {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async resolve() {
    const logger = LogService.getInstance();

    const modelList = new ModelListService(await this.getModelList());
    await this.setModelRelations(modelList);
    await this.setDatabaseColumns(modelList);
    await this.setModelHooks(modelList, Extensions.Hooks);
    await this.setModelHooks(modelList, Extensions.Events);
    await this.setModelSerializations(modelList);
    await this.setModelQueryLimits(modelList);

    this.version.modelList = modelList;

    logger.info(`[${this.version.name}] All models have been resolved.`);
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
    const fileResolver = new FileResolver();
    const models = await fileResolver.resolve<Model>(
      this.version.folders.models
    );

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
        throw new AxeError(
          AxeErrorCode.TABLE_DOESNT_HAVE_ANY_COLUMN,
          `The "${model.instance.table}" table doesn't have any column.`
        );
      }

      model.setColumns(modelColumns);
    }
  }

  private async setModelHooks(
    modelList: ModelListService,
    hookType: Extensions
  ) {
    // What kind of hooks that we can have
    const hookList = Object.keys(HookFunctionTypes);
    const fileResolver = new FileResolver();
    // Basic hook/event folder path
    const folder =
      hookType === Extensions.Hooks
        ? this.version.folders.hooks
        : this.version.folders.events;

    // We should check the old-style hooks files
    await this.checkOldStyleHookFiles(folder);

    // Get model-based subfolders
    const hookSubfolders = await this.getDirectories(folder);

    // For each subfolder, we can have many different hook file
    for (const hookSubfolder of hookSubfolders) {
      // Full path of the subfolder
      const subfolderPath = path.join(folder, hookSubfolder);

      // Determining which model we are working on by subfolder
      const currentModel = modelList.find(hookSubfolder);
      // If we can't find a model, it means that the developer are using wrong name
      if (!currentModel) {
        throw new AxeError(
          AxeErrorCode.UNDEFINED_HOOK_MODEL_RELATION,
          `Undefined model relation: ${subfolderPath}`
        );
      }

      // Loading all hooks files in the subfolder
      const hooks = await fileResolver.resolveContent(subfolderPath);
      for (const hookName of hookList) {
        // If we have an acceptable hook
        if (hooks[hookName]) {
          // We bind the hook with the model
          currentModel.setExtensions(
            hookType,
            hookName as HookFunctionTypes,
            hooks[hookName].default
          );
        }
      }
    }
  }

  private async getDirectories(source: string) {
    if (!fs.existsSync(source)) {
      return [];
    }
    return (await readdir(source, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  private async checkOldStyleHookFiles(source: string) {
    if (!fs.existsSync(source)) {
      return;
    }

    // We are fetching the root-level file list
    const files = (await readdir(source, { withFileTypes: true }))
      .filter((dirent) => !dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((filename) => filename !== ".gitignore");

    // If there is any hook or event file in the root level
    const hasHookorEvent = files.some(
      (file) => file.includes("Hook.ts") || file.includes("Event.ts")
    );

    // Throwing an exception
    if (hasHookorEvent) {
      throw new AxeError(
        AxeErrorCode.UNACCEPTABLE_HOOK_FILE,
        `All hook or event files should be located under a model folder: ${source}`
      );
    }
  }

  private async setModelSerializations(modelList: ModelListService) {
    const fileResolver = new FileResolver();
    const serializations = await fileResolver.resolveContent(
      this.version.folders.serialization
    );

    for (const model of modelList.get()) {
      const fileName = `${model.name}Serialization`;
      if (serializations[fileName]) {
        const file = serializations[fileName];
        model.setSerialization(file.default as any as SerializationFunction);
      }
    }
  }

  private async setModelQueryLimits(modelList: ModelListService) {
    for (const model of modelList.get()) {
      // We should use the full field name like `users.name`
      const modelLimits = model.instance.limits.flat().map((item) => {
        if (item.key) {
          item.key = `${model.instance.table}.${item.key}`;
        }
        return { ...item };
      });

      model.setQueryLimits([
        ...this.version.config.query.limits.flat(),
        ...modelLimits,
      ]);
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
