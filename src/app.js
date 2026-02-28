import express, { response } from 'express'
const app=express();

export default app.get('/health', (req,res)=>{
   res.json({ status: "OK" });
})
