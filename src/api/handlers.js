// src/api/handlers.js
import { jobsHandlers } from './jobs.handlers';
import { candidatesHandlers } from './candidates.handlers';
import { assessmentsHandlers } from './assessments.handlers';

export const handlers = [
  ...jobsHandlers,
  ...candidatesHandlers, // Check this line!
  ...assessmentsHandlers,
];