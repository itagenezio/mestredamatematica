@echo off
chcp 65001 >nul
cls

REM Script de correção automática para Android 12
REM Mestres da Matemática

echo ========================================
echo 🔧 Correções para Android 12
echo ========================================
echo.

REM Verificar se está na raiz do projeto
if not exist "capacitor.config.ts" (
    echo ❌ Erro: Execute este script na raiz do projeto!
    pause
    exit /b 1
)

echo 📝 Fazendo backup dos arquivos originais...
set BACKUP_DIR=backup_android_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
mkdir "%BACKUP_DIR%"
xcopy /E /I /Y android "%BACKUP_DIR%\android" >nul
echo ✅ Backup criado em: %BACKUP_DIR%
echo.

echo 🔄 Aplicando correções...
echo.

REM 1. Criar novo diretório para MainActivity
echo Criando nova estrutura de pacotes...
mkdir android\app\src\main\java\com\mestresmatematica\app 2>nul

REM 2. Criar nova MainActivity
echo Criando MainActivity.java...
(
echo package com.mestresmatematica.app;
echo.
echo import com.getcapacitor.BridgeActivity;
echo.
echo public class MainActivity extends BridgeActivity {}
) > android\app\src\main\java\com\mestresmatematica\app\MainActivity.java

REM 3. Criar arquivos de correção temporários
echo Criando arquivos de correção...

REM Corrigir build.gradle
powershell -Command "(Get-Content android\app\build.gradle) -replace 'namespace \"app.lovable.a707fe40b87c478c80fb9e5f57b1b37a\"', 'namespace \"com.mestresmatematica.app\"' | Set-Content android\app\build.gradle"
powershell -Command "(Get-Content android\app\build.gradle) -replace 'applicationId \"app.lovable.a707fe40b87c478c80fb9e5f57b1b37a\"', 'applicationId \"com.mestresmatematica.app\"' | Set-Content android\app\build.gradle"

REM Corrigir gradle.properties
powershell -Command "(Get-Content android\gradle.properties) -replace 'org.gradle.java.home=C:\\\\Program Files\\\\Java\\\\jdk-17', '# org.gradle.java.home=C:\\Program Files\\Java\\jdk-17' | Set-Content android\gradle.properties"

REM Corrigir AndroidManifest.xml - Adicionar package
powershell -Command "$content = Get-Content android\app\src\main\AndroidManifest.xml -Raw; $content = $content -replace '<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">', '<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\"^`r^`n    package=\"com.mestresmatematica.app\">'; Set-Content android\app\src\main\AndroidManifest.xml $content"

REM Corrigir AndroidManifest.xml - MainActivity
powershell -Command "(Get-Content android\app\src\main\AndroidManifest.xml) -replace 'android:name=\".MainActivity\"', 'android:name=\"com.mestresmatematica.app.MainActivity\"' | Set-Content android\app\src\main\AndroidManifest.xml"

REM Corrigir AndroidManifest.xml - FileProvider
powershell -Command "(Get-Content android\app\src\main\AndroidManifest.xml) -replace 'android:authorities=\"\$\{applicationId\}.fileprovider\"', 'android:authorities=\"com.mestresmatematica.app.fileprovider\"' | Set-Content android\app\src\main\AndroidManifest.xml"

echo.
echo ✅ Arquivos corrigidos!
echo.

REM 4. Limpar build antigo
echo 🧹 Limpando builds antigos...
cd android
call gradlew clean
cd ..
echo ✅ Limpeza concluída!
echo.

REM 5. Sincronizar Capacitor
echo 🔄 Sincronizando Capacitor...
call npx cap sync android
echo ✅ Capacitor sincronizado!
echo.

echo ========================================
echo ✨ Correções aplicadas com sucesso! ✨
echo ========================================
echo.
echo 📱 Próximos passos:
echo.
echo 1. Gerar o APK:
echo    cd android
echo    gradlew assembleDebug
echo.
echo 2. O APK estará em:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 3. Instale no tablet Android 12 e teste!
echo.
echo 💾 Backup dos arquivos originais em: %BACKUP_DIR%
echo.
pause
