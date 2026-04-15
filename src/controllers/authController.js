import { createUser,authenticateUser } from "../services/authService.js";

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
   
    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken
      },
      message: "User logged in successfully",
    });
  } catch (error) {
     console.log(error);
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