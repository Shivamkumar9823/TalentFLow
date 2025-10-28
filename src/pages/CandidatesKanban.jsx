import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useCandidateData, CANDIDATE_STAGES } from '../hooks/useCandidateData.js';
import { 
  User, Mail, Briefcase, Calendar, Phone, MapPin, 
  FileText, TrendingUp, Clock, CheckCircle, XCircle, 
  AlertCircle, Target, Sparkles, GripVertical, Filter
} from 'lucide-react';

// --- Stage Configuration with Colors and Icons ---
const STAGE_CONFIG = {
  applied: {
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: FileText,
    lightBg: 'bg-blue-100'
  },
  screen: {
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    icon: Target,
    lightBg: 'bg-purple-100'
  },
  tech: {
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: TrendingUp,
    lightBg: 'bg-amber-100'
  },
  offer: {
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: CheckCircle,
    lightBg: 'bg-emerald-100'
  },
  hired: {
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    icon: Sparkles,
    lightBg: 'bg-green-100'
  },
  rejected: {
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    icon: XCircle,
    lightBg: 'bg-gray-100'
  }
};





// --- Draggable Candidate Card Component ---
const CandidateCard = ({ candidate, index, provided, snapshot, jobTitleMap }) => {
  const [isHovered, setIsHovered] = useState(false);
  const stageConfig = STAGE_CONFIG[candidate.stage] || STAGE_CONFIG.applied;
  const StageIcon = stageConfig.icon;

  // Robust job title lookup with multiple fallbacks
  const getJobTitle = () => {
    if (!candidate.jobId) return 'No Job Assigned';
    
    // Check if jobTitleMap exists and has the jobId
    if (jobTitleMap && typeof jobTitleMap === 'object' && jobTitleMap[candidate.jobId]) {
      return jobTitleMap[candidate.jobId];
    }
    
    // Fallback: return job ID as string if title not found
    // return `Job #${candidate.jobId.slice(0, 8)}`;
  };

  const jobTitle = getJobTitle();
  console.log("CANDIDATE JOB TITLE ::::::",jobTitle);

  return (
    <a
      ref={provided.innerRef}
      {...provided.draggableProps}
      href={`/candidates/${candidate.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        block bg-white rounded-xl p-4 mb-3 border-2 transition-all duration-300 no-underline
        ${snapshot.isDragging 
          ? `shadow-2xl scale-105 rotate-2 ${stageConfig.borderColor} ${stageConfig.bgColor}` 
          : `border-gray-200 hover:border-amber-300 hover:shadow-lg`
        }
        ${isHovered && !snapshot.isDragging ? 'transform -translate-y-1' : ''}
      `}
      style={{
        ...provided.draggableProps.style,
        cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
      }}
    >
      {/* Drag Handle */}
      <div className="flex items-start gap-3">
        <div 
          {...provided.dragHandleProps}
          className={`
            flex-shrink-0 p-1.5 rounded-lg transition-all duration-300
            ${snapshot.isDragging 
              ? `bg-gradient-to-br ${stageConfig.color}` 
              : `bg-gray-100 hover:bg-gradient-to-br hover:${stageConfig.color.replace('from-', 'from-').replace('to-', 'to-')}/20`
            }
          `}
        >
          <GripVertical className={`
            w-4 h-4 transition-colors
            ${snapshot.isDragging ? 'text-white' : 'text-gray-400'}
          `} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Candidate Name */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`
              font-semibold text-base transition-colors
              ${snapshot.isDragging ? stageConfig.textColor : 'text-gray-900'}
            `}>
              {candidate.name || 'Unknown Candidate'}
            </h3>
            <StageIcon className={`
              w-4 h-4 flex-shrink-0 ${stageConfig.textColor}
              ${snapshot.isDragging ? 'animate-bounce' : ''}
            `} />
          </div>

          {/* Email */}
          {candidate.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="truncate">{candidate.email}</span>
            </div>
          )}

          {/* Job Applied For - Always show if jobTitle exists */}
          {jobTitle && (
            <div className={`
              flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-2
              ${stageConfig.lightBg} ${stageConfig.borderColor} border
            `}>
              <Briefcase className={`w-3.5 h-3.5 ${stageConfig.textColor}`} />
              <span className={`text-xs font-medium ${stageConfig.textColor} truncate`}>
                {jobTitle}
              </span>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {candidate.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {candidate.phone}
              </span>
            )}
            {candidate.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {candidate.location}
              </span>
            )}
          </div>

          {/* Applied Date */}
          {candidate.appliedDate && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
              <Calendar className="w-3 h-3" />
              Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Dragging Indicator */}
      {snapshot.isDragging && (
        <div className="absolute -top-2 -right-2">
          <div className={`
            bg-gradient-to-r ${stageConfig.color} text-white text-xs font-bold 
            px-2 py-1 rounded-full shadow-lg animate-pulse
          `}>
            Moving
          </div>
        </div>
      )}
    </a>
  );
};







// --- Kanban Column Component ---
const KanbanColumn = ({ stage, candidates, droppableProvided, snapshot, jobTitleMap }) => {
  const stageConfig = STAGE_CONFIG[stage.value] || STAGE_CONFIG.applied;
  const StageIcon = stageConfig.icon;

  return (
    <div
      ref={droppableProvided.innerRef}
      {...droppableProvided.droppableProps}
      className={`
        flex-shrink-0 w-80 bg-white rounded-xl border-2 transition-all duration-300
        ${snapshot.isDraggingOver 
          ? `${stageConfig.borderColor} ${stageConfig.bgColor} shadow-lg scale-105` 
          : 'border-gray-200'
        }
      `}
    >
      {/* Column Header */}
      <div className={`
        p-4 border-b-2 ${stageConfig.borderColor} 
        bg-gradient-to-r ${stageConfig.color} bg-opacity-10
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`
              p-2 rounded-lg bg-gradient-to-br ${stageConfig.color}
            `}>
              <StageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                {stage.label}
              </h2>
              <p className={`text-xs ${stageConfig.textColor} font-medium`}>
                {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {snapshot.isDraggingOver && (
            <Clock className={`w-5 h-5 ${stageConfig.textColor} animate-spin`} />
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="p-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        {candidates.length === 0 ? (
          <div className={`
            ${stageConfig.bgColor} ${stageConfig.borderColor} border-2 border-dashed 
            rounded-lg p-8 text-center
          `}>
            <StageIcon className={`w-8 h-8 ${stageConfig.textColor} opacity-50 mx-auto mb-2`} />
            <p className={`text-sm ${stageConfig.textColor} opacity-70`}>
              No candidates
            </p>
          </div>
        ) : (
          candidates.map((candidate, index) => (
            <Draggable
              key={candidate.id}
              draggableId={candidate.id}
              index={index}
            >
              {(draggableProvided, snapshot) => (
                <CandidateCard
                  candidate={candidate}
                  index={index}
                  provided={draggableProvided}
                  snapshot={snapshot}
                  jobTitleMap={jobTitleMap}
                />
              )}
            </Draggable>
          ))
        )}
        {droppableProvided.placeholder}
      </div>
    </div>
  );
};




// =================================  Main Kanban Component =======================================
function CandidatesKanban() {
  const hookData = useCandidateData();
  
  // Destructure with safe defaults
  const {
    candidatesByStage = {},
    loading = false,
    error = null,
    handleStageTransition = () => {},
    refetch = () => {},
    jobTitleMap = {},
    jobList = [],
    updateParams = () => {},
    params = {}
  } = hookData || {};

  // Local state for selected job filter
  const [selectedJobId, setSelectedJobId] = useState('');

  const stages = CANDIDATE_STAGES || [];

  // Debug logging for production
  useEffect(() => {
    console.log('🔍 CandidatesKanban Debug:', {
      candidatesByStageKeys: Object.keys(candidatesByStage),
      jobTitleMapKeys: Object.keys(jobTitleMap),
      jobListLength: jobList?.length,
      hasJobTitleMap: !!jobTitleMap,
      jobTitleMapType: typeof jobTitleMap,
      firstCandidate: candidatesByStage && Object.values(candidatesByStage)[0]?.[0]
    });
  }, [candidatesByStage, jobTitleMap, jobList]);

console.log("JOB LIST :::::::::::",jobList);



  // Filter candidates by selected job
  const filteredCandidatesByStage = useMemo(() => {
    if (!candidatesByStage || typeof candidatesByStage !== 'object') {
      console.warn('⚠️ candidatesByStage is invalid:', candidatesByStage);
      return {};
    }
    
    // If no job is selected, return all candidates
    if (!selectedJobId || selectedJobId === '') {
      return candidatesByStage;
    }


    // Filter candidates for the selected job across all stages
    const filtered = {};
    Object.keys(candidatesByStage).forEach(stage => {
      const stageCandidates = candidatesByStage[stage];
      if (Array.isArray(stageCandidates)) {
        filtered[stage] = stageCandidates.filter(
          candidate => candidate && candidate.jobId === selectedJobId
        );
      } else {
        filtered[stage] = [];
      }
    });
    
    return filtered;
  }, [candidatesByStage, selectedJobId]);







  // Calculate total candidates based on filtered data
  const totalCandidates = Object.values(filteredCandidatesByStage).reduce(
    (sum, candidates) => sum + (Array.isArray(candidates) ? candidates.length : 0), 
    0
  );

  // Only show stages that have candidates when filtering
  const stagesToRender = selectedJobId && selectedJobId !== ''
    ? stages.filter(stage => {
        const stageValue = stage?.value;
        return stageValue && (filteredCandidatesByStage[stageValue]?.length || 0) > 0;
      })
    : stages;



  const handleJobFilterChange = (e) => {
    const newJobId = e.target.value;
    // console.log("JOB IDDDDDDDDDDDDDD :",newJobId)
    console.log('🔄 Job filter changed to:', newJobId);
    setSelectedJobId(newJobId);
  };



  
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId: candidateId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    const newStage = destination.droppableId;

    try {
      await handleStageTransition(candidateId, newStage);
    } catch (err) {
      console.error('Kanban transition failed:', err);
      alert('Stage transition failed: ' + (err.message || 'Network Error') + '\nRolling back UI to show stable state.');
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Candidate Pipeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-bold mb-1">Error Loading Board</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get selected job title for display with safe fallback
  const selectedJobTitle = selectedJobId && jobTitleMap && jobTitleMap[selectedJobId]
    ? jobTitleMap[selectedJobId]
    : null;

  // Safe job list with validation
  const safeJobList = Array.isArray(jobList) ? jobList.filter(job => job && job.id) : [];
  console.log("SAFE JOB LIST :::::::::::",safeJobList);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Candidate Pipeline
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                {totalCandidates} {selectedJobTitle ? `Candidate${totalCandidates !== 1 ? 's' : ''} for ${selectedJobTitle}` : 'Total Candidates in Pipeline'}
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <div>
                <p className="font-semibold mb-1">Drag & Drop to Update Stage</p>
                <p className="text-sm text-purple-100">
                  Move candidates between stages to track their progress through your hiring pipeline
                </p>
              </div>
            </div>
          </div>




          {/* Job Filter Dropdown */}
          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Filter className="w-5 h-5 text-purple-600" />
                <label htmlFor="job-filter">Filter by Job Role:</label>
              </div>
              
              <select
                id="job-filter"
                value={selectedJobId}
                onChange={handleJobFilterChange}
                className=" w-full flex-1 p-3 border-2 border-gray-900 rounded-lg shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-900 font-medium cursor-pointer"
                disabled={loading || safeJobList.length === 0}
              >
                <option value="">
                  All Jobs ({Object.values(candidatesByStage).reduce((sum, c) => sum + (Array.isArray(c) ? c.length : 0), 0)} candidates)
                </option>




                {safeJobList.map(job => {
                  // Count candidates for this specific job
                  const jobCandidateCount = Object.values(candidatesByStage).reduce(
                    (sum, candidates) => {
                      if (!Array.isArray(candidates)) return sum;
                      return sum + candidates.filter(c => c && c.jobId === job.id).length;
                    }, 
                    0
                  );
                  return (
                    <option key={job.id} value={job.id}>
                      {job.title || job.id} ({jobCandidateCount} candidate{jobCandidateCount !== 1 ? 's' : ''})
                    </option>
                  );
                })} 
              </select>


            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stagesToRender.map(stage => (
              <Droppable key={stage.value} droppableId={stage.value}>
                {(droppableProvided, snapshot) => (
                  <KanbanColumn
                    stage={stage}
                    candidates={filteredCandidatesByStage[stage.value] || []}
                    droppableProvided={droppableProvided}
                    snapshot={snapshot}
                    jobTitleMap={jobTitleMap}
                  />
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Empty State when filtering */}
        {selectedJobId && totalCandidates === 0 && (
          <div className="mt-8 bg-white rounded-xl p-12 text-center shadow-md border-2 border-gray-200">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Candidates Found</h3>
            <p className="text-gray-600 mb-4">
              There are no candidates for <strong>{selectedJobTitle || 'this job'}</strong> yet.
            </p>
            <button
              onClick={() => setSelectedJobId('')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              View All Candidates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidatesKanban;