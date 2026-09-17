import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = process.env.SHEET_ID; // JANGAN DITAMPILKAN DI FRONTEND
const GID = process.env.GID; // JANGAN DITAMPILKAN
const API_KEY = process.env.GOOGLE_API_KEY;

app.get("/", (req,res)=> res.send("ESDM Backend - SHEETID HIDDEN"));

app.get("/api/gangguan", async (req,res)=>{
  try {
    if(!SHEET_ID || !API_KEY){
      // fallback ke dummy jika env belum diisi - untuk demo Vercel
      return res.json({source:"dummy-secure", note:"SHEET_ID disimpan di .env backend, tidak tampil di frontend", data:[]});
    }
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
    const r = await fetch(url);
    const j = await r.json();
    res.json({source:"google-sheets", sheet_id:"HIDDEN", gid:"HIDDEN", values:j.values?.slice(0,20) || []});
  } catch(e){
    res.status(500).json({error:e.message, sheet_id:"HIDDEN"});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Backend jalan di ${PORT} - SHEETID HIDDEN`));
