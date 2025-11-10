import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

// Development warning
if (clientId === 'YOUR_CLIENT_ID_HERE' && import.meta.env.DEV) {
  console.warn(
    '⚠️ Google Client ID not configured!\n' +
    'Please create a .env file with VITE_GOOGLE_CLIENT_ID\n' +
    'See README.md for setup instructions'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
