import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/divination/sw.js');
  });
}
