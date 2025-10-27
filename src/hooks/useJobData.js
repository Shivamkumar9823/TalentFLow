// src/hooks/useJobData.js

import { useState, useEffect, useCallback } from 'react';

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

    const query = new URLSearchParams(params).toString();
    const url = `/jobs?${query}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setJobs(result.data);
      setOptimisticJobs(result.data);
      setMeta(result.meta);

    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateParams = useCallback((newParams) => {
    setOptimisticJobs(jobs); 
    setParams(prev => ({
      ...prev,
      ...newParams,
      page: newParams.search !== undefined || newParams.status !== undefined ? 1 : prev.page,
    }));
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