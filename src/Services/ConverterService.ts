import { promisify } from "util";
import { IncomingMessage, ServerResponse } from "http";
import AxeRequest from "./AxeRequest";
import AxeResponse from "./AxeResponse";
import {
  AxeRequestResponsePair,
  IContext,
  MiddlewareResolution,
} from "../Interfaces";
import {
  GeneralFunction,
  HandlerFunction,
  MiddlewareFunction,
  PhaseFunction,
  AxeFunction,
} from "src/Types";

export const toAxeRequestResponsePair = (
  request: IncomingMessage,
  response: ServerResponse,
): AxeRequestResponsePair => {
  const axeRequest = new AxeRequest(request);
  const axeResponse = new AxeResponse(response, axeRequest.currentLanguage);
  return {
    axeRequest,
    axeResponse,
  };
};

export const resolveMiddlewares = (
  args: GeneralFunction[],
): MiddlewareResolution => {
  const middlewares: MiddlewareFunction[] = args.slice(
    0,
    -1,
  ) as MiddlewareFunction[];

  // todo: might be -2??
  const handler: HandlerFunction = args[args.length - 1] as HandlerFunction;

  return {
    middlewares,
    handler,
  };
};

export const isMiddlewareFunction = (callback: any): boolean => {
  return callback.length === 3;
};

export const isHandlerFunction = (callback: any): boolean => {
  return callback.length === 2;
};

export const isPhaseFunction = (callback: any): boolean => {
  return callback.length === 1;
};

export const toPhaseFunction = (callback: AxeFunction): PhaseFunction => {
  if (isMiddlewareFunction(callback)) {
    return promisify((context: IContext, next: any) =>
      (callback as MiddlewareFunction)(
        context.req.original,
        context.res.original,
        next,
      ),
    );
  }

  if (isHandlerFunction(callback)) {
    return (context: IContext) =>
      (callback as HandlerFunction)(context.req, context.res);
  }

  return callback as PhaseFunction;
};
