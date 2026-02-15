# Instruções para Build Local do APK

Se você preferir gerar o APK localmente em vez de usar o EAS Build, siga estas instruções:

## Usando Capacitor

1. **Configure o ambiente Android:**
   - Certifique-se de que o Android SDK está instalado em C:\Users\genez\AppData\Local\Android\Sdk
   - Verifique se a variável ANDROID_HOME aponta para o SDK
   - Verifique se JAVA_HOME aponta para o JDK 17

2. **Prepare o projeto para Android:**
   ```bash
   npx cap sync android
   ```

3. **Abra o projeto no Android Studio:**
   ```bash
   npx cap open android
   ```

4. **No Android Studio:**
   - Vá para Build > Build Bundle(s) / APK(s) > Build APK(s)
   - O APK será gerado em android/app/build/outputs/apk/debug/app-debug.apk

## Usando React Native CLI (alternativa)

1. **Instale o React Native CLI:**
   ```bash
   npm install -g react-native-cli
   ```

2. **Execute o build:**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **Encontre o APK:**
   O APK estará em android/app/build/outputs/apk/debug/app-debug.apk

## Compartilhando o APK

Depois de gerar o APK, você pode:
1. Enviá-lo por email
2. Compartilhá-lo via serviços como Google Drive ou Dropbox
3. Instalá-lo diretamente em dispositivos Android (lembre-se de habilitar "Instalação de fontes desconhecidas") 