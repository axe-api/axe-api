import { Request, Response } from 'express';
import { DocumentationService } from '../Services';

export default async (req: Request, res: Response) => {
  const docs = DocumentationService.getInstance();
  res.json(docs.get().map((route) => `${route.method} ${route.url}`));
};
