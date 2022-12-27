import { Language } from "accept-language-parser";

export {};

declare global {
  namespace Express {
    export interface Request {
      language: string;
      acceptedLanguages: Language[];
    }
  }
}
