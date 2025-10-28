// src/pages/JobDetails.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Link2, TrendingUp, Tag, Calendar, ChevronLeft, AlertCircle, Users, Loader2 } from 'lucide-react';
import { db } from '../db';

// --- Custom Hook to Fetch Single Job ---
const useSingleJob = (jobId) => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        try {
            let jobData;

            if (isDevelopment) {
                // DEV MODE: Use mock API (MSW intercepts)
                const response = await fetch(`/jobs/${jobId}`); 
                jobData = response.ok ? await response.json() : null;
            } else {
                // PRODUCTION MODE: Direct Dexie Read (Needs to be fetched from the DB)
                jobData = await db.jobs.get(jobId);
            }
            
            if (!jobData) throw new Error(`Job ID ${jobId} not found.`);
            
            setJob(jobData);
        } catch (err) {
            console.error(`Error fetching job ${jobId}:`, err);
            setError(`Failed to load job details: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { job, loading, error };
};

// --- Job Details Component ---
function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { job, loading, error } = useSingleJob(jobId);

    // Dynamic style helper
    const getStatusStyle = (status) => 
        status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300';
    
    // --- Rendering Logic ---
    if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin text-amber-500 mx-auto" size={30} /> <p>Loading Job Details...</p></div>;
    if (error) return <div className="max-w-4xl mx-auto mt-8 bg-red-100 p-4 rounded-lg text-red-700">Error: {error}</div>;
    if (!job) return <div className="max-w-4xl mx-auto mt-8 text-center text-red-500">Job not found.</div>;

    return (
        <div className="mt-30 max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-8">
            <button onClick={() => navigate('/jobs')} className="flex items-center text-gray-500 hover:text-amber-600 transition mb-6">
                <ChevronLeft size={20} className="mr-2" /> Back to Jobs Board
            </button>

            <header className="border-b pb-4 mb-6 flex justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-gray-500 flex items-center gap-2 text-sm">
                        <Link2 size={16} /> Slug: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{job.slug}</span>
                    </p>
                </div>
                
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase ${getStatusStyle(job.status)}`}>
                    <TrendingUp size={16} /> {job.status}
                </span>
            </header>

            {/* Job Metadata */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 mb-8">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600">ID</span>
                    <span className="font-mono text-xs">{job.id}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600">Order</span>
                    <span>{job.order}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600">Created</span>
                    <span className="text-xs">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600">Applicants</span>
                    <span>{job.applicants || 0}</span>
                </div>
            </section>

            {/* Tags */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Tag size={18} /> Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {job.tags && job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-300">
                            {tag}
                        </span>
                    ))}
                </div>
            </section>

            {/* Placeholder for Candidates and Assessments linked to this job */}
            <section className="mt-10 pt-4 border-t border-gray-200">
                 <h2 className="text-xl font-bold text-gray-800 mb-3">Linked Resources</h2>
                 <p className="text-gray-600">
                    From here, HR could see candidates who applied and manage the assessment associated with this job.
                 </p>
            </section>
        </div>
    );
}

export default JobDetails;