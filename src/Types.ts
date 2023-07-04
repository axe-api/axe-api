import { NextFunction, Request, Response } from "express";
import { IRequestPack, IHookParameter } from "./Interfaces";

export type SerializationFunction = (item: any, request: Request) => any;

export type HandlerFunction = (pack: IRequestPack) => void;

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type ModelValidation = Record<string, string>;

export type FieldList = string[];

export type HookFunction = (pack: IHookParameter) => Promise<void>;
