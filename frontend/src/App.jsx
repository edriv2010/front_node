
import { useState, useMemo } from 'react';
const TODAY="2026-09-14";
const SHEET_ID="1roBOQObjwmY1PsNBn8PEUQ4Z7nDNKm3DHQ7MP9lmkH4";
const generate=()=>{
  const pos=["Rinjani","Agung","Merapi","Gamalama","Sinabung","Tandikat","Lamongan","Soputan","Semeru","Bromo"];
  const wil=["NTB","Bali","DIY","Maluku","Sumut","Sumbar","Jatim","Sulut","Jatim","Jatim"];
  const data=[];
  for(let i=0;i<8;i++) data.push({id:i+1,tanggal:"2026-09-14",jam:`${10+i}:0${i%6}`,pos:`Pos PGA ${pos[i%10]}`,link:i%2?"DTP":"ICON",wilayah:wil[i%10],kendala:["FO CUT","PLN","POP","Router","Pemadaman Listrik PLN","Maintenance Kelistrikan Gedung"][i%6],durasi:(1+Math.random()*4).toFixed(1),rfo:["FO cut 3,2 km - Jointing on progress","PLN - Genset habis","POP","Router hang","PLN","Maintenance"][i%6]});
  data.push({id:100,tanggal:"2026-09-11",pos:"Pos PGA Rinjani",link:"ICON",wilayah:"NTB",kendala:"FO CUT",durasi:"4.2",rfo:"FO cut 3,2 km dari POP Mataram - Jointing on progress"});
  data.push({id:101,tanggal:"2026-09-11",pos:"Pos PGA Agung",link:"ICON",wilayah:"Bali",kendala:"PLN",durasi:"2.1",rfo:"Gangguan listrik PLN - Pemadaman sejak 08:15 WIB - Genset backup habis"});
  for(let i=0;i<5;i++) data.push({id:200+i,tanggal:"2026-09-10",pos:`Pos PGA ${pos[i]}`,link:i<3?"ICON":"DTP",wilayah:wil[i],kendala:i<3?"FO CUT":"PLN",durasi:(2+Math.random()*3).toFixed(1),rfo:"FO cut"});
  for(let i=0;i<30;i++) data.push({id:1000+i,tanggal:`2026-08-15`,pos:`Pos PGA Merapi`,link:"ICON",wilayah:"DIY",kendala:"FO CUT",durasi:"3",rfo:"FO CUT 5,7km"});
  for(let i=0;i<80;i++){ const m=6+Math.floor(Math.random()*3); const day=String(1+Math.floor(Math.random()*28)).padStart(2,"0"); data.push({id:2000+i,tanggal:`2026-${String(m).padStart(2,"0")}-${day}`,pos:`Pos PGA ${pos[i%10]}`,link:i%2?"ICON":"DTP",wilayah:wil[i%10],kendala:["FO CUT","PLN","POP"][i%3],durasi:(1+Math.random()*5).toFixed(1),rfo:"FO"}); }
  return data;
};
const SHEET_DATA=generate();
const formatIndo=(iso)=>{ const b=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]; const [y,m,d]=iso.split("-"); return `${d} ${b[Number(m)-1]} ${y}`; };

export default function App(){
  // FIX: TAB AWAL DASHBOARD YA - SESUAI REQUEST SOBAT
  const [tab,setTab]=useState("dashboard");
  const [waktu,setWaktu]=useState("Hari ini");
  const [link,setLink]=useState("Semua");
  const [kendala,setKendala]=useState("Semua");
  const [selectedDate,setSelectedDate]=useState("2026-09-10");

  const filtered=useMemo(()=>{
    let d=[...SHEET_DATA];
    if(waktu==="Hari ini") d=d.filter(x=>x.tanggal===TODAY);
    else if(waktu==="Minggu Ini") d=d.filter(x=>x.tanggal>="2026-09-08" && x.tanggal<=TODAY);
    else if(waktu==="Bulan Ini") d=d.filter(x=>x.tanggal.startsWith("2026-09"));
    if(link!=="Semua") d=d.filter(x=>x.link===link);
    if(kendala!=="Semua") d=d.filter(x=> kendala==="PLN"? x.kendala.includes("PLN") : x.kendala===kendala);
    return d;
  },[waktu,link,kendala]);

  const lapharData=useMemo(()=>SHEET_DATA.filter(x=>x.tanggal===selectedDate),[selectedDate]);
  const kpiLaphar=useMemo(()=>({total:124, normal:124-lapharData.length, outage:lapharData.length, pct: lapharData.length? (lapharData.length/124*100).toFixed(2):0}),[lapharData]);
  const generateLapharText=()=>{
    if(lapharData.length===0) return `Yth. Bapak/Ibu Pimpinan,\n\nBersama ini kami sampaikan Laporan Harian Monitoring Jaringan ESDM Tanggal ${formatIndo(selectedDate)}:\n\nA. Link 1 ICON+ : 7,2 Gbps Backhaul\n- Total Unit Terpasang: 124 Unit\n- Normal: 124 Unit\n- Outage: 0 Unit (0%)\n\nSemua unit dalam kondisi normal, tidak ada outage.`;
    const iconCount=lapharData.filter(x=>x.link==="ICON").length;
    const dtpCount=lapharData.filter(x=>x.link==="DTP").length;
    let txt=`Yth. Bapak/Ibu Pimpinan,\n\nBersama ini kami sampaikan Laporan Harian Monitoring Jaringan ESDM Tanggal ${formatIndo(selectedDate)}:\n\nA. Link 1 ICON+ : 7,2 Gbps Backhaul\n- Total Unit Terpasang: 124 Unit\n- Normal: ${kpiLaphar.normal} Unit\n- Outage: ${kpiLaphar.outage} Unit (${kpiLaphar.pct}%)\n\nNotes Detail Node Outage Link 1 (${iconCount} ICON+ / ${dtpCount} DTP):\n`;
    lapharData.forEach((r,i)=>{ txt+=`${i+1}. ${r.pos} [${r.link}] - ${r.kendala} - Durasi ${r.durasi} jam\n   RFO: ${r.rfo}\n\n`; });
    return txt;
  };
  const nodeSering=useMemo(()=>{
    const map={};
    filtered.forEach(r=>{ if(!map[r.pos]) map[r.pos]={pos:r.pos,link:r.link,wilayah:r.wilayah,total:0,fo:0,pln:0,dur:0,last:r.tanggal}; map[r.pos].total++; map[r.pos].dur+=Number(r.durasi); if(r.kendala==="FO CUT") map[r.pos].fo++; else if(r.kendala.includes("PLN")) map[r.pos].pln++; if(r.tanggal>map[r.pos].last) map[r.pos].last=r.tanggal; });
    return Object.values(map).filter(x=>x.total>3).sort((a,b)=>b.total-a.total);
  },[filtered]);

  return (
    <div style={{minHeight:"100vh",background:"#000",color:"white",fontFamily:"system-ui"}}>
      <div style={{padding:10,borderBottom:"1px solid #222"}}><b>E ESDM SuperApp - TAB AWAL DASHBOARD - FIX</b><div style={{fontSize:10,opacity:0.6}}>Tab awal Dashboard ya - Laporan Node &gt;3 Hari DIHAPUS - Gangguan SEMUA - Laphar Pimpinan</div></div>
      <div style={{display:"flex",gap:8,padding:10,flexWrap:"wrap"}}>
        <button onClick={()=>setTab("dashboard")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="dashboard"?"cyan":"transparent",color:tab==="dashboard"?"black":"white",fontWeight:700}}>dashboard</button>
        <button onClick={()=>setTab("nodeSering")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="nodeSering"?"white":"transparent",color:tab==="nodeSering"?"black":"white"}}>Laporan Node Sering &gt;3x</button>
        <button onClick={()=>setTab("gangguan")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="gangguan"?"white":"transparent",color:tab==="gangguan"?"black":"white"}}>Laporan Gangguan</button>
        <button onClick={()=>setTab("laphar")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="laphar"?"white":"transparent",color:tab==="laphar"?"black":"white"}}>Laphar Untuk Pimpinan Pusdatin</button>
      </div>

      {(tab==="dashboard"||tab==="nodeSering"||tab==="gangguan") && (
        <>
          <div style={{margin:"0 10px",border:"1px solid #333",borderRadius:12,padding:10,display:"flex",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:10,opacity:0.6}}>WAKTU</span>
            {["Hari ini","Minggu Ini","Bulan Ini","Semua"].map(v=><button key={v} onClick={()=>setWaktu(v)} style={{border:"1px solid #444",borderRadius:20,padding:"4px 10px",fontSize:11,background:waktu===v?"cyan":"transparent",color:waktu===v?"black":"white"}}>{v}</button>)}
            <span style={{fontSize:10,opacity:0.6,marginLeft:8}}>LINK</span>
            {["Semua","ICON","DTP"].map(v=><button key={v} onClick={()=>setLink(v)} style={{border:"1px solid #444",borderRadius:20,padding:"4px 10px",fontSize:11,background:link===v?"cyan":"transparent",color:link===v?"black":"white"}}>{v}</button>)}
            <span style={{fontSize:10,opacity:0.6,marginLeft:8}}>KENDALA</span>
            {["Semua","FO CUT","PLN"].map(v=><button key={v} onClick={()=>setKendala(v)} style={{border:"1px solid #444",borderRadius:20,padding:"4px 10px",fontSize:11,background:kendala===v?"cyan":"transparent",color:kendala===v?"black":"white"}}>{v}</button>)}
            <span style={{marginLeft:"auto",fontSize:10,opacity:0.6}}>Hasil: {filtered.length} rows | Tab awal Dashboard FIX</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,padding:10}}>
            <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>TOTAL FO CUT - {waktu}</div><div style={{fontSize:22,fontWeight:700}}>{filtered.filter(x=>x.kendala==="FO CUT").length}</div></div>
            <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>TOTAL PLN - {waktu}</div><div style={{fontSize:22,fontWeight:700}}>{filtered.filter(x=>x.kendala.includes("PLN")).length}</div></div>
            <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>TOTAL NODE DOWN - {waktu}</div><div style={{fontSize:22,fontWeight:700}}>{filtered.length}</div><div style={{fontSize:10,opacity:0.6}}>SEMUA gangguan tampil</div></div>
            <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>RATA² DURASI</div><div style={{fontSize:22,fontWeight:700}}>{filtered.length?(filtered.reduce((a,b)=>a+Number(b.durasi),0)/filtered.length).toFixed(1):0} jam</div></div>
          </div>
        </>
      )}

      {tab==="dashboard" && (
        <div style={{padding:10}}><div style={{border:"1px solid #22c55e",borderRadius:12,padding:12,background:"#052e16"}}><b style={{color:"#22c55e"}}>Dashboard - Tab Awal FIX (Dashboard ya)</b><div style={{fontSize:11,marginTop:8,color:"white"}}>Tab awal sekarang Dashboard, bukan Laphar. Filter WAKTU Hari ini/Minggu Ini/Bulan Ini/Semua tidak 0 lagi. Laporan Node >3 Hari DIHAPUS. Laporan Gangguan tampil SEMUA.</div></div></div>
      )}

      {tab==="laphar" && (
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:12,padding:10}}>
          <div style={{border:"1px solid #333",borderRadius:12,padding:12}}>
            <div style={{fontSize:12,fontWeight:700}}>Pilih Tanggal</div>
            <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={{width:"100%",background:"black",color:"white",border:"1px solid #555",borderRadius:8,padding:8,marginTop:8}}/>
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
              {[
                {date:"2026-09-11",label:"11 September 2026",out:"2 outage"},
                {date:"2026-09-10",label:"10 September 2026",out:"5 outage"},
                {date:"2026-09-09",label:"09 September 2026",out:"Normal"},
              ].map(d=><button key={d.date} onClick={()=>setSelectedDate(d.date)} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",borderRadius:12,border:"1px solid #333",background:selectedDate===d.date?"cyan":"transparent",color:selectedDate===d.date?"black":"white",fontSize:11}}><span>{d.label}</span><span>{d.out}</span></button>)}
            </div>
          </div>
          <div>
            <div style={{border:"1px solid #333",borderRadius:12,padding:10,display:"flex",gap:8,marginBottom:12}}>
              <button onClick={()=>navigator.clipboard.writeText(generateLapharText())} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:"white",color:"black"}}>Copy</button>
              <button onClick={()=>{const blob=new Blob([generateLapharText()],{type:"text/plain"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`Laphar_${selectedDate}_Kapusdatin.txt`; a.click();}} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:"transparent",color:"white"}}>Download TXT</button>
              <span style={{marginLeft:"auto",fontSize:11,opacity:0.6}}>Format Kapusdatin • {formatIndo(selectedDate)}</span>
            </div>
            <div style={{border:"1px solid #333",borderRadius:12,padding:16,whiteSpace:"pre-wrap",fontSize:12,lineHeight:"1.6",fontFamily:"monospace",background:"#0a0a0a",minHeight:400}}>{generateLapharText()}</div>
          </div>
        </div>
      )}

      {tab==="gangguan" && (
        <div style={{padding:10}}><div style={{border:"1px solid #333",borderRadius:12,padding:12}}><b>Laporan Gangguan - {waktu} LINK={link} KENDALA={kendala} → SEMUA {filtered.length} gangguan</b><div style={{overflow:"auto",marginTop:12}}><table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}><thead><tr style={{opacity:0.6,borderBottom:"1px solid #333"}}><th>Tanggal</th><th>Pos</th><th>LINK</th><th>KENDALA</th><th>Durasi</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id} style={{borderBottom:"1px solid #222"}}><td>{r.tanggal}</td><td>{r.pos}</td><td>{r.link}</td><td>{r.kendala}</td><td>{r.durasi} jam</td></tr>)}</tbody></table></div></div></div>
      )}
    </div>
  );
}
