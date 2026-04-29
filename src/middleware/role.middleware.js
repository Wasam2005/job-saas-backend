import { logWarn } from "../utils/logger.util.js";

export const authorizeRoles = (...allowedRoles) =>{
return (req,res,next) =>{
    const user= req.user;
    if(!user || !user.role){

        logWarn("role_authorization_failed", {
        reason: "missing_user_or_role",
        message: "Role check failed due to missing authenticated user context",
      });
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    
    if(!allowedRoles.includes(user.role)){
        logWarn("role_access_denied", {
        userId: user.userId,
        role: user.role,
        allowedRoles,
        message: "User attempted unauthorized role-based access",
      });
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }
    next();
};
};