# ESDM SuperApp - Pusdatin - FINAL

Dashboard monitoring jaringan ESDM 100% dari Google Sheet asli (bukan Excel, bukan hardcode JSON)

## Fitur FINAL (sesuai request)
- ✅ **Tab awal = Dashboard** (fix request sobat)
- ✅ **Laporan Node >3 Hari DIHAPUS**
- ✅ **Laporan Node Sering Kendala (>3x)** - node yang >3x kena gangguan
- ✅ **Laporan Gangguan - SEMUA gangguan tampil** (Hari ini | LINK=Semua KENDALA=Semua = 8 kejadian SEMUA, bukan filter >3x berturut saja)
- ✅ **Laphar Untuk Pimpinan Pusdatin - Format Kapusdatin** - Pilih Tanggal, Copy, Download TXT, WA Share
- ✅ Filter WAKTU Hari ini/Minggu Ini/Bulan Ini/Semua + LINK Semua/ICON/DTP + KENDALA Semua/FO CUT/PLN - FIX tidak 0 lagi
- ✅ 100% Google Sheet asli `1roBOQObjwmY1PsNBn8PEUQ4Z7nDNKm3DHQ7MP9lmkH4` - EN_LOCAL_GID dari .env, GID_LAPHAR 1891536161
- ✅ vite.config.js `allowedHosts:true` + proxy `/api` -> 1 token ngrok bisa FE+BE
- ✅ Login admin/admin123

## Cara add, commit, push ke GitHub (yang boleh di-push sudah difilter .gitignore)

### Yang BOLEH di push:
- frontend/src/App.jsx (file utama)
- frontend/src/main.jsx, vite.config.js, package.json, index.html
- backend/src/server.js, package.json, .env.example
- .gitignore, README.md, START.bat

### Yang JANGAN di push (sudah di-ignore):
- node_modules/ (200MB+, auto install)
- dist/, build/
- backend/.env asli (secret) - push .env.example aja

### Langkah push:

```bat
# 1. Extract zip ini
# 2. Buka CMD di folder ini

git init
git add .
git status
# cek yang ke-add harusnya cuma file di atas, TANPA node_modules

git commit -m "FINAL: Tab awal Dashboard, Node >3 Hari dihapus, Gangguan SEMUA bukan 3x, Laphar Pimpinan Format Kapusdatin, fix WAKTU tidak 0, 100% Google Sheet"

# Bikin repo baru di github.com/new -> nama: esdm-superapp-pusdatin -> jangan centang README

git branch -M main
git remote add origin https://github.com/USERNAME-KAMU/esdm-superapp-pusdatin.git
git push -u origin main
```

### Cara jalanin setelah clone:

```bat
git clone https://github.com/USERNAME-KAMU/esdm-superapp-pusdatin.git
cd esdm-superapp-pusdatin

# Copy env example jadi env asli
copy backend\.env.example backend\.env
# Linux/Mac: cp backend/.env.example backend/.env

cd backend
npm install
npm run dev

# terminal baru
cd ../frontend
npm install
npm run dev

# terminal baru - ngrok 1 token bisa FE+BE
ngrok http 5173
# buka https://xxx.ngrok-free.dev -> admin/admin123 -> langsung Dashboard ya!
```

## Struktur
```
frontend/src/App.jsx - Dashboard + Node Sering >3x + Gangguan SEMUA + Laphar Pimpinan
backend/src/server.js - Fetch Google Sheet via /export?format=csv&gid=
```
