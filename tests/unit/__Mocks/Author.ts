import { HandlerTypes } from "../../../src/Enums";
import { IHandlerBasedTransactionConfig } from "../../../src/Interfaces";
import Model from "../../../src/Model";

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
}

export default Author;
