import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Only enable offline caching for production builds. In development, a service
// worker can serve stale modules and interfere with the server's update cycle.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('PWA ServiceWorker registration notice:', err);
    });
  });
}

// Clean up service workers registered by older development builds.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => void registration.unregister());
  });
}
