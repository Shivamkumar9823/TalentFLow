// src/api/browser.js

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers'; // Imports the array of all mock API handlers

// This configures a Service Worker instance with the given request handlers.
export const worker = setupWorker(...handlers);