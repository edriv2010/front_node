@echo off
echo ESDM SuperApp - SIAP GITHUB - Tab awal Dashboard - Node >3 Hari DIHAPUS - Gangguan SEMUA - Laphar Pimpinan
cd backend
start cmd /k npm install ^&^& npm run dev
cd ..\frontend
start cmd /k npm install ^&^& npm run dev
timeout /t 5
start cmd /k ngrok http 5173
pause
