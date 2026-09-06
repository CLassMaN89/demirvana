import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Roboto'yu yerel paketlemek, harici font servisi gecikse bile tasarımın aynı görünmesini sağlar.
import '@fontsource/roboto/latin-ext-400.css';
import '@fontsource/roboto/latin-ext-500.css';
import '@fontsource/roboto/latin-ext-600.css';
import '@fontsource/roboto/latin-ext-700.css';
import '@fontsource/roboto/latin-ext-800.css';
import App from './App';
import './stiller/tema.css';
import './stiller/genel.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
