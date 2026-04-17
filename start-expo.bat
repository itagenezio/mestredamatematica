@echo off
echo ========================================
echo  INICIANDO EXPO - Mestres da Matematica
echo ========================================
echo.

REM Verifica se o Expo esta instalado
if not exist "node_modules\expo" (
    echo [ERRO] Expo nao encontrado!
    echo Instalando Expo...
    call npm install expo@53.0.27
)

REM Inicia o Expo
echo Iniciando servidor Expo...
call npx.cmd expo start --clear

pause
