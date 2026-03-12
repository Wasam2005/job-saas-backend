import { createUser } from "../services/authService.js";

export const registerUser = async (req,res) =>
{
let {name , email , password} = req.body ;
name = name?.trim();
email = email?.trim().toLowerCase();
password = password?.trim();
if(!name || !email || !password){

   return res.status(400).json({ message: "All fields are required"})
}
if (password.length < 8 || password.length > 128) {
  return res.status(400).json({
    message: "Password must be between 8 and 128 characters"
  });}

try{
await createUser({name , email , password});
return res.status(201).json({message: "User registered successfully"})
}
catch(error){
if(error.message==="USER_EXISTS"){
    return res.status(409).json({message: "User already exists"});
     
}
return res.status(500).json({message: "Server error"});
}
};
