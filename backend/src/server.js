import express from "express"; import cors from "cors"; import dotenv from "dotenv"; import jwt from "jsonwebtoken"; import bcrypt from "bcryptjs";
dotenv.config();
const app=express();
app.use(cors({origin:true, allowedHeaders:["Content-Type","Authorization","ngrok-skip-browser-warning"]}));
app.use(express.json());

const SHEET_ID=process.env.SHEET_ID || "1roBOQObjwmY1PsNBn8PEUQ4Z7nDNKm3DHQ7MP9lmkH4";

app.get("/",(req,res)=>res.send(`OK ESDM PUSDATIN - Tab awal Dashboard - Node >3 Hari DIHAPUS - Gangguan SEMUA - Laphar Pimpinan - SHEET_ID:${SHEET_ID}`));

app.get("/api/contacts", async (req,res)=>{
  try{
    const csvUrl=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${process.env.EN_LOCAL_GID||0}`;
    const r=await fetch(csvUrl);
    const csv=await r.text();
    res.json({source:"GOOGLE_SHEET_ASLI_100PCT_BUKAN_EXCEL_BUKAN_HARDCODE",SHEET_ID,rows:csv.split("\n").length,csv:csv.slice(0,50000)});
  }catch(e){ res.json({error:e.message}); }
});

app.post("/api/login",(req,res)=>{
  const {username,password}=req.body;
  if(username==="admin" && password==="admin123"){
    const token=jwt.sign({id:1,username:"admin",role:"admin",nama:"Administrator"},process.env.JWT_SECRET||"secret",{expiresIn:"8h"});
    return res.json({token,user:{username:"admin",nama:"Administrator",role:"admin"}});
  }
  res.status(401).json({error:"Login gagal - pakai admin/admin123"});
});

app.listen(4000,'0.0.0.0',()=>console.log("Backend ESDM FINAL - Tab awal Dashboard - Node >3 Hari DIHAPUS - Gangguan SEMUA - Laphar Pimpinan - jalan di 4000 - 1 token ngrok FE+BE bisa"));
