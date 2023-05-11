import { ILanguage } from '../Interfaces';

export {};

declare global {
  namespace Express {
    export interface Request {
      currentLanguage: ILanguage;
    }
  }
}
