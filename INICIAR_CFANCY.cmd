@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Primero instala las dependencias con npm.cmd ci en esta carpeta.
  pause
  exit /b 1
)
echo Iniciando C'FANCY. Espera la direccion que imprime el servidor.
echo Para detener: Ctrl+C. Los accesos demo estan en docs\GUIA_DE_USO.md
call npm.cmd run dev
pause
