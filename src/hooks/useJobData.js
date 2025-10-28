// src/hooks/useJobData.js

import { useState, useEffect, useCallback } from 'react';
import { db } from '../db'; 

const reorderJobApi = async (jobId, fromOrder, toOrder) => {
  const url = `/jobs/${jobId}/reorder`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromOrder, toOrder }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Reorder failed. Status: ${response.status}`);
  }
};

export const useJobData = (initialParams = {}) => {
  const [jobs, setJobs] = useState([]);
  const [optimisticJobs, setOptimisticJobs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [params, setParams] = useState({
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
    search: initialParams.search || '',
    status: initialParams.status || '', 
    sort: initialParams.sort || 'order',
  });




const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const isDevelopment = process.env.NODE_ENV === 'development';

    try {
        let jobsData;
        let metaData;
        
        if (isDevelopment) {
            // --- MODE 1: DEVELOPMENT (Use Mock API/MSW) ---
            // This tests latency, errors, and pagination in a network simulation.
            const query = new URLSearchParams(params).toString();
            const url = `/jobs?${query}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                // If MSW returns 500, throw error to trigger catch block
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            jobsData = result.data;
            metaData = result.meta;

        } else {
            // --- MODE 2: PRODUCTION/DEPLOYMENT (Direct Dexie Access) ---
            // In deployed environments, MSW is off. We read directly from the source of truth (IndexedDB).
            
            // NOTE: For simplicity in deployment, we read all jobs and apply client-side filtering/pagination here.
            const allJobs = await db.jobs.toArray(); // Access Dexie directly
            
            // Minimal client-side pagination/filter simulation for deployment:
            let filteredJobs = allJobs;
            if (params.status) {
                filteredJobs = filteredJobs.filter(j => j.status === params.status);
            }
            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filteredJobs = filteredJobs.filter(j => j.title.toLowerCase().includes(searchLower) || j.tags.some(t => t.toLowerCase().includes(searchLower)));
            }

            const pageSize = params.pageSize || 10;
            const offset = (params.page - 1) * pageSize;
            
            jobsData = filteredJobs.slice(offset, offset + pageSize);
            metaData = {
                total: filteredJobs.length,
                page: params.page,
                pageSize: pageSize,
                totalPages: Math.ceil(filteredJobs.length / pageSize),
            };
        }
        
        // Update state with results from either mode
        setJobs(jobsData);
        setOptimisticJobs(jobsData);
        setMeta(metaData);

    } catch (err) {
        console.error(`Error fetching jobs in ${isDevelopment ? 'DEV' : 'PROD'} mode:`, err);
        setError('Failed to load jobs. Please ensure your IndexedDB is populated.');
    } finally {
        setLoading(false);
    }
}, [params]); // params is the only dependency that should trigger a re-fetch

// The useEffect block remains correct:
useEffect(() => {
    fetchJobs();
}, [fetchJobs]);



  const updateParams = useCallback((newParams) => {
    const isFilterChange = newParams.search !== undefined || newParams.status !== undefined;
    
    setOptimisticJobs(jobs); // Keep this line for rollback safety
    
    setParams(prev => {
        let newPage = prev.page;
        
        if (isFilterChange) {
            // 1. If filter/search changes, force reset page to 1
            newPage = 1;
        } else if (newParams.page !== undefined) {
            // 2. If ONLY the page parameter is passed (e.g., from handlePageChange), use it.
            newPage = newParams.page;
        }
        
        return {
            ...prev,
            ...newParams,
            page: newPage, // Apply the correct new page number
        };
    });
  }, [jobs]);


  const handleOptimisticReorder = useCallback(async (jobId, sourceIndex, destinationIndex) => {
    setError(null);
    
    const startOrder = sourceIndex + 1;
    const endOrder = destinationIndex + 1;
    const previousState = optimisticJobs;

    // Optimistic UI Update
    const newOptimisticJobs = Array.from(optimisticJobs);
    const [reorderedItem] = newOptimisticJobs.splice(sourceIndex, 1);
    newOptimisticJobs.splice(destinationIndex, 0, reorderedItem);

    setOptimisticJobs(newOptimisticJobs);

    try {
      await reorderJobApi(jobId, startOrder, endOrder);
      await fetchJobs(); 
      return true;

    } catch (err) {
      // Rollback
      console.error("Reorder failed. Rolling back UI change.", err);
      setError(err.message || 'Reorder failed due to network error.');
      setOptimisticJobs(previousState); 
      await fetchJobs();
      return false;
    }
  }, [optimisticJobs, fetchJobs]);


  return { 
    jobs: optimisticJobs,
    meta, 
    loading, 
    error, 
    params, 
    updateParams,
    refetch: fetchJobs,
    handleOptimisticReorder,
  };
};