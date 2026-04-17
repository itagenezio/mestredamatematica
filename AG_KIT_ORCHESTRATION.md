# 🛡️ AG-KIT: Protocolo de Orquestração - Mestres da Matemática

## 🎯 Objetivo: Lançamento via Expo Go (Estratégia Híbrida)
Data: 2026-02-16
Comandante: Genezio
IA Orquestradora: Antigravity

---

## 🏗️ 1. Análise de Terreno (Diagnosis)
- **Status Atual:** WebApp (Vite/React) tentando rodar nativo via Capacitor (falhando).
- **Meta:** Rodar no Expo Go para testes rápidos no tablet.
- **Obstáculo:** Código fonte é HTML/CSS (Web), Expo Go espera Native (View/Text).
- **Solução Tática:** Implementar um **Container WebView** no Expo que carrega o app localmente.

## 👥 2. Esquadrões (Specialists)

### 🎨 [Frontend Specialist]
- **Tarefa:** Criar o componente `App.js` raiz do Expo que usa `react-native-webview`.
- **Ação:** Manter o código React web intacto, mas servi-lo via IP local.
- **Tech:** React Native WebView.

### 🔧 [DevOps Specialist]
- **Tarefa:** Configurar `package.json` para rodar o servidor Vite E o Expo Go simultaneamente.
- **Ação:** Script `npm run mobile-preview`.
- **Ajuste:** Garantir que o tablet e o PC estejam na mesma rede Wi-Fi.

### 🔐 [Security Specialist]
- **Tarefa:** Garantir que a comunicação local (HTTPS/HTTP) seja permitida no Android Manifest do Expo.
- **Ação:** Configuração de `NSAppTransportSecurity` e `usesCleartextTraffic`.

---

## 🚀 3. Plano de Execução (Action Plan)

1.  **Instalação Tática:** Instalar `react-native-webview` no projeto.
2.  **Criação do Container:** Criar arquivo `App.mobile.tsx` (ou ajustar o entrypoint do Expo) que é apenas uma "janela" para o `localhost:5173`.
3.  **Lançamento:** Rodar `npx expo start` e ler o QR Code no tablet.

---
// Fim do Relatório
