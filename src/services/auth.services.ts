import { error } from "node:console";
import { User } from "../models/user.model.js";
import { generateAccessToken, refreshAccessToken } from "../utils/jwt.js";
import { email } from "zod";
import { compare } from "bcrypt";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exist");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = refreshAccessToken(user._id.toString());

  return {
    user,
    accessToken,
    refreshAccessToken,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credantials");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credantials");
  }
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = refreshAccessToken(user._id.toString());
  return {
    user,
    accessToken,
    refreshToken,
  };
};
