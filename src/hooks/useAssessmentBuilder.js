// src/hooks/useAssessmentBuilder.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { faker } from '@faker-js/faker';

// Defines the available question types
export const QUESTION_TYPES = [
    'single-choice', 
    'multi-choice', 
    'short text', 
    'long text', 
    'numeric with range', 
    'file upload stub'
];

// Default initial structure
const initialStructure = {
    title: "New Job Assessment",
    sections: [],
};

// Helper to create initial question data with defaults
const getInitialQuestionData = (type, label) => ({
    id: faker.string.uuid(),
    type: type,
    label: label,
    required: false,
    condition: null, 
    range: (type === 'numeric with range') ? { min: 0, max: 100 } : undefined,
    options: (type === 'single-choice' || type === 'multi-choice') ? ['Option 1', 'Option 2'] : undefined,
});

export const useAssessmentBuilder = (jobId) => {
    const [structure, setStructure] = useState(initialStructure);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); 

    // --- API Interactions ---

    const fetchStructure = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/assessments/${jobId}`);
            if (!response.ok) throw new Error('Failed to load assessment.');
            
            const data = await response.json();
            setStructure(data || initialStructure);
        } catch (err) {
            setError(err.message);
            setStructure(initialStructure);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    const saveStructure = useCallback(async (currentStructure) => {
        setSaveStatus('saving');
        try {
            const response = await fetch(`/assessments/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentStructure),
            });
            
            if (!response.ok) throw new Error('Failed to save assessment structure.');
            
            setSaveStatus('saved');
            return true;
        } catch (err) {
            setError(err.message);
            setSaveStatus('error');
            return false;
        } finally {
            setTimeout(() => setSaveStatus(null), 3000); 
        }
    }, [jobId]);

    useEffect(() => {
        if (jobId) {
            fetchStructure();
        }
    }, [jobId, fetchStructure]);

    // --- Structure Modification ---

    const updateAssessment = useCallback((newStructure, shouldSave = true) => {
        setStructure(newStructure);
        if (shouldSave) {
            saveStructure(newStructure);
        }
    }, [saveStructure]);


    const updateQuestion = useCallback((sectionId, updatedQuestion) => {
        const newSections = structure.sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    questions: section.questions.map(q => 
                        q.id === updatedQuestion.id ? updatedQuestion : q
                    )
                };
            }
            return section;
        });

        const newStructure = { ...structure, sections: newSections };
        updateAssessment(newStructure);
    }, [structure, updateAssessment]);
    
    const deleteQuestion = useCallback((sectionId, questionId) => {
        const newSections = structure.sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    questions: section.questions.filter(q => q.id !== questionId)
                };
            }
            return section;
        });

        const newStructure = { ...structure, sections: newSections };
        updateAssessment(newStructure);
    }, [structure, updateAssessment]);

    const addSection = () => {
        const newSection = {
            id: faker.string.uuid(),
            title: `New Section ${structure.sections.length + 1}`,
            questions: []
        };
        const newStructure = {
            ...structure,
            sections: [...structure.sections, newSection]
        };
        updateAssessment(newStructure);
    };

    const addQuestion = (sectionId, type) => {
        const newQuestion = getInitialQuestionData(type, `New ${type} Question`);

        const newSections = structure.sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    questions: [...section.questions, newQuestion]
                };
            }
            return section;
        });

        const newStructure = { ...structure, sections: newSections };
        updateAssessment(newStructure);
    };

    return {
        structure,
        loading,
        error,
        saveStatus,
        updateAssessment,
        addSection,
        addQuestion,
        updateQuestion, 
        deleteQuestion, 
        saveStructure: () => saveStructure(structure) 
    };
};