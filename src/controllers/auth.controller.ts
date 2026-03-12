import type { Request,Response } from "express"
import { registerUser,loginUser } from "../services/auth.services.js"
import { registerValidator, loginValidator } from "../validators/validators.user.js"
import { User } from "../models/user.model.js"

export const register = async (req: Request, res: Response) => {

  const parsed = registerValidator.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  const { name, email, password } = parsed.data

  const { user, accessToken, refreshAccessToken } = await registerUser(name, email, password)

  res.cookie("refreshToken", refreshAccessToken, {
    httpOnly: true,
    sameSite: "strict"
  })

  res.status(201).json({
    message: "User created",
    accessToken,
    user
  })
}

export const login = async(req:Request,res:Response)=>{

  const parsed = loginValidator.safeParse(req.body)

  if(!parsed.success){
    return res.status(400).json(parsed.error)
  }

  const {email,password} = parsed.data

  const {user,accessToken,refreshToken} = await loginUser(email,password)

  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    sameSite:"strict"
  })

  res.json({
    accessToken,
    user
  })

}
export const getMyProfile = async (req:Request,res:Response) => {
   const userId = (req as any).user.userId;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);

}