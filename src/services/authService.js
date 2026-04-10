import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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

  const token = jwt.sign(
    {
      userId: existingUser._id,
      role: existingUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return token;
};