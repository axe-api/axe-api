import { HandlerTypes, QueryFeature } from "../../../../../../src/Enums";
import { IHandlerBasedTransactionConfig } from "../../../../../../src/Interfaces";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class Author extends Model {
  get table(): string {
    return "my-authors";
  }

  get transaction(): IHandlerBasedTransactionConfig[] {
    return [
      {
        handler: HandlerTypes.INSERT,
        transaction: true,
      },
      {
        handler: [HandlerTypes.PAGINATE],
        transaction: true,
      },
      {
        handler: [HandlerTypes.DELETE],
        transaction: false,
      },
    ];
  }

  get validations(): Record<string, string> {
    return {
      name: "required",
    };
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }
}

export default Author;
