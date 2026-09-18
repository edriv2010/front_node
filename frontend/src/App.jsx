import { useState, useMemo, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "https://backend-node-livid.vercel.app";

// AMBIL DARI SISTEM - REAL TIME
const TODAY_OBJ = new Date();
const TODAY = TODAY_OBJ.toISOString().split('T')[0]; // YYYY-MM-DD sistem

function formatIndo(tglStr) {
  if(!tglStr) return "-";
  const d = new Date(tglStr);
  if(isNaN(d)) return tglStr;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
function parseDate(s){
  const d = new Date(s);
  return isNaN(d)? new Date() : d;
}
function diffDays(a,b){ return Math.round((b-a)/(1000*60*60*24)); }

export default function App() {
  const [SHEET_DATA, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [waktu, setWaktu] = useState("Semua"); // FINAL: Semua biar data gak hilang
  const [link, setLink] = useState("Semua");
  const [kendala, setKendala] = useState("Semua");
  const [tab, setTab] = useState("nodeSering");
  const [selectedDate, setSelectedDate] = useState(TODAY); // auto hari ini

  useEffect(() => {
    fetch(`${API_URL}/api/sheet`)
    .then(async r => {
        if(!r.ok) throw new Error("Backend error " + r.status);
        const json = await r.json();
        const arr = Array.isArray(json)? json : json.data || [];
        setSheetData(arr);
      })
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return SHEET_DATA.filter(d => {
      const tgl = parseDate(d.tanggal);
      const now = parseDate(TODAY);
      let okWaktu = true;
      if (waktu === "Hari Ini") okWaktu = diffDays(tgl, now) === 0;
      if (waktu === "Minggu Ini") okWaktu = diffDays(tgl, now) <= 7;
      if (waktu === "Bulan Ini") okWaktu = tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear();
      // kalau Semua, okWaktu = true terus

      const okLink = link === "Semua" || (d.link || "").toUpperCase() === link.toUpperCase();
      const okKendala = kendala === "Semua" || (d.kendala || "").toUpperCase().includes(kendala.toUpperCase());
      return okWaktu && okLink && okKendala;
    });
  }, [SHEET_DATA, waktu, link, kendala]);

  const { nodeSering, nodeBerturut } = useMemo(() => {
    const count = {};
    filtered.forEach(d => { count[d.pos] = (count[d.pos] || 0) + 1; });
    const sering = Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,10)
    .map(([pos,jml])=>({pos,jml}));

    const byPos = {};
    filtered.forEach(d => {
      if(!byPos[d.pos]) byPos[d.pos]=[];
      byPos[d.pos].push(d);
    });
    const berturut = [];
    Object.entries(byPos).forEach(([pos, list])=>{
      const sorted = list.sort((a,b)=> parseDate(a.tanggal) - parseDate(b.tanggal));
      let streak = 1;
      for(let i=1;i<sorted.length;i++){
        if(diffDays(parseDate(sorted[i-1].tanggal), parseDate(sorted[i].tanggal))===1){
          streak++;
        } else {
          if(streak>3) berturut.push({pos, durasi:streak, dari:formatIndo(sorted[i-streak].tanggal), sampai:formatIndo(sorted[i-1].tanggal)});
          streak=1;
        }
      }
      if(streak>3) berturut.push({pos, durasi:streak, dari:formatIndo(sorted[sorted.length-streak].tanggal), sampai:formatIndo(sorted[sorted.length-1].tanggal)});
    });
    return { nodeSering: sering, nodeBerturut: berturut };
  }, [filtered]);

  if(loading) return <div style={{minHeight:"100vh",background:"#0f172a",color:"#fff",display:"grid",placeItems:"center"}}>Loading data ASLI dari Google Sheet via {API_URL}...<br/>Tanggal sistem hari ini: {formatIndo(TODAY)}</div>;
  if(error) return <div style={{padding:20,color:"red"}}>Gagal konek backend: {error} - cek {API_URL}/api/sheet</div>;

  return (
    <div style={{background:"#f1f5f9", minHeight:"100vh", padding:20, fontFamily:"Inter"}}>
      <h1 style={{fontWeight:800}}>ESDM - Laporan Node POS ({filtered.length} data asli)</h1>
      <p style={{fontSize:12}}>Source: {API_URL}/api/sheet | Hari ini (sistem): {formatIndo(TODAY)} ({TODAY})</p>

      <div style={{display:"flex", gap:10, margin:"15px 0"}}>
        <select value={waktu} onChange={e=>setWaktu(e.target.value)}><option>Hari Ini</option><option>Minggu Ini</option><option>Bulan Ini</option><option>Semua</option></select>
        <select value={link} onChange={e=>setLink(e.target.value)}><option>Semua</option><option>ICON</option><option>TSEL</option><option>Lintasarta</option></select>
        <select value={kendala} onChange={e=>setKendala(e.target.value)}><option>Semua</option><option>POWER</option><option>LINK</option><option>DEVICE</option></select>
      </div>

      <div style={{display:"flex", gap:10, marginBottom:15}}>
        <button onClick={()=>setTab("nodeSering")} style={{background: tab==="nodeSering"?"#000":"#fff", color: tab==="nodeSering"?"#fff":"#000", padding:"8px 12px", borderRadius:8}}>Node Sering Gangguan</button>
        <button onClick={()=>setTab("nodeBerturut")} style={{background: tab==="nodeBerturut"?"#000":"#fff", color: tab==="nodeBerturut"?"#fff":"#000", padding:"8px 12px", borderRadius:8}}>Node Berturut &gt;3 Hari ({nodeBerturut.length})</button>
      </div>

      {tab==="nodeSering"? (
        <table style={{width:"100%", background:"#fff", borderRadius:10}}><tbody>{nodeSering.map((n,i)=><tr key={i}><td style={{padding:10}}>{i+1}. {n.pos}</td><td style={{padding:10}}>{n.jml}x</td></tr>)}</tbody></table>
      ) : (
        <table style={{width:"100%", background:"#fff", borderRadius:10}}><thead><tr><th style={{padding:10}}>POS</th><th>Durasi</th><th>Periode</th></tr></thead><tbody>{nodeBerturut.map((n,i)=><tr key={i}><td style={{padding:10}}>{n.pos}</td><td>{n.durasi} hari</td><td>{n.dari} - {n.sampai}</td></tr>)}</tbody></table>
      )}

      <h3 style={{marginTop:30}}>Detail Data ({filtered.length})</h3>
      <div style={{background:"#fff", borderRadius:10, overflow:"auto", maxHeight:400}}>
        <table style={{width:"100%", fontSize:13}}><thead><tr><th>Tanggal</th><th>POS</th><th>Link</th><th>Kendala</th></tr></thead><tbody>{filtered.slice(0,100).map((d,i)=><tr key={i}><td style={{padding:6}}>{formatIndo(d.tanggal)}</td><td>{d.pos}</td><td>{d.link}</td><td>{d.kendala}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}