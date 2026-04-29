import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import RefreshToken from "../models/refresh-token.model.js";
import {hashToken } from "../utils/token.util.js";
import { issueTokens } from "../utils/token.util.js";
import { logWarn, logError, logInfo } from "../utils/logger.util.js";

export const createOrganizationWithOwner= async({name,email,password,organizationName,companyDomain }) => {
    const existingUser = await User.findOne({email});
    if(existingUser){
       logWarn("register_failed", {
    email,
    reason: "user_already_exists",
    message: "Registration failed due to duplicate user",
  });
        throw new Error("USER_EXISTS");
    }

const existingOrganization = await Organization.findOne({companyDomain});

if (existingOrganization) {
       logWarn("register_failed", {
    email,
     reason: "organization_already_exists",
    message: "Registration failed because organization already exists",
  });
        throw new Error("ORGANIZATION_ALREADY_EXISTS");
    }


    const  hashedPassword  = await bcrypt.hash(password,10);

const organization = await Organization.create({
    name: organizationName,
    ownerId: null,
    status: "active",
    companyDomain:companyDomain,
  });
   
 const user = await User.create({
  name,
  email,
  password: hashedPassword,
   role: "owner",
   organizationId: organization._id,

});
organization.ownerId = user._id;
  await organization.save();

   return user;
};

 

export const authenticateUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
 if (!existingUser) {
  logWarn("login_auth_failed", {
  email,
  reason: "USER_NOT_FOUND",
});
  throw new Error("USER_NOT_FOUND");
}


  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    logWarn("login_auth_failed", {
  email,
  reason: "PASSWORD_MISMATCH",
});
  throw new Error("PASSWORD_MISMATCH");
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
      logWarn("refresh_token_reuse_detected", {
    reason: "token_not_found",
    message: "Refresh token reuse or invalid token detected",
  });

    throw new Error("UNAUTHORIZED");
  }
  const user = await User.findById(existingToken.userId);

if (!user){
   logWarn("refresh_user_not_found", {
    userId: existingToken.userId,
    reason: "user_deleted_or_missing",
  });

  throw new Error("UNAUTHORIZED");
} 

  if (existingToken.expiresAt < new Date()) {
     logWarn("refresh_token_expired", {
    userId: existingToken.userId,
    reason: "refresh_token_expired",
  });

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
logInfo("refresh_token_rotated", {
  userId: user._id,
  message: "Refresh token rotated successfully",
});
  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
};