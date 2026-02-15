@echo off
echo Compilando APK universal...
call gradlew.bat clean
call gradlew.bat assembleDebug

echo.
echo Compilação concluída.
echo.
echo O APK está localizado em: app\build\outputs\apk\debug\app-debug.apk
echo.
pause 