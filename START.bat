@echo off
echo ESDM FINAL LAPHAR PIMPINAN PUSDATIN + NODE SERING >3x + GANGGUAN SEMUA
cd backend
start cmd /k npm install ^&^& npm run dev
cd ..\frontend
start cmd /k npm install ^&^& npm run dev
timeout /t 5
start cmd /k ngrok http 5173
pause
