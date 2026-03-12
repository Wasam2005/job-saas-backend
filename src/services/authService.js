import bcrypt from "bcrypt";
import User from "../models/User.js";

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
}
