import { isNonEmptyString, isValidEmail, isValidPassword ,isValidCompanyDomain} from "../utils/validators.util.js";
import { logWarn } from "../utils/logger.util.js";
import { sanitizeString } from "../utils/sanitizers.util.js";

export const validateRegisterInput = (req,res,next) =>{
let{name,email,password,organizationName,companyDomain} = req.body;
name = sanitizeString(name);
organizationName=  sanitizeString(organizationName);
email=email?.trim().toLowerCase();
companyDomain=companyDomain?.trim().toLowerCase();

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

if(!isNonEmptyString(companyDomain)){
    logWarn("register_validation_failed", {
    reason: "invalid_domain",
    message: "Invalid or missing domain in registration request",
  });

return res.status(400).json({
    success: false,
    message: "Valid company domain is required",
})
}



if(!isNonEmptyString(organizationName)){
    logWarn("register_validation_failed", {
    reason: "invalid_organization_name",
    message: "Invalid or missing organization name in registration request",
  });

return res.status(400).json({
    success: false,
    message: "Valid organization name is required",
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


if(!isValidCompanyDomain(companyDomain)){
     logWarn("register_validation_failed", {
      reason: "invalid_domain",
      message: "Invalid company domain in registration request",
    });

    return res.status(400).json({
      success: false,
      message: "Invalid company domain ",
    });
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
  req.body.organizationName = organizationName;

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