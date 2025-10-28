// src/api/candidates.handlers.js

import { http, HttpResponse } from 'msw';
import { db } from '../db';
import { faker } from '@faker-js/faker';

// Utilities (Assumed to be defined or accessible globally for simplicity)
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 200));
const shouldFail = () => Math.random() < 0.1; // 10% error rate

export const candidatesHandlers = [
    
    // 1. GET /candidates (List/Filter)
    http.get('/candidates', async ({ request }) => {
        await simulateLatency();

        try {
            const url = new URL(request.url);
            const search = url.searchParams.get('search')?.toLowerCase() || ''; 
            const stageFilter = url.searchParams.get('stage'); 
            // NOTE: Pagination/pageSize is ignored here; returning all data for client-side virtualization/Kanban.

            let queryable = db.candidates.toCollection();

            // Apply Stage Filtering (Server-like)
            if (stageFilter) {
                queryable = db.candidates.where('stage').equals(stageFilter);
            } else {
                queryable = db.candidates.toCollection();
            }

            // Apply Search Filtering (Client-side)
            const filteredCollection = queryable.filter(candidate => {
                if (!search) return true;
                const nameMatch = candidate.name.toLowerCase().includes(search);
                const emailMatch = candidate.email.toLowerCase().includes(search);
                return nameMatch || emailMatch;
            });

            // Return ALL filtered results for the Kanban board
            const allFilteredCandidates = await filteredCollection.toArray();

            return HttpResponse.json(
                {
                    data: allFilteredCandidates,
                    meta: { total: allFilteredCandidates.length },
                },
                { status: 200 }
            );

        } catch (error) {
            console.error('Dexie GET /candidates Handler Error:', error);
            return HttpResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
        }
    }),

    // 2. POST /candidates (Candidate Application/Creation)
    http.post('/candidates', async ({ request }) => {
        await simulateLatency();
        if (shouldFail()) {
            return HttpResponse.json({ message: 'Simulated Network Error: Application failed.' }, { status: 500 });
        }

        try {
            const newCandidateData = await request.json();
            
            const newCandidate = {
                id: faker.string.uuid(),
                name: newCandidateData.name || faker.person.fullName(),
                email: newCandidateData.email || faker.internet.email(),
                stage: newCandidateData.stage || 'applied', // Default stage
                jobId: newCandidateData.jobId,
                appliedAt: Date.now(),
            };

            await db.candidates.put(newCandidate);
            return HttpResponse.json(newCandidate, { status: 201 });

        } catch (error) {
            console.error('API Error: POST /candidates', error);
            return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }),

    // 3. PATCH /candidates/:id (Stage Transition - Required for Kanban)
    http.patch('/candidates/:id', async ({ params, request }) => {
        await simulateLatency();
        if (shouldFail()) {
            return HttpResponse.json({ message: 'Simulated Server Failure: Stage transition failed.' }, { status: 500 });
        }

        try {
            const { id } = params;
            const updates = await request.json(); // Expected: { stage: 'new_stage' }

            const candidate = await db.candidates.get(id);
            if (!candidate) {
                return HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });
            }
            
            const newStage = updates.stage;
            const oldStage = candidate.stage;

            if (newStage && newStage !== oldStage) {
                // Perform the update
                await db.candidates.update(id, { stage: newStage, updatedAt: Date.now() });
                
                // *** Candidate Timeline Requirement ***
                // In a real implementation, you'd record the status change here:
                /*
                await db.timeline.add({
                    candidateId: id,
                    oldStage: oldStage,
                    newStage: newStage,
                    timestamp: Date.now()
                });
                */
            }

            const updatedCandidate = await db.candidates.get(id);
            return HttpResponse.json(updatedCandidate, { status: 200 });

        } catch (error) {
            console.error('API Error: PATCH /candidates/:id', error);
            return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }),

    http.get('/candidates/:id', async ({ params }) => {
        await simulateLatency();
        try {
            const { id } = params;
            const candidate = await db.candidates.get(id); // Access Dexie DB
            
            if (!candidate) {
                return HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });
            }
            
            // NOTE: Add mock appliedAt/phone/etc. fields here if needed for UI,
            // or ensure they were included during the initial seeding process.

            return HttpResponse.json(candidate, { status: 200 });

        } catch (error) {
            console.error('API Error: GET /candidates/:id', error);
            return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }),
    
    // 4. GET /candidates/:id/timeline (Placeholder for Candidate Profile)
   http.get('/candidates/:id/timeline', async ({ params }) => {
        await simulateLatency();
        
        // CRITICAL FIX: The response MUST contain an array of objects
        return HttpResponse.json({ 
            timeline: [ // <-- This key MUST match the data structure used in the hook
                { id: 1, message: 'Application received.', new: 'applied', timestamp: Date.now() - 86400000 * 10 },
                { id: 2, message: 'Moved to Screen stage.', new: 'screen', timestamp: Date.now() - 86400000 * 8 },
            ]
        }, { status: 200 });
    }),
];