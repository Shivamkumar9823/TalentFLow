// src/main.jsx

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { seedDatabase } from './seedData.js'; 

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  const { worker } = await import('./api/browser'); 
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

async function startApp() {
  await seedDatabase();
  await enableMocking();
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

startApp();