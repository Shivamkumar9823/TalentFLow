// src/utils/assessmentApi.js

/**
 * Saves a new assessment structure or updates an existing one.
 * @param {string} assessmentId - The ID of the assessment (or job ID).
 * @param {object} structure - The complete assessment structure (title, sections, questions).
 * @returns {Promise<boolean>} True on successful save, false otherwise.
 */
export async function saveAssessmentStructure(assessmentId, structure) {
    // This calls the PUT /assessments/:jobId handler
    const url = `/assessments/${assessmentId}`; 

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(structure),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || `Failed to save assessment. Status: ${response.status}`);
        }
        
        console.log(`Assessment ${assessmentId} saved successfully.`);
        return true;

    } catch (error) {
        console.error('Error saving assessment structure:', error);
        alert(`Failed to save assessment template: ${error.message}`);
        return false;
    }
}