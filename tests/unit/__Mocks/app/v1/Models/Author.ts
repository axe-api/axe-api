import { HandlerTypes, QueryFeature } from "../../../../../../src/Enums";
import { IHandlerBasedTransactionConfig } from "../../../../../../src/Interfaces";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class Author extends Model {
  get table(): string {
    return "my-authors";
  }

  get transaction() {
    return [
      {
        handlers: [HandlerTypes.INSERT],
        transaction: true,
      },
      {
        handlers: [HandlerTypes.PAGINATE],
        transaction: true,
      },
      {
        handlers: [HandlerTypes.DELETE],
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
