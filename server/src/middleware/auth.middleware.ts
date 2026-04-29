import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken as string | undefined;
  const token = authHeader?.split(" ")[1] ?? cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    req.user = decoded as Express.AuthUser;

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
