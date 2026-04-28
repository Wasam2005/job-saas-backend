import express from "express";
import { registerUser,loginUser,refreshAccessToken } from "../controllers/authController.js";
import { validateRegisterInput, validateLoginInput } from "../middleware/validateRequestMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login",validateLoginInput,loginUser);
router.post("/session/refresh", refreshAccessToken);
router.get(
  "/admin-test",
  authMiddleware,
  authorizeRoles("owner", "admin"),
  (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Access granted",
  });
}
)
export default router;
