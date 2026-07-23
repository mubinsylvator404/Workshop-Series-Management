import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CmsProvider } from './context/CmsContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';

// Safely handle read-only window.fetch assignment errors from third-party browser extensions or environments
window.addEventListener('error', (event) => {
  if (event.message && (event.message.includes('fetch') || event.message.includes('getter'))) {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && (event.reason.message.includes('fetch') || event.reason.message.includes('getter'))) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </AuthProvider>
  </StrictMode>,
);

