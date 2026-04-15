import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import { generateRefreshToken,hashToken } from "../utils/token.utils.js";
export const createUser= async({name,email,password}) => {
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error("USER_EXISTS");
    }
    const  hashedPassword  = await bcrypt.hash(password,10);
   
    const user = new User ({
        name,
        email,
        password:hashedPassword,
    })
   await user.save();
   return user;
};


export const authenticateUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });


  if (!existingUser) {
    throw new Error("INVALID_CREDENTIAL");
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIAL");
  }


  const accessToken = jwt.sign(
    {
      userId: existingUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const rawRefreshToken = generateRefreshToken();
  const hashedToken = hashToken(rawRefreshToken);
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
await RefreshToken.create({
  userId: existingUser._id,
  token: hashedToken,
  expiresAt: expiry,
});

return {
  accessToken,
  refreshToken: rawRefreshToken
}
  
};