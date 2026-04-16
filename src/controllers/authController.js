import { createUser,authenticateUser,refreshTokenService} from "../services/authService.js";

//User registeration controller

export const registerUser = async (req,res) =>
{

let {name , email , password} = req.body ;
name = name?.trim();
email = email?.trim().toLowerCase();
password = password?.trim();
if(!name || !email || !password){
   return res.status(400).json({
     success: false,
     message: "All fields are required"})
}
if (password.length < 8 || password.length > 128) {
  return res.status(400).json({
    success: false,
    message: "Password must be between 8 and 128 characters"
  });}

try{
await createUser({name , email , password});
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
return res.status(500).json({
  success: false,
  message: "Server error"});
}
};

// User Login controller

export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();
password = password?.trim();
  if (!email || !password) {
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

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        ...(isDev && { refreshToken }), 
      },
      message: "User logged in successfully",
    });
  } catch (error) {
   
    if (error.message === "INVALID_CREDENTIAL") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

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
    console.log("Cookies:", req.cookies);
    if (!refreshToken) {
      console.log("no token");
      return res.status(401).json({
        success: false,
        message: "No refresh token",
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
});

  } catch (error) {
   

    if (error.message === "Unauthorized") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (error.message === "EXPIRED") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};