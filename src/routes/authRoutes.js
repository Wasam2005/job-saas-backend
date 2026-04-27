import express from "express";
import { registerUser,loginUser,refreshAccessToken } from "../controllers/authController.js";
import { validateRegisterInput, validateLoginInput } from "../middleware/validateRequestMiddleware.js";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login",validateLoginInput,loginUser);
router.post("/session/refresh", refreshAccessToken);
export default router;
