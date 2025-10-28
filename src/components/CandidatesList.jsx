// src/components/CandidatesList.jsx (Main Virtualized Component)

import React from 'react';
import { FixedSizeList as List } from 'react-window'; // The main component
import { useCandidateData } from '../hooks/useCandidateData.js'; 
import CandidateRow from './CandidateRow.jsx';

function CandidatesList() {
    const { candidates, loading, error } = useCandidateData(); 

    if (loading) return <div>Loading candidates...</div>;
    if (error) return <div>Error loading list: {error}</div>;

    // Data passed to the row renderer (must be an object)
    const itemData = { candidates };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>Virtualized Candidate List ({candidates.length} visible)</h2>
            
            <div style={{ height: '600px', border: '1px solid #ccc' }}> 
                {/* The List component handles the virtualization
                  height: Total height of the window/viewport.
                  itemCount: Total number of items in the list.
                  itemSize: Height of a single row in pixels (must be fixed for FixedSizeList).
                  itemData: The data object passed to the inner CandidateRow component.
                */}
                <List
                    height={600} 
                    itemCount={candidates.length}
                    itemSize={60} // Assuming each candidate row is 60px tall
                    width={'100%'}
                    itemData={itemData}
                >
                    {CandidateRow}
                </List>
            </div>
        </div>
    );
}

export default CandidatesList;