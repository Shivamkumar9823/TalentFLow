// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react()
    , tailwindcss()
  ],
  resolve: {
    alias: {
      // Direct alias to the package root. 
      // This is often sufficient to resolve common dependency issues.
      'react-window': '/node_modules/react-window', 
    },
  },
});