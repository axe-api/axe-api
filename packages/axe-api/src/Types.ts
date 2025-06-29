import { IncomingMessage, ServerResponse } from "http";
import { IHandlerBaseMiddleware, IContext } from "./Interfaces";
import AxeRequest from "./Services/AxeRequest";
import AxeResponse from "./Services/AxeResponse";
import { HookFunctionTypes } from "./Enums";
import { Knex } from "knex";
import { SchemaInspector } from "knex-schema-inspector/lib/types/schema-inspector";

export type ModelValidation = Record<string, string>;

export type ModelHooks = Record<HookFunctionTypes, PhaseFunction>;

export type ModelMiddleware = Array<AxeFunction | IHandlerBaseMiddleware>;

export type AdaptorType = "redis" | "memory";

export type FormValidatorLibrary = "validatorjs" | "robust-validator";

export type DefaultResponse = Promise<void> | void | undefined;

export type NextFunction = (error?: any) => void;

export type SchemaInspectorFunction = (database: Knex) => SchemaInspector;

export type SerializationFunction = (item: any, request: AxeRequest) => any;

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => DefaultResponse;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse,
) => DefaultResponse;

export type PhaseFunction = (context: IContext) => DefaultResponse;

export type GeneralFunction = MiddlewareFunction | HandlerFunction;

export type AxeFunction = GeneralFunction | PhaseFunction;

export type Hint = "router" | "resource";
