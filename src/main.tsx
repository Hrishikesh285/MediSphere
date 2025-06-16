import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { MedicationProvider } from './context/MedicationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MedicationProvider>
          <App />
        </MedicationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);