import bcrypt from "bcrypt";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {hashToken } from "../utils/token.utils.js";
import { issueTokens } from "../utils/token.utils.js";

export const createUser= async({name,email,password}) => {
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error("USER_EXISTS");
    }
    const  hashedPassword  = await bcrypt.hash(password,10);
   
    const user = new User ({
        name,
        email,
        password:hashedPassword,
    })
   await user.save();
   return user;
};


export const authenticateUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });


  if (!existingUser) {
    throw new Error("INVALID_CREDENTIAL");
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIAL");
  }



const {accessToken,rawRefreshToken,hashedToken,expiresAt} = issueTokens(existingUser._id);

await RefreshToken.create({
  userId: existingUser._id,
  token: hashedToken,
  expiresAt,
});
return {
  accessToken,
  refreshToken: rawRefreshToken
}
  
};


export const refreshTokenService = async (refreshToken) => {
  const hashedIncomingToken = hashToken(refreshToken);

  const existingToken = await RefreshToken.findOne({
    token: hashedIncomingToken,
  });

  if (!existingToken) {
    
    throw new Error("Unauthorized");
  }
  const user = await User.findById(existingToken.userId);

if (!user) throw new Error("UNAUTHORIZED");

  if (existingToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: existingToken._id });
    throw new Error("EXPIRED");
  }

  // Refresh Token Rotation (Later implement transaction to avoid race condition)
  await RefreshToken.deleteOne({ _id: existingToken._id });

  const {accessToken,rawRefreshToken,hashedToken,expiresAt} =issueTokens(user._id);

  await RefreshToken.create({
    userId:user._id,
    token: hashedToken,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
};