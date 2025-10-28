// src/components/CandidateRow.jsx (New Component)

import React from 'react';
// Assuming this is styled with Tailwind classes or CSS

const CandidateRow = ({ index, style, data }) => {
    // data is the 'itemData' prop passed to the List component (our candidates array)
    const candidates = data.candidates;
    const candidate = candidates[index];

    // CRITICAL: Apply the required style prop for positioning
    return (
        <a 
            href={`/candidates/${candidate.id}`} 
            style={style} 
            className="candidate-row-style" // Use your actual styling class
        >
            <div className="candidate-name">{candidate.name}</div>
            <div className="candidate-email">{candidate.email}</div>
            {/* ... (rest of candidate details) ... */}
        </a>
    );
};
export default CandidateRow;