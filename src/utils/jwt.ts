import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId:string,role:string)=>{
    return jwt.sign(
        {userId,role},
        process.env.JWT_ACCESS_SECRET as string,
        {expiresIn:"15m"},
    );
};

export const refreshAccessToken = (userId : string)=>{
    return jwt.sign(
        {userId},
        process.env.JWT_REFRESH_SECRET as string,
        {expiresIn:"7d"},
    );
};