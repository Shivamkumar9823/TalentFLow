// src/hooks/useCandidateData.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Candidate stage options (Used for both UI and grouping keys)
export const CANDIDATE_STAGES = [
    { value: 'applied', label: 'Applied' },
    { value: 'screen', label: 'Screening' },
    { value: 'tech', label: 'Technical' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
];



// Utility to group a flat array of candidates by their stage.
const groupCandidatesByStage = (candidates) => {
    const groups = CANDIDATE_STAGES.reduce((acc, stage) => {
        acc[stage.value] = [];
        return acc;
    }, {});
    
    if (Array.isArray(candidates)) {
        candidates.forEach(candidate => {
            if (groups.hasOwnProperty(candidate.stage)) {
                groups[candidate.stage].push(candidate);
            }
        });
    }
    return groups;
};


// fetch all jobs to build the job title map and job filter list.
const mapAllJobs = async () => {
    const response = await fetch('/jobs?pageSize=1000&status=active'); 
    if (!response.ok) return { jobTitleMap: {}, jobList: [] };

    const result = await response.json();
    
    const jobTitleMap = result.data.reduce((map, job) => {
        map[job.id] = job.title;
        return map;
    }, {});

    const jobList = [{ id: '', title: 'All Jobs' }, ...result.data.map(job => ({ id: job.id, title: job.title }))];
    return { jobTitleMap, jobList };
};


// Custom hook to fetch and manage the large Candidates list.
export const useCandidateData = (initialParams = {}) => {
    const [jobData, setJobData] = useState({ jobTitleMap: {}, jobList: [] });
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [params, setParams] = useState({
        search: initialParams.search || '', 
        stage: initialParams.stage || '', 
        jobId: initialParams.jobId || '', // Job ID filter parameter
    });


    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Fetch Job Titles and List first (Run only once to populate the filter/map)
            if (Object.keys(jobData.jobTitleMap).length === 0) {
                const fetchedJobData = await mapAllJobs();
                setJobData(fetchedJobData); // Populate jobData state
            }
            
            // 2. Fetch Candidates using ALL active parameters
            const query = new URLSearchParams({ 
                stage: params.stage, 
                search: params.search,
                jobId: params.jobId // <-- INCLUDE jobId IN API CALL
            }).toString();
            
            const url = `/candidates?${query}`; 
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setCandidates(result.data);

        } catch (err) {
            console.error("Error fetching candidates:", err);
            setError('Failed to load candidates. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [params.stage, params.search, params.jobId, jobData.jobTitleMap]); // Added jobId to deps

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    
    const updateParams = useCallback((newParams) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
        }));
    }, []);

    const candidatesByStage = useMemo(() => {
        return groupCandidatesByStage(candidates);
    }, [candidates]);
    
    const handleStageTransition = useCallback(async (candidateId, newStage) => {
        const url = `/candidates/${candidateId}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: newStage }),
        });
        
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Stage transition failed.');
        }

        await fetchCandidates();
    }, [fetchCandidates]);


    return { 
        candidates, 
        candidatesByStage, // Exposed for Kanban board rendering
        loading, 
        error, 
        params, 
        updateParams,
        refetch: fetchCandidates,
        handleStageTransition, // Exposed for Kanban drag-and-drop
        jobTitleMap: jobData.jobTitleMap, // <--- CORRECTLY EXPOSED
        jobList: jobData.jobList,         // <--- CORRECTLY EXPOSED
    };
};