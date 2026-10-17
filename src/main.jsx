import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './state/AppContext.jsx';
import { UiProvider } from './state/UiContext.jsx';
import App from './App.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <UiProvider>
        <App />
      </UiProvider>
    </AppProvider>
  </StrictMode>
);
