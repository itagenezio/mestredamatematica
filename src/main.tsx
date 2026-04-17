import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core'
import { GameAudioProvider } from './contexts/GameAudioContext'

// Captura erros globais e mostra alerta no Android
window.onerror = function (message, source, lineno, colno, error) {
  alert("Erro detectado: " + message);
  console.error('Erro global capturado:', { message, source, lineno, colno, error });
  return true;
};

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <GameAudioProvider>
        <App />
      </GameAudioProvider>
    );
  } catch (err) {
    alert("Erro ao renderizar App: " + err);
    console.error(err);
  }
} else {
  alert("Elemento root não encontrado!");
}
