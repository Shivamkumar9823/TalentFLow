// src/components/JobFormModal.jsx

import React, { useState, useEffect } from 'react';
// import './JobFormModal.css'; 

const JobFormModal = ({ job, isOpen, onClose, onSubmit }) => {
  const isEdit = !!job;
  const [title, setTitle] = useState(job?.title || '');
  const [tags, setTags] = useState(job?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(job?.title || '');
    setTags(job?.tags || []);
    setFormError('');
  }, [job]);

  if (!isOpen) return null;

  const handleTagAdd = (e) => {
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
      setFormError('Job title is required.');
      return;
    }

    setLoading(true);
    
    try {
      const jobData = { title: title.trim(), tags };
      await onSubmit(jobData, isEdit ? job.id : null);
      
      if (!isEdit) {
        setTitle('');
        setTags([]);
      }
      onClose();

    } catch (error) {
      setFormError(error.message || 'Submission failed. Please check the network log.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{isEdit ? 'Edit Job' : 'Create New Job'}</h2>
        
        <form onSubmit={handleSubmit}>
          {formError && <p className="form-error">Error: {formError}</p>}
          
          <div className="form-group">
            <label htmlFor="jobTitle" className="form-label">Job Title (Required)</label>
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

          <div className="form-group">
            <label className="form-label">Tags (Separate with Enter/Comma)</label>
            <div className="tag-list">
              {tags.map(tag => (
                <span key={tag} className="tag-item">
                  {tag}
                  <span onClick={() => handleTagRemove(tag)} className="tag-remove">&times;</span>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="e.g., React, Node.js"
              className="form-input tag-input" 
              disabled={loading}
            />
          </div>

          <div className="button-container">
            <button 
              type="button" 
              onClick={onClose} 
              className="modal-button secondary-button" 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
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