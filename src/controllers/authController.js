import { createUser,authenticateUser,refreshTokenService} from "../services/authService.js";
import { logWarn, logError, logInfo } from "../utils/logger.js";
//User registeration controller

export const registerUser = async (req,res) =>
{

let {name , email , password} = req.body ;
name = name?.trim();
email = email?.trim().toLowerCase();

if (
  !name ||
  !email ||
  !password ||
  typeof password !== "string"
) {
  logWarn("register_validation_failed", {
    reason: "missing_or_invalid_required_fields",
    message: "Registration request contains invalid required fields",
  });

  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}


if (password.length < 8 || password.length > 128) {
  logWarn("register_validation_failed", {
    reason: "invalid_password_length",
    message: "Password length validation failed",
  });

  return res.status(400).json({
    success: false,
    message: "Password must be between 8 and 128 characters",
  });
}

try{
await createUser({name , email , password});

logInfo("register_success", {
  email,
  message: "User registered successfully",
});
return res.status(201).json({
  success: true,
  message: "User registered successfully"})
}
catch(error){
   
if(error.message==="USER_EXISTS"){
    logWarn("register_failed", {
    email,
    reason: "user_already_exists",
    message: "Registration failed due to duplicate user",
  });
    return res.status(409).json({
      success: false,
      message: "User already exists"});
     
}

logError("register_server_error", {
  email,
  reason: error.message,
  message: "Unexpected server error during registration",
});
return res.status(500).json({
  success: false,
  message: "Server error"});
}
};

// User Login controller

export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();
 
  if (!email || !password || typeof password !== "string") {
      logWarn("login_validation_failed", {
     reason: "missing_or_invalid_required_fields",
    message: "Login request contains invalid required fields",
  });

    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const {accessToken,refreshToken}= await authenticateUser({ email, password });

        const isDev = process.env.NODE_ENV !== "production";
if (process.env.NODE_ENV === "production" && refreshToken) {
  console.warn("Refresh token should NOT be in response in production");
}
   res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

logInfo("login_success", {
  email,
  message: "User logged in successfully",
});
    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        ...(isDev && { refreshToken }), 
      },
      message: "User logged in successfully",
    });
  } catch (error) {

    if (error.message === "USER_NOT_FOUND" || error.message === "PASSWORD_MISMATCH" ) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    logError("login_server_error", {
  email,
  reason: error.message,
  message: "Unexpected server error during login",
});

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Handles refresh token request
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
   
    if (!refreshToken) {
    logWarn("refresh_token_missing", {
  message: "Refresh token cookie missing",
});
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

    const result = await refreshTokenService(refreshToken);

   
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

  

  return res.status(200).json({
  success: true,
  data: {
    accessToken: result.accessToken,
  },
  message: "Token refreshed successfully",
});

  } catch (error) {
   

 if(error.message === "UNAUTHORIZED" || error.message === "EXPIRED") {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

 logError("refresh_token_server_error", {
      reason: error.message,
      message: "Unexpected server error during refresh token flow",
    });

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};