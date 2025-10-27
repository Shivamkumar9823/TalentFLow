// src/api/assessments.handlers.js

import { http, HttpResponse } from 'msw';
import { db } from '../db';
import { faker } from '@faker-js/faker';

// Utilities (Assumed to be defined or accessible globally)
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 200));
const shouldFail = () => Math.random() < 0.1; // 10% error rate

// Define a basic, empty assessment structure for new jobs
const getInitialAssessment = (jobId) => ({
    jobId: jobId,
    structure: {
        title: "New Job Assessment",
        sections: [
            {
                id: faker.string.uuid(),
                title: "Section 1: General Questions",
                questions: []
            }
        ]
    }
});



export const assessmentsHandlers = [

    // 1. GET /assessments/:jobId (Load Assessment Structure)
    http.get('/assessments/:jobId', async ({ params }) => {
        await simulateLatency();
        try {
            const { jobId } = params;
            // Try to find the existing assessment or return a default structure
            let assessment = await db.assessments.get(jobId);
            
            if (!assessment) {
                assessment = getInitialAssessment(jobId);
                // Optionally save the initial structure back to the DB immediately
                await db.assessments.put(assessment);
            }

            return HttpResponse.json(assessment.structure, { status: 200 });

        } catch (error) {
            console.error('API Error: GET /assessments', error);
            return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }),

    // 2. PUT /assessments/:jobId (Save Assessment Structure from Builder)
    http.put('/assessments/:jobId', async ({ params, request }) => {
        await simulateLatency();
        if (shouldFail()) {
            return HttpResponse.json({ message: 'Simulated Network Error: Save failed.' }, { status: 500 });
        }

        try {
            const { jobId } = params;
            const structure = await request.json(); // Full assessment structure from builder
            
            // Validation (minimal)
            if (!structure || !structure.title) {
                return HttpResponse.json({ message: 'Invalid assessment structure.' }, { status: 400 });
            }

            // Write-through to IndexedDB
            const assessment = { jobId: jobId, structure: structure };
            await db.assessments.put(assessment);

            return HttpResponse.json({ message: 'Assessment saved successfully.' }, { status: 200 });

        } catch (error) {
            console.error('API Error: PUT /assessments', error);
            return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }),

    // 3. POST /assessments/:jobId/submit (Store Candidate Response Locally)
    http.post('/assessments/:jobId/submit', async ({ params, request }) => {
        await simulateLatency();
        if (shouldFail()) {
            return HttpResponse.json({ message: 'Simulated Network Error: Submission failed.' }, { status: 500 });
        }

        try {
            const { jobId } = params;
            const submissionData = await request.json(); // Expected: { candidateId, responses }

            // Write candidate response to IndexedDB
            const responseRecord = {
                jobId: jobId,
                candidateId: submissionData.candidateId,
                responses: submissionData.responses,
                submittedAt: Date.now()
            };

            // Use put() to overwrite existing response, based on the compound key [candidateId+jobId]
            await db.candidateResponses.put(responseRecord);

            return HttpResponse.json({ message: 'Response submitted successfully.' }, { status: 201 });

        } catch (error) {
            console.error('API Error: POST /submit', error);
            return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }),
];