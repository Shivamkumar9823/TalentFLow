import React, { useState } from 'react';
import { useJobData } from '../hooks/useJobData.js';
import JobFormModal from '../components/JobFormModal.jsx';
import JobItem from '../components/JobItem.jsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Plus, Filter, Briefcase, AlertCircle, ChevronLeft, ChevronRight, TrendingUp, Users } from 'lucide-react';

// --- Utility Functions ---
const saveJob = async (jobData, jobId) => {
  const url = jobId ? `/jobs/${jobId}` : '/jobs';
  const method = jobId ? 'PATCH' : 'POST';

  const response = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to save job. Status: ${response.status}`);
  }
  return await response.json();
};

// --- Main JobsBoard Component ---
function JobsBoard() {
  const {
    jobs,
    meta,
    loading,
    error,
    params,
    updateParams,
    refetch,
    handleOptimisticReorder,
  } = useJobData();

  // Local state for UI interactions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  // --- Reordering Logic ---
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const success = await handleOptimisticReorder(draggableId, source.index, destination.index);

    if (!success) {
      setGlobalError(error || 'Reordering failed due to a network error. Rollback complete.');
    } else {
      setGlobalError(null);
    }
  };

  // --- CRUD Handlers ---
  const handleCreateOrEditJob = async (jobData, jobId) => {
    setGlobalError(null);
    try {
      await saveJob(jobData, jobId);

      if (!jobId) {
        updateParams({ page: 1, search: '', status: 'active' });
      } else {
        refetch();
      }
    } catch (err) {
      throw err;
    }
  };
// src/components/JobsBoard.jsx (Inside JobsBoard function)

  const handleArchive = async (jobId, newStatus) => {
    setGlobalError(null);
    const action = newStatus === 'archived' ? 'Archive' : 'Unarchive';

    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this job?`)) {
      return;
    }

    try {
      // FIX: CRITICAL - Call the utility to send the PATCH request to the mock API
      await saveJob({ status: newStatus }, jobId); 
      
      // On successful API response, refetch the data to update the list
      refetch(); 
    } catch (err) {
      // Handle simulated 500 errors or network failures
      setGlobalError(`${action} failed: ${err.message}`);
    }
  };

  // --- Modal and Filter Handlers ---
  const handleOpenCreate = () => { setEditingJob(null); setIsModalOpen(true); };
  const handleOpenEdit = (job) => { setEditingJob(job); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingJob(null); setGlobalError(null); };

  const handlePageChange = (newPage) => { 
    console.log('Changing to page:', newPage); // Debug log
    updateParams({ page: newPage }); 
  };
  const handleSearchChange = (e) => { updateParams({ search: e.target.value, page: 1 }); };
  const handleStatusFilterChange = (e) => { updateParams({ status: e.target.value, page: 1 }); };

  // --- Rendering Logic ---
  const isReorderingDisabled = loading || params.search || params.status || meta.totalPages > 1;

  // Calculate stats
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);

  // Display error from initial fetch/hook
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-6 h-6" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Jobs Board
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {meta.total} Total Jobs • {activeJobs} Active
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              Create Job
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Positions</p>
                  <p className="text-2xl font-bold text-gray-900">{meta.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                  <p className="text-2xl font-bold text-green-600">{activeJobs}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
                  <p className="text-2xl font-bold text-amber-600">{totalApplicants}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Global Error Display */}
          {globalError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{globalError}</p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Title or Tag..."
                  value={params.search}
                  onChange={handleSearchChange}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={params.status}
                  onChange={handleStatusFilterChange}
                  disabled={loading}
                  className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-[160px] disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reorder Info Banner - Only show when reordering is disabled */}
          {isReorderingDisabled && meta.totalPages > 1 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Drag & drop reordering is disabled when using pagination, search, or filters. 
                View all jobs on a single page to enable reordering.
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Jobs List with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="jobs-list" isDropDisabled={isReorderingDisabled}>
            {(droppableProvided) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className="space-y-3 min-h-[400px]"
              >
                {!loading && jobs.length === 0 && (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or create a new job posting</p>
                    <button
                      onClick={handleOpenCreate}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                    >
                      <Plus className="w-5 h-5" />
                      Create First Job
                    </button>
                  </div>
                )}

                {jobs.map((job, index) => (
                  <Draggable
                    key={job.id}
                    draggableId={job.id}
                    index={index}
                    isDragDisabled={isReorderingDisabled}
                  >
                    {(draggableProvided, snapshot) => (
                      <JobItem
                        job={job}
                        onEdit={handleOpenEdit}
                        onArchive={handleArchive}
                        provided={draggableProvided}
                        snapshot={snapshot}
                      />
                    )}
                  </Draggable>
                ))}

                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Pagination Controls - ALWAYS SHOW if there are multiple pages */}
        {meta.totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl p-4 shadow-lg border-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(params.page - 1)}
                disabled={params.page === 1 || loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 transition-all shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {/* Page Info */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page</span>
                <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold shadow-md">
                  {meta.page}
                </span>
                <span className="text-sm text-gray-600">of</span>
                <span className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-bold">
                  {meta.totalPages}
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(params.page + 1)}
                disabled={params.page === meta.totalPages || loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 transition-all shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Page Counter Text */}
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-500">
                Showing {((params.page - 1) * (meta.pageSize || 10)) + 1} - {Math.min(params.page * (meta.pageSize || 10), meta.total)} of {meta.total} jobs
              </span>
            </div>
          </div>
        )}

        {/* Debug Info (Remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs font-mono">
            <div>Current Page: {params.page}</div>
            <div>Total Pages: {meta.totalPages}</div>
            <div>Total Jobs: {meta.total}</div>
            <div>Jobs on Page: {jobs.length}</div>
          </div>
        )}

        {/* Job Creation/Editing Modal */}
        <JobFormModal
          job={editingJob}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateOrEditJob}
        />
      </div>
    </div>
  );
}

export default JobsBoard;