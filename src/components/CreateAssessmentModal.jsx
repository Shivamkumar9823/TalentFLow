// src/components/CreateAssessmentModal.jsx

import React, { useState } from 'react';
import { X, Briefcase, Clock, FileText, TrendingUp } from 'lucide-react';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) { alert("Title is required."); return; }

    onSubmit({ title, duration, description, difficulty });
    onClose();
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.headerTitle}>Create New Assessment</h2>
          <button onClick={onClose} style={modalStyles.closeButton}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={modalStyles.grid}>
            {/* Title */}
            <div style={modalStyles.fieldGroup}>
              <label style={modalStyles.label}>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assessment title" style={modalStyles.input} required />
            </div>
            {/* Duration */}
            <div style={modalStyles.fieldGroup}>
              <label style={modalStyles.label}>Duration</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 30 minutes" style={modalStyles.input} />
            </div>
          </div>
          
          {/* Description */}
          <div style={{...modalStyles.fieldGroup, marginBottom: '20px'}}>
            <label style={modalStyles.label}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Assessment description" style={modalStyles.textarea} />
          </div>

          {/* Difficulty */}
          <div style={{...modalStyles.fieldGroup, marginBottom: '40px'}}>
            <label style={modalStyles.label}>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={modalStyles.select}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          {/* Questions Placeholder - Matching Screenshot */}
          <div style={modalStyles.questionContainer}>
             <h3 style={{fontWeight: 'bold', fontSize: '1.1em'}}>Questions</h3>
             <button type="button" style={modalStyles.addQuestionButton}>+ Add Question</button>
          </div>
          {/* NOTE: Actual question logic leads to the builder route, not here */}


          <div style={modalStyles.footer}>
            <button type="button" onClick={onClose} style={modalStyles.cancelButton}>Cancel</button>
            <button type="submit" style={modalStyles.createButton}>Create Assessment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;


const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    content: { backgroundColor: 'white', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)', position: 'relative' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '25px' },
    headerTitle: { fontSize: '1.5em', fontWeight: 'bold', color: '#333' },
    closeButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#999' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    fieldGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.9em', fontWeight: 'bold', color: '#555', marginBottom: '5px' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1em' },
    textarea: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1em', minHeight: '80px' },
    select: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1em', backgroundColor: '#fff' },
    questionContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '10px' },
    addQuestionButton: { padding: '8px 15px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9em', fontWeight: '600' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' },
    cancelButton: { padding: '10px 20px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    createButton: { padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};