import { IncomingMessage, ServerResponse } from "http";
import { IHandlerBaseMiddleware, IRequestPack } from "./Interfaces";
import AxeRequest from "./Services/AxeRequest";
import AxeResponse from "./Services/AxeResponse";
import { HookFunctionTypes } from "./Enums";

export type ModelValidation = Record<string, string>;

export type FieldList = string[];

export type DefaultResponse = Promise<void> | void | undefined;

export type AdaptorTypes = "redis" | "memory";

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => DefaultResponse;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse
) => DefaultResponse;

export type PhaseFunction = (pack: IRequestPack) => DefaultResponse;

export type SerializationFunction = (item: any, request: AxeRequest) => any;

export type HookFunctions = Record<HookFunctionTypes, PhaseFunction>;

export type NextFunction = (error: any) => void;

export type DynamicFunctionType = (MiddlewareFunction | HandlerFunction)[];

export type StepTypes = MiddlewareFunction | HandlerFunction | PhaseFunction;

export type ModelMiddlewareDefinition = Array<
  StepTypes | IHandlerBaseMiddleware
>;
