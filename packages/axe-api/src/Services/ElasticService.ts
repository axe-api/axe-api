import { Client, ClientOptions } from "@elastic/elasticsearch";
import LogService from "./LogService";
import { ISearchConfigutation } from "src/Interfaces";

class ElasticService {
  private config: ISearchConfigutation;
  private client: Client;

  constructor(config: ISearchConfigutation, options: ClientOptions) {
    this.config = config;
    this.client = new Client(options);
    LogService.debug("Elasticsearch connection has been completed.");
  }

  async createIndex(modelName: string) {
    const index = this.toIndex(modelName);
    const result = await this.client.indices.exists({ index });
    if (result === false) {
      await this.client.indices.create({ index });
      LogService.debug(`ES.create({ index: ${index} })`);
    }
  }

  async insert(modelName: string, id: string, body: any) {
    const index = this.toIndex(modelName);
    const result = await this.client.index({ index, id: id.toString(), body });
    LogService.debug(`\t🔄 ES.insert(${index}) => ${id}`);
    return result;
  }

  async update(modelName: string, id: string, doc: any) {
    const index = this.toIndex(modelName);
    const result = await this.client.update({ index, id: id.toString(), doc });
    LogService.debug(`\t🔄 ES.update(${index}) => ${id}`);
    return result;
  }

  async delete(modelName: string, id: string) {
    const index = this.toIndex(modelName);
    const result = await this.client.delete({ index, id: id.toString() });
    LogService.debug(`\t🔄 ES.delete(${index}) => ${id}`);
    return result;
  }

  async search(modelName: string, page: number, size: number, body: any) {
    const index = this.toIndex(modelName);

    LogService.debug(`\t🔄 ES.search(${index}) => ${JSON.stringify(body)}`);
    return await this.client.search({
      index,
      body,
      from: (page - 1) * size,
      size,
    });
  }

  private toIndex(modelName: string): string {
    const prefix = this.config.indexPrefix ? `${this.config.indexPrefix}-` : "";
    return `${prefix}${modelName.toLowerCase()}`.trim();
  }
}

export default ElasticService;
