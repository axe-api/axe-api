import { IoCService } from "../Services";
import { IVersion } from "../Interfaces";
import ElasticService from "../Services/ElasticService";

class IndexBuilder {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async build() {
    // Filtering the models that need Elastic Search index
    const models = this.version.modelList
      .get()
      .filter((model) => model.instance.search);

    // No need to create any index
    if (models.length === 0) {
      return;
    }

    const elastic = await IoCService.use<ElasticService>("Elastic");

    // Creating index for each model
    for (const model of models) {
      elastic.createIndex(model.name);
    }
  }
}

export default IndexBuilder;
