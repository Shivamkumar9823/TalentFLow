// src/components/CandidatesList.jsx
import React from 'react';
// import { FixedSizeList } from 'react-window';
import { useCandidateData, CANDIDATE_STAGES } from '../hooks/useCandidateData.js';
// import './CandidatesList.css';

// --- Stage Colors Utility ---
const STAGE_CLASSES = {
    applied: 'stage-applied',
    screen: 'stage-screen',
    tech: 'stage-tech',
    offer: 'stage-offer',
    hired: 'stage-hired',
    rejected: 'stage-rejected',
};

// --- Row Renderer for Virtualized List ---
const CandidateRow = ({ index, style, data }) => {
    const candidate = data.candidates[index];

    // Style is required by react-window to position the item
    return (
        <a 
            href={`/candidates/${candidate.id}`} // Deep link requirement
            style={style} 
            className="candidate-row"
        >
            <div className="candidate-info">
                <div className="candidate-name">{candidate.name}</div>
                <div className="candidate-email">{candidate.email}</div>
            </div>
            <div className={`candidate-stage ${STAGE_CLASSES[candidate.stage]}`}>
                {CANDIDATE_STAGES.find(s => s.value === candidate.stage)?.label || 'N/A'}
            </div>
        </a>
    );
};


// --- Main Candidates List Component ---
function CandidatesList() {
    const { candidates, loading, error, params, updateParams } = useCandidateData();

    const handleSearchChange = (e) => {
        updateParams({ search: e.target.value });
    };

    const handleStageFilterChange = (e) => {
        updateParams({ stage: e.target.value });
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Pass the candidates array and count to the virtualized list
    const listData = { candidates };
    const itemCount = candidates.length;

    return (
        <div className="candidates-container">
            <h1 className="candidates-header">
                Candidates Management ({itemCount} Visible)
            </h1>

            {/* Filter/Search Controls */}
            <div className="controls-container">
                <input 
                    type="text" 
                    placeholder="Search by Name or Email..." 
                    value={params.search} 
                    onChange={handleSearchChange}
                    className="search-input"
                    disabled={loading}
                />
                <select 
                    value={params.stage} 
                    onChange={handleStageFilterChange} 
                    className="select-input"
                    disabled={loading}
                >
                    {CANDIDATE_STAGES.map(stage => (
                        <option key={stage.value} value={stage.value}>
                            {stage.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <div className="loading-message">Loading 1000+ candidates...</div>}

            {/* Virtualized List Wrapper */}
            {!loading && (
                <div className="list-wrapper">
                    {itemCount === 0 ? (
                        <div className="loading-message">No candidates match the current filters.</div>
                    ) : (
                        <List
                            height={600} // Fixed height for the viewport
                            itemCount={itemCount}
                            itemSize={60} // Fixed height for each row
                            width={'100%'}
                            itemData={listData}
                        >
                            {CandidateRow}
                        </List>
                    )}
                </div>
            )}
        </div>
    );
}

export default CandidatesList;