import { NextFunction, Request, Response } from "express";
import { IRequestPack, IHookParameter, IRequest } from "./Interfaces";

export type SerializationFunction = (item: any, request: IRequest) => any;

export type HandlerFunction = (pack: IRequestPack) => void;

export type MiddlewareFunction = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => void;

export type ModelValidation = Record<string, string>;

export type FieldList = string[];

export type HookFunction = (pack: IHookParameter) => Promise<void>;
