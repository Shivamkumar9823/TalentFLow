// src/api/jobs.handlers.js

import { http, HttpResponse } from 'msw';
import { db } from '../db'; // Dexie database instance
import { faker } from '@faker-js/faker';

// Simulate network latency (200-1200ms)
const simulateLatency = () => new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 1000) + 200;
    setTimeout(resolve, delay);
});

// Simulate a 5-10% error rate on write endpoints
const shouldFail = () => Math.random() < 0.1; 

export const jobsHandlers = [
  
  // 1. GET /jobs?search=&status=&page=&pageSize=&sort=
  // Implements reliable filtering, searching, and pagination against IndexedDB.
  http.get('/jobs', async ({ request }) => {
    await simulateLatency();

    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search')?.toLowerCase() || '';
      const statusFilter = url.searchParams.get('status'); 
      const page = parseInt(url.searchParams.get('page')) || 1;
      const pageSize = parseInt(url.searchParams.get('pageSize')) || 10;
      const sort = url.searchParams.get('sort') || 'order'; // Default sort for reordering

      // 1. Initial Collection Query (Use indexed field for efficiency if possible)
      let queryable = db.jobs;
      
      if (statusFilter && (statusFilter === 'active' || statusFilter === 'archived')) {
        // Use Dexie's where().equals() on the indexed 'status' field
        queryable = queryable.where('status').equals(statusFilter);
      } else {
        // If no status filter, start with the full collection
        queryable = queryable.toCollection();
      }

      // 2. Apply Search Filtering (Client-side filtering must be applied to the collection)
      const filteredCollection = queryable.filter(job => {
        if (!search) return true;
        
        const titleMatch = job.title.toLowerCase().includes(search);
        // Search by tags (multi-entry search)
        const tagsMatch = job.tags.some(tag => tag.toLowerCase().includes(search));
        
        return titleMatch || tagsMatch;
      });

      // 3. Get Total Count and Apply Sorting/Pagination
      const totalCount = await filteredCollection.count();

      // Ensure sorting happens on the filtered collection
      const sortedJobs = await filteredCollection.sortBy(sort); 
      
      const offset = (page - 1) * pageSize;
      const paginatedJobs = sortedJobs.slice(offset, offset + pageSize);
      
      // 4. Return the paginated response
      return HttpResponse.json(
        {
          data: paginatedJobs,
          meta: {
            total: totalCount,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
          },
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Dexie GET /jobs Handler Error:', error);
      return HttpResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
  }),


  // 2. POST /jobs (Create New Job)
  http.post('/jobs', async ({ request }) => {
    await simulateLatency();
    // Test the 5-10% error rate
    if (shouldFail()) {
      return HttpResponse.json({ message: 'Simulated Network Error: Job creation failed.' }, { status: 500 });
    }

    try {
      const newJobData = await request.json();
      if (!newJobData.title) {
        return HttpResponse.json({ message: 'Title is required' }, { status: 400 });
      }

      const title = newJobData.title;
      const slug = title.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]+/g, ''); 
      // Determine the next highest 'order' value
      const maxOrderJob = await db.jobs.orderBy('order').last();
      const newOrder = maxOrderJob ? maxOrderJob.order + 1 : 1;

      const newJob = {
        id: faker.string.uuid(),
        title,
        slug,
        status: 'active', // Default status upon creation
        tags: newJobData.tags || [],
        order: newOrder,
        createdAt: Date.now(),
      };

      // Write-through to IndexedDB
      await db.jobs.put(newJob);
      return HttpResponse.json(newJob, { status: 201 });

    } catch (error) {
      console.error('API Error: POST /jobs', error);
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),


  // 3. PATCH /jobs/:id (Edit/Update Job Details or Status (Archive/Unarchive))
  http.patch('/jobs/:id', async ({ params, request }) => {
    await simulateLatency();
    // Test the 5-10% error rate
    if (shouldFail()) {
      return HttpResponse.json({ message: 'Simulated Network Error: Job update failed.' }, { status: 500 });
    }

    try {
      const { id } = params;
      const updates = await request.json();
      
      const job = await db.jobs.get(id);
      if (!job) {
        return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
      }

      const updatedJob = {
        ...job,
        ...updates,
        // Re-generate slug if the title is updated
        slug: updates.title 
          ? updates.title.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]+/g, '') 
          : job.slug,
        updatedAt: Date.now(),
      };

      await db.jobs.put(updatedJob);
      return HttpResponse.json(updatedJob, { status: 200 });

    } catch (error) {
      console.error('API Error: PATCH /jobs/:id', error);
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),


  // 4. PATCH /jobs/:id/reorder (Reorder Job - with Rollback Test)
  http.patch('/jobs/:id/reorder', async ({ params, request }) => {
    await simulateLatency();

    // The core requirement: occasionally return 500 to test rollback.
    if (shouldFail()) { 
      console.warn(`Simulating 500 error for reorder job ${params.id}`);
      return HttpResponse.json({ message: 'Simulated Server Failure: Reorder failed.' }, { status: 500 });
    }

    try {
      const { fromOrder, toOrder } = await request.json(); // Data from the client
      const { id } = params;
      
      if (!fromOrder || !toOrder) {
        return HttpResponse.json({ message: 'Missing order parameters' }, { status: 400 });
      }

      // Dexie Transaction for atomic updates
      await db.transaction('rw', db.jobs, async () => {
        // Get all active jobs, sorted by order (only these can be reordered)
        const jobsToUpdate = await db.jobs.where('status').equals('active').sortBy('order');
        
        // --- Perform Array Reordering in memory ---
        const jobToMoveIndex = jobsToUpdate.findIndex(job => job.id === id);
        if (jobToMoveIndex === -1) {
             throw new Error('Job not found or not active.');
        }
        
        // Remove, then insert at new position based on the new order index
        const [jobToMove] = jobsToUpdate.splice(jobToMoveIndex, 1);
        const newIndex = toOrder - 1; 
        jobsToUpdate.splice(newIndex, 0, jobToMove);

        // --- Recalculate and Bulk Update 'order' ---
        const updatePromises = jobsToUpdate.map((job, index) => {
          return db.jobs.update(job.id, { order: index + 1 });
        });
        
        await Promise.all(updatePromises);
      });

      return HttpResponse.json({ message: 'Reorder successful' }, { status: 200 });

    } catch (error) {
      console.error('API Error: PATCH /jobs/:id/reorder', error);
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),
];