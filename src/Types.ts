import { NextFunction, Request, Response } from "express";
import { IRequestPack, IHookParameter } from "./Interfaces";
import AxeRequest from "./Services/AxeRequest";

export type SerializationFunction = (item: any, request: AxeRequest) => any;

export type HandlerFunction = (pack: IRequestPack) => void;

export type MiddlewareFunction = (
  req: AxeRequest,
  res: Response,
  next: NextFunction
) => void;

export type ModelValidation = Record<string, string>;

export type FieldList = string[];

export type HookFunction = (pack: IHookParameter) => Promise<void>;

export type PhaseFunction = (pack: IRequestPack) => Promise<void>;
