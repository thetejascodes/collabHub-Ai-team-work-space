import { IUserDocument } from "../models/user.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export {};