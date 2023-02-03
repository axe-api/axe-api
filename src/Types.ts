import { Request } from "express";

export type SerializationFunction = (item: any, request: Request) => any;
