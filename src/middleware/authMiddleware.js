import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Header must exist
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Strict format check: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
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
         console.log(user);
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

  } catch (error) {
        console.log(error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};