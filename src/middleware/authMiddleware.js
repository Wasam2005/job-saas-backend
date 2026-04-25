import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logWarn, logError, logInfo } from "../utils/logger.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Header must exist
    if (!authHeader) {
      logWarn("auth_header_missing", {
  reason: "authorization_header_missing",
});
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Strict format check: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      logWarn("invalid_auth_header", {
  reason: "invalid_bearer_format",
});
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = parts[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Validate payload
    if (!decoded.userId) {
    logWarn("jwt_verification_failed", {
    reason: "missing_userId_in_payload",
  });
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 5. Fetch user (source of truth)
    //Add org_id later
    const user = await User.findById(decoded.userId)
      .select("_id role");

    // 6. Validate user
    if (!user ) {
      logWarn("unauthorized_access_attempt", {
  reason: "user_not_found",
});
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 7. Attach trusted user data
     //Add org_id later
    req.user = {
      userId: user._id,
      role: user.role,
    };

    // 8. Continue request
    next();

  }
 catch (error) {
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    logWarn("jwt_verification_failed", {
      reason: error.message,
    });

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  logError("auth_middleware_server_error", {
    errorName: error.name,
    reason: error.message,
  });

  return res.status(500).json({
    success: false,
    message: "Server error",
  });
}
};