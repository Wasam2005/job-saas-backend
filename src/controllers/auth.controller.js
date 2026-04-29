import { createOrganizationWithOwner,authenticateUser,refreshTokenService} from "../services/auth.service.js";
import { logWarn, logError, logInfo } from "../utils/logger.util.js";

//User registeration controller
export const registerUser = async (req,res) =>
{
let {name , email , password,organizationName,companyDomain } = req.body ;
try{
await createOrganizationWithOwner({name , email , password,organizationName ,companyDomain});
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
    return res.status(409).json({
      success: false,
      message: "User already exists"});
}

if (error.message === "ORGANIZATION_ALREADY_EXISTS") {
  return res.status(409).json({
    success: false,
    message: "Organization already exists",
  });
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
  try {
    const {accessToken,refreshToken}= await authenticateUser({ email, password });

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