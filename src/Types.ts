import { IRequestPack } from "./Interfaces";
import AxeRequest from "./Services/AxeRequest";
import AxeResponse from "./Services/AxeResponse";

export type SerializationFunction = (item: any, request: AxeRequest) => any;

export type ModelValidation = Record<string, string>;

export type FieldList = string[];

export type PhaseFunction = (pack: IRequestPack) => void | Promise<void>;

export type NextFunction = () => void;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse
) => Promise<void> | void;
