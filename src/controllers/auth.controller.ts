import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.services.js";
import { registerValidator, loginValidator } from "../validators/validators.user.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.utils.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerValidator.safeParse(req.body);

    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.message);
    }

    const { name, email, password } = parsed.data;

    const { user, accessToken, refreshAccessToken } =
      await registerUser(name, email, password);

    res.cookie("refreshToken", refreshAccessToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User created",
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginValidator.safeParse(req.body);

    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.message);
    }

    const { email, password } = parsed.data;

    const { user, accessToken, refreshToken } =
      await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};