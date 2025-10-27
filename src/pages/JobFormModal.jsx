// src/components/JobFormModal.jsx

import React, { useState, useEffect } from 'react';
// import './JobFormModal.css'; // <-- Import the new CSS file

// The large modalStyles object is REMOVED from this file

/**
 * Form modal for creating or editing a job.
 * @param {object} props
 * @param {object | null} props.job - The job object to edit, or null for creation.
 * @param {boolean} props.isOpen - Controls the modal visibility.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSubmit - Function to handle the form submission.
 */
const JobFormModal = ({ job, isOpen, onClose, onSubmit }) => {
  const isEdit = !!job;
  const [title, setTitle] = useState(job?.title || '');
  const [tags, setTags] = useState(job?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync internal state when a new job is passed (for edit mode)
  useEffect(() => {
    setTitle(job?.title || '');
    setTags(job?.tags || []);
    setFormError('');
  }, [job]);

  if (!isOpen) return null;

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagAdd = (e) => {
    // Add tag on Enter or Comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Job title is required.'); // Validation: title required
      return;
    }

    setLoading(true);
    
    try {
      const jobData = { title: title.trim(), tags };
      await onSubmit(jobData, isEdit ? job.id : null);
      
      // If submission successful, clear form (for create mode) and close modal
      if (!isEdit) {
        setTitle('');
        setTags([]);
      }
      onClose();

    } catch (error) {
      // Catch errors from the API (like the simulated 500 status)
      setFormError(error.message || 'Submission failed. Please check the network log.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Replaced style={modalStyles.overlay} with className="modal-overlay"
    <div className="modal-overlay" onClick={onClose}>
      {/* Replaced style={modalStyles.content} with className="modal-content" */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{isEdit ? 'Edit Job' : 'Create New Job'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Replaced style={modalStyles.error} with className="form-error" */}
          {formError && <p className="form-error">Error: {formError}</p>}
          
          {/* Title Input (Required) */}
          {/* Replaced style={modalStyles.formGroup} with className="form-group" */}
          <div className="form-group">
            {/* Replaced style={modalStyles.label} with className="form-label" */}
            <label htmlFor="jobTitle" className="form-label">Job Title (Required)</label>
            {/* Replaced style={modalStyles.input} with className="form-input" */}
            <input
              id="jobTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              disabled={loading}
              required
            />
          </div>

          {/* Tags Input */}
          <div className="form-group">
            <label className="form-label">Tags (Separate with Enter/Comma)</label>
            {/* Replaced style={modalStyles.tagList} with className="tag-list" */}
            <div className="tag-list">
              {tags.map(tag => (
                // Replaced style={modalStyles.tagItem} with className="tag-item"
                <span key={tag} className="tag-item">
                  {tag}
                  {/* Replaced style={modalStyles.removeTag} with className="tag-remove" */}
                  <span onClick={() => handleTagRemove(tag)} className="tag-remove">&times;</span>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInput}
              onKeyDown={handleTagAdd}
              placeholder="e.g., React, Node.js"
              // Combined class names
              className="form-input tag-input" 
              disabled={loading}
            />
          </div>

          {/* Button Container */}
          {/* Replaced style={modalStyles.buttonContainer} with className="button-container" */}
          <div className="button-container">
            <button 
              type="button" 
              onClick={onClose} 
              // Combined class names
              className="modal-button secondary-button" 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              // Combined class names
              className="modal-button primary-button" 
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;