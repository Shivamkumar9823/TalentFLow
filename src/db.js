// src/db.js

import Dexie from 'dexie';

export const db = new Dexie('TalentFlowDB');

// Define the schema for the three main resources
db.version(1).stores({
  jobs: 'id, title, status, order, *tags', 
  
  candidates: 'id, name, email, stage, jobId',
  
  assessments: 'jobId',
  
  // Candidate Responses table: compound index on candidateId and jobId
  candidateResponses: '++id, [candidateId+jobId]'
});

export async function clearDatabase() {
  await Promise.all(db.tables.map(table => table.clear()));
  console.log('Database cleared.');
}