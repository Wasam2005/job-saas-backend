import { isNonEmptyString, isValidEmail, isValidPassword } from "../utils/validators.utils.js";
import { logWarn } from "../utils/logger.utils.js";
import { sanitizeString } from "../utils/sanitizers.utils.js";

export const validateRegisterInput = (req,res,next) =>{
let{name,email,password} = req.body;
name = sanitizeString(name);
email=email?.trim().toLowerCase();

if(!isNonEmptyString(name)){
    logWarn("register_validation_failed", {
    reason: "invalid_name",
    message: "Invalid or missing name in registration request",
  });

return res.status(400).json({
    success: false,
    message: "Valid name is required",
})
}

if(!isNonEmptyString(email)){
    logWarn("register_validation_failed",{
    reason: "invalid_email",
    message: "Invalid email format in registration request",
    })

    return res.status(400).json({
        success:false,
        message: "Valid email is required",
    })
}
if(!isValidPassword(password)){
     logWarn("register_validation_failed", {
      reason: "invalid_password",
      message: "Invalid password in registration request",
    });

    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 128 characters",
    });
}
 req.body.name = name;
  req.body.email = email;

  next();
}

export const validateLoginInput = (req, res, next) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();

  if (!isValidEmail(email)) {
    logWarn("login_validation_failed", {
      reason: "invalid_email",
      message: "Invalid email format in login request",
    });

    return res.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }

  if (!isValidPassword(password)) {
    logWarn("login_validation_failed", {
      reason: "invalid_password",
      message: "Invalid password in login request",
    });

    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 128 characters",
    });
  }

  req.body.email = email;

  next();
};