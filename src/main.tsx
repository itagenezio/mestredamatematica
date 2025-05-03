
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register } from './serviceWorkerRegistration'

// Registrar o service worker para funcionalidades offline
register();

createRoot(document.getElementById("root")!).render(<App />);
