import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type RequestSegment = "body" | "query" | "params";

/**
 * Parses `req[segment]` against `schema` and stores the result on
 * `res.locals[segment]` rather than reassigning `req[segment]` — Express 5
 * makes `req.query` a getter with no setter, so mutating it in place throws.
 * Controllers read the validated value from res.locals instead of req.
 */
export const validate = (schema: ZodType, segment: RequestSegment = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals[segment] = schema.parse(req[segment]);
    next();
  };
};
