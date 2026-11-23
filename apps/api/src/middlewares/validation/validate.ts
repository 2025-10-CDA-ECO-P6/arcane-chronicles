import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type RequestSource = 'body' | 'query';

export const validate =
  (schema: ZodType, source: RequestSource = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      res.status(422).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    if (source === 'query') {
      Object.defineProperty(req, 'query', { value: result.data });
    } else {
      req.body = result.data;
    }
    next();
  };
