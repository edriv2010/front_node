import { useState, useMemo } from 'react';
const TODAY="2026-09-14";
// SHEET_ID & GID DISIMPAN DI BACKEND .env - TIDAK DITAMPILKAN DI FRONTEND
const generate=()=>{
  const pos=["Rinjani","Agung","Merapi","Gamalama","Sinabung","Tandikat","Lamongan","Soputan","Semeru","Bromo"];
  const wil=["NTB","Bali","DIY","Maluku","Sumut","Sumbar","Jatim","Sulut","Jatim","Jatim"];
  const data=[];
  // Data contoh berturut-turut: Merapi 15,16,17 Sep - Rinjani 11,12,13,14 Sep
  data.push({id:1,tanggal:"2026-09-15",jam:"10:00",pos:"Pos PGA Merapi",link:"ICON",wilayah:"DIY",kendala:"FO CUT",durasi:"3.2",rfo:"FO CUT 5,7km - 15 Sep"});
  data.push({id:2,tanggal:"2026-09-16",jam:"11:00",pos:"Pos PGA Merapi",link:"ICON",wilayah:"DIY",kendala:"FO CUT",durasi:"4.1",rfo:"FO CUT 5,7km - 16 Sep - belum jointing"});
  data.push({id:3,tanggal:"2026-09-17",jam:"09:30",pos:"Pos PGA Merapi",link:"ICON",wilayah:"DIY",kendala:"PLN",durasi:"2.5",rfo:"PLN - Merapi 17 Sep"});
  data.push({id:4,tanggal:"2026-09-11",jam:"08:00",pos:"Pos PGA Rinjani",link:"ICON",wilayah:"NTB",kendala:"FO CUT",durasi:"2.0",rfo:"Rinjani 11"});
  data.push({id:5,tanggal:"2026-09-12",jam:"08:15",pos:"Pos PGA Rinjani",link:"ICON",wilayah:"NTB",kendala:"FO CUT",durasi:"3.0",rfo:"Rinjani 12"});
  data.push({id:6,tanggal:"2026-09-13",jam:"09:00",pos:"Pos PGA Rinjani",link:"ICON",wilayah:"NTB",kendala:"FO CUT",durasi:"1.5",rfo:"Rinjani 13"});
  data.push({id:7,tanggal:"2026-09-14",jam:"10:00",pos:"Pos PGA Rinjani",link:"ICON",wilayah:"NTB",kendala:"PLN",durasi:"2.2",rfo:"Rinjani 14"});
  // Data tidak berturut-turut: Agung 10, 12, 15 -> tidak masuk
  data.push({id:8,tanggal:"2026-09-10",jam:"10:00",pos:"Pos PGA Agung",link:"DTP",wilayah:"Bali",kendala:"FO CUT",durasi:"1.0",rfo:"Agung 10"});
  data.push({id:9,tanggal:"2026-09-12",jam:"10:00",pos:"Pos PGA Agung",link:"DTP",wilayah:"Bali",kendala:"PLN",durasi:"2.0",rfo:"Agung 12"});
  data.push({id:10,tanggal:"2026-09-15",jam:"10:00",pos:"Pos PGA Agung",link:"DTP",wilayah:"Bali",kendala:"FO CUT",durasi:"1.5",rfo:"Agung 15"});
  // Hari ini random
  for(let i=0;i<8;i++) data.push({id:100+i,tanggal:"2026-09-14",jam:`${10+i}:0${i%6}`,pos:`Pos PGA ${pos[i%10]}`,link:i%2?"DTP":"ICON",wilayah:wil[i%10],kendala:["FO CUT","PLN","POP"][i%3],durasi:(1+Math.random()*4).toFixed(1),rfo:"Random"});
  for(let i=0;i<80;i++){ const m=6+Math.floor(Math.random()*3); const day=String(1+Math.floor(Math.random()*28)).padStart(2,"0"); data.push({id:2000+i,tanggal:`2026-${String(m).padStart(2,"0")}-${day}`,pos:`Pos PGA ${pos[i%10]}`,link:i%2?"ICON":"DTP",wilayah:wil[i%10],kendala:["FO CUT","PLN","POP"][i%3],durasi:(1+Math.random()*5).toFixed(1),rfo:"FO"}); }
  return data;
};
const SHEET_DATA=generate();
const formatIndo=(iso)=>{ const b=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]; const [y,m,d]=iso.split("-"); return `${d} ${b[Number(m)-1]} ${y}`; };
const parseDate = (s)=>{ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };
const diffDays = (a,b)=> Math.round((parseDate(b)-parseDate(a))/86400000);

export default function App(){
  const [waktu,setWaktu]=useState("Bulan Ini");
  const [link,setLink]=useState("Semua");
  const [kendala,setKendala]=useState("Semua");
  const [tab,setTab]=useState("nodeSering");
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
  const generateLapharText=()=>{ if(lapharData.length===0) return `Yth. Bapak/Ibu Pimpinan,\n\nLaporan Harian ${formatIndo(selectedDate)} - Semua normal 124 unit.`; let txt=`Yth. Bapak/Ibu Pimpinan,\n\nLaporan Harian ${formatIndo(selectedDate)}:\nTotal 124 - Outage ${kpiLaphar.outage} (${kpiLaphar.pct}%)\n\nDetail:\n`; lapharData.forEach((r,i)=>{ txt+=`${i+1}. ${r.pos} [${r.link}] ${r.tanggal} - ${r.kendala} - ${r.durasi} jam - ${r.rfo}\n`; }); return txt; };

  // LOGIC BARU: >3 HARI BERTURUT-TURUT (misal 15,16,17 Sep)
  const nodeBerturut=useMemo(()=>{
    const grouped={};
    filtered.forEach(r=>{
      if(!grouped[r.pos]) grouped[r.pos]={pos:r.pos,link:r.link,wilayah:r.wilayah,dates:{},records:[]};
      if(!grouped[r.pos].dates[r.tanggal]) grouped[r.pos].dates[r.tanggal]={tanggal:r.tanggal,fo:0,pln:0,dur:0,count:0};
      grouped[r.pos].dates[r.tanggal].count++;
      grouped[r.pos].dates[r.tanggal].dur+=Number(r.durasi);
      if(r.kendala==="FO CUT") grouped[r.pos].dates[r.tanggal].fo++;
      else if(r.kendala.includes("PLN")) grouped[r.pos].dates[r.tanggal].pln++;
      grouped[r.pos].records.push(r);
    });
    const result=[];
    Object.values(grouped).forEach(g=>{
      const sortedDates = Object.values(g.dates).sort((a,b)=>a.tanggal.localeCompare(b.tanggal));
      if(sortedDates.length<3) return;
      // cari streak berturut-turut >=3
      let streakStart=0;
      let bestStreak=[];
      let curStreak=[sortedDates[0]];
      for(let i=1;i<sortedDates.length;i++){
        if(diffDays(sortedDates[i-1].tanggal, sortedDates[i].tanggal)===1){
          curStreak.push(sortedDates[i]);
        } else {
          if(curStreak.length>=3 && curStreak.length>bestStreak.length) bestStreak=[...curStreak];
          curStreak=[sortedDates[i]];
        }
      }
      if(curStreak.length>=3 && curStreak.length>bestStreak.length) bestStreak=curStreak;
      if(bestStreak.length>=3){
        const totalDur = bestStreak.reduce((a,b)=>a+b.dur,0);
        const totalFO = bestStreak.reduce((a,b)=>a+b.fo,0);
        const totalPLN = bestStreak.reduce((a,b)=>a+b.pln,0);
        result.push({
          pos:g.pos, link:g.link, wilayah:g.wilayah,
          streak:bestStreak.length,
          tglAwal:bestStreak[0].tanggal,
          tglAkhir:bestStreak[bestStreak.length-1].tanggal,
          listTanggal:bestStreak.map(x=>x.tanggal).join(", "),
          totalFO, totalPLN, totalDur,
          records:bestStreak
        });
      }
    });
    return result.sort((a,b)=>b.streak-a.streak);
  },[filtered]);

  const kpiBerturut = useMemo(()=>{
    return {
      totalNode: nodeBerturut.length,
      totalStreak: nodeBerturut.reduce((a,b)=>a+b.streak,0),
      totalFO: nodeBerturut.reduce((a,b)=>a+b.totalFO,0),
      totalPLN: nodeBerturut.reduce((a,b)=>a+b.totalPLN,0),
      totalDur: nodeBerturut.reduce((a,b)=>a+b.totalDur,0),
    }
  },[nodeBerturut]);

  return (
    <div style={{minHeight:"100vh",background:"#000",color:"white",fontFamily:"system-ui"}}>
      <div style={{padding:10,borderBottom:"1px solid #222"}}><b>ESDM SuperApp - LAPORAN NODE BERTURUT 3 HARI FIX - Contoh: Merapi 15,16,17 Sep</b><div style={{fontSize:10,opacity:0.6}}>Fix: Node Sering = >3 hari berturut-turut tanggal nyambung, bukan >3x kejadian</div></div>
      <div style={{display:"flex",gap:8,padding:10,flexWrap:"wrap"}}>
        <button onClick={()=>setTab("dashboard")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="dashboard"?"cyan":"transparent",color:tab==="dashboard"?"black":"white"}}>dashboard</button>
        <button onClick={()=>setTab("nodeSering")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="nodeSering"?"#fbbf24":"transparent",color:tab==="nodeSering"?"black":"white",fontWeight:700}}>Laporan Node Berturut &gt;3 Hari</button>
        <button onClick={()=>setTab("gangguan")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="gangguan"?"white":"transparent",color:tab==="gangguan"?"black":"white"}}>Laporan Gangguan</button>
        <button onClick={()=>setTab("laphar")} style={{border:"1px solid #444",borderRadius:20,padding:"6px 12px",fontSize:11,background:tab==="laphar"?"white":"transparent",color:tab==="laphar"?"black":"white"}}>Laphar Pimpinan</button>
      </div>

      <div style={{margin:"0 10px",border:"1px solid #333",borderRadius:12,padding:10,display:"flex",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:10,opacity:0.6}}>WAKTU</span>
        {["Hari ini","Minggu Ini","Bulan Ini","Semua"].map(v=><button key={v} onClick={()=>setWaktu(v)} style={{border:"1px solid #444",borderRadius:20,padding:"4px 10px",fontSize:11,background:waktu===v?"cyan":"transparent",color:waktu===v?"black":"white"}}>{v}</button>)}
        <span style={{fontSize:10,opacity:0.6,marginLeft:8}}>LINK</span>
        {["Semua","ICON","DTP"].map(v=><button key={v} onClick={()=>setLink(v)} style={{border:"1px solid #444",borderRadius:20,padding:"4px 10px",fontSize:11,background:link===v?"cyan":"transparent",color:link===v?"black":"white"}}>{v}</button>)}
      </div>

      {tab==="dashboard" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,padding:10}}>
          <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>TOTAL FO CUT - {waktu}</div><div style={{fontSize:22,fontWeight:700}}>{filtered.filter(x=>x.kendala==="FO CUT").length}</div></div>
          <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>TOTAL PLN - {waktu}</div><div style={{fontSize:22,fontWeight:700}}>{filtered.filter(x=>x.kendala.includes("PLN")).length}</div></div>
          <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>TOTAL NODE DOWN - {waktu}</div><div style={{fontSize:22,fontWeight:700}}>{filtered.length}</div></div>
          <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><div style={{fontSize:10,opacity:0.6}}>RATA² DURASI</div><div style={{fontSize:22,fontWeight:700}}>{filtered.length?(filtered.reduce((a,b)=>a+Number(b.durasi),0)/filtered.length).toFixed(1):0} jam</div></div>
        </div>
      )}

      {tab==="nodeSering" && (
        <div style={{padding:10}}>
          <div style={{border:"2px solid #fbbf24",borderRadius:12,padding:12,background:"#1a1200"}}>
            <b style={{color:"#fbbf24",fontSize:13}}>Laporan Node Sering Kendala - Gangguan &gt;3 Hari Berturut-turut - FIX CONTOH MERAPI 15,16,17 SEP</b>
            <div style={{fontSize:11,marginTop:6,opacity:0.8}}>Hanya tampil node yang down tanggalnya nyambung terus menerus minimal 3 hari, misal Pos Merapi 15,16,17 September → tampil. Kalau bolong tidak tampil.</div>
            
            <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              <div style={{border:"1px solid #fbbf24",borderRadius:12,padding:12,background:"#000"}}><div style={{fontSize:10,opacity:0.6,color:"#fbbf24"}}>JUMLAH NODE BERTURUT &gt;3 HARI</div><div style={{fontSize:28,fontWeight:800,color:"#fbbf24"}}>{kpiBerturut.totalNode}</div><div style={{fontSize:10,opacity:0.6}}>node contoh: Merapi 15,16,17 Sep</div></div>
              <div style={{border:"1px solid #333",borderRadius:12,padding:12,background:"#111"}}><div style={{fontSize:10,opacity:0.6}}>TOTAL HARI BERTURUT</div><div style={{fontSize:22,fontWeight:700}}>{kpiBerturut.totalStreak} hari</div><div style={{fontSize:10,opacity:0.6}}>akumulasi streak</div></div>
              <div style={{border:"1px solid #333",borderRadius:12,padding:12,background:"#111"}}><div style={{fontSize:10,opacity:0.6}}>JUMLAH FO CUT</div><div style={{fontSize:22,fontWeight:700,color:"#ef4444"}}>{kpiBerturut.totalFO}x</div><div style={{fontSize:10,opacity:0.6}}>FO di node berturut</div></div>
              <div style={{border:"1px solid #333",borderRadius:12,padding:12,background:"#111"}}><div style={{fontSize:10,opacity:0.6}}>JUMLAH PLN</div><div style={{fontSize:22,fontWeight:700,color:"#eab308"}}>{kpiBerturut.totalPLN}x</div><div style={{fontSize:10,opacity:0.6}}>PLN di node berturut</div></div>
              <div style={{border:"1px solid #333",borderRadius:12,padding:12,background:"#111"}}><div style={{fontSize:10,opacity:0.6}}>TOTAL DURASI</div><div style={{fontSize:22,fontWeight:700}}>{kpiBerturut.totalDur.toFixed(1)} jam</div><div style={{fontSize:10,opacity:0.6}}>downtime berturut</div></div>
            </div>

            <div style={{overflow:"auto",marginTop:16,border:"1px solid #333",borderRadius:12,background:"#000"}}>
              <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
                <thead><tr style={{opacity:0.7,borderBottom:"1px solid #333",textAlign:"left",background:"#111"}}><th style={{padding:"10px"}}>Nama Node</th><th>LINK</th><th>Wilayah</th><th style={{color:"#fbbf24"}}>Jumlah Hari Berturut</th><th>Tgl Awal</th><th>Tgl Akhir</th><th>List Tanggal (contoh 15,16,17 Sep)</th><th>FO</th><th>PLN</th><th>Durasi</th></tr></thead>
                <tbody>{nodeBerturut.map(r=><tr key={r.pos} style={{borderBottom:"1px solid #222"}}><td style={{padding:"10px",fontWeight:700}}>{r.pos}</td><td>{r.link}</td><td>{r.wilayah}</td><td style={{fontWeight:800,color:"#fbbf24",fontSize:13}}>{r.streak} hari</td><td>{r.tglAwal}</td><td>{r.tglAkhir}</td><td style={{fontSize:10}}>{r.listTanggal}</td><td style={{color:"#ef4444"}}>{r.totalFO}x</td><td style={{color:"#eab308"}}>{r.totalPLN}x</td><td>{r.totalDur.toFixed(1)} jam</td></tr>)}{nodeBerturut.length===0&&<tr><td colSpan={10} style={{textAlign:"center",padding:30,opacity:0.6}}>Tidak ada node berturut &gt;3 hari di periode {waktu}. Coba ganti ke Bulan Ini / Semua. Contoh: Merapi 15,16,17 Sep akan tampil di Bulan Ini.</td></tr>}</tbody>
              </table>
            </div>
            <div style={{marginTop:10,padding:10,border:"1px dashed #fbbf24",borderRadius:8,fontSize:11,background:"#000"}}>
              <b style={{color:"#fbbf24"}}>Contoh logika baru:</b> Pos PGA Merapi gangguan tanggal 2026-09-15, 2026-09-16, 2026-09-17 (nyambung 3 hari) → <span style={{color:"#22c55e"}}>TAMPIL</span>. Pos PGA Agung gangguan 10, 12, 15 (bolong) → <span style={{color:"#ef4444"}}>TIDAK TAMPIL</span>.
            </div>
          </div>
        </div>
      )}

      {tab==="gangguan" && (
        <div style={{padding:10}}><div style={{border:"1px solid #22c55e",borderRadius:12,padding:12}}><b>Laporan Gangguan - {waktu} - SEMUA {filtered.length} gangguan</b><div style={{overflow:"auto",marginTop:12}}><table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}><thead><tr style={{opacity:0.6,borderBottom:"1px solid #333",textAlign:"left"}}><th>Tanggal</th><th>Pos</th><th>LINK</th><th>KENDALA</th><th>Durasi</th><th>RFO</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id} style={{borderBottom:"1px solid #222"}}><td>{r.tanggal}</td><td>{r.pos}</td><td>{r.link}</td><td>{r.kendala}</td><td>{r.durasi} jam</td><td>{r.rfo}</td></tr>)}</tbody></table></div></div></div>
      )}
      {tab==="laphar" && (
        <div style={{padding:10,display:"grid",gridTemplateColumns:"300px 1fr",gap:12}}>
          <div style={{border:"1px solid #333",borderRadius:12,padding:12}}><input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={{width:"100%",background:"black",color:"white",border:"1px solid #555",borderRadius:8,padding:8}}/></div>
          <div style={{border:"1px solid #333",borderRadius:12,padding:16,whiteSpace:"pre-wrap",fontSize:12,fontFamily:"monospace",background:"#0a0a0a"}}>{generateLapharText()}</div>
        </div>
      )}
    </div>
  );
}
