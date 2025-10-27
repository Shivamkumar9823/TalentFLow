// src/components/AssessmentBuilder.jsx (Updated to match the final design)

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentBuilder } from '../hooks/useAssessmentBuilder.js';
import CreateAssessmentModal from '../components/CreateAssessmentModal.jsx'; // <-- NEW Import
import { 
    Trash2, Edit, CheckSquare, Briefcase, FileText, Target, // <-- MAKE SURE 'Target' IS HERE!
    TrendingUp, Sparkles, AlertCircle, Calendar, XCircle, User, Zap , Clock
} from 'lucide-react';

// --- 1. SAMPLE ASSESSMENT DATA DEFINITION (UI Fields Only) ---

const EXTERNAL_ASSESSMENTS_UI = [
  {
    id: 'sample-1', title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals including variables, scope, closures, and arrays.",
    duration: "20 minutes", difficulty: "Beginner",
    questionCount: 11, color: "#3B82F6", icon: FileText
  },
  {
    id: 'sample-2', title: "React Fundamentals",
    description: "Core React, hooks, component patterns, and rendering performance.",
    duration: "30 minutes", difficulty: "Intermediate",
    questionCount: 11, color: "#6366F1", icon: TrendingUp
  },
  {
    id: 'sample-3', title: "Data Structures & Algorithms",
    description: "Essential data structures, algorithmic paradigms, and complexity analysis.",
    duration: "45 minutes", difficulty: "Advanced",
    questionCount: 11, color: "#F59E0B", icon: Target
  },
  {
    id: 'sample-4', title: "System Design Principles",
    description: "Design scalable, resilient systems. Caching, queues, replication, and consistency.",
    duration: "60 minutes", difficulty: "Expert",
    questionCount: 11, color: "#EF4444", icon: Briefcase
  },
];


// --- 2. ASSESSMENT CARD COMPONENT ---

const AssessmentCard = ({ assessment, onStart, onEdit }) => {
  const IconComponent = assessment.icon;

  return (
    <div style={cardStyles.card}>
      <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
        <div style={{...cardStyles.iconWrapper, backgroundColor: assessment.color}}>
          <IconComponent size={24} style={{color: 'white'}} />
        </div>
        <h3 style={cardStyles.title}>{assessment.title}</h3>
      </div>
      <p style={cardStyles.description}>{assessment.description}</p>
      
      <div style={cardStyles.metaContainer}>
        <div style={cardStyles.metaItem}>
          <FileText size={14} style={cardStyles.metaIcon} />
          {assessment.questionCount} Questions
        </div>
        <div style={cardStyles.metaItem}>
          <Clock size={14} style={cardStyles.metaIcon} />
          {assessment.duration}
        </div>
        <div style={{...cardStyles.metaItem, ...cardStyles.difficultyBadge, backgroundColor: assessment.color + '20', borderColor: assessment.color, color: assessment.color}}>
          {assessment.difficulty}
        </div>
      </div>

      <div style={cardStyles.buttonContainer}>
        <button onClick={() => onStart(assessment.id)} style={cardStyles.startButton}>
          Start
        </button>
        <button onClick={() => onEdit(assessment.id)} style={cardStyles.editButton}>
          <Edit size={16} />
        </button>
      </div>
    </div>
  );
};


// --- 3. MAIN ASSESSMENT PAGE COMPONENT ---

function AssessmentBuilder() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NOTE: For the new UI, we assume the initial 'Assessment' route is the selector.
  // The actual builder is loaded on a sub-route (e.g., /assessments/builder/:jobId)
  
  const handleStartAssessment = (assessmentId) => {
    // This would typically go to the candidate form runtime, not the builder
    alert(`Starting Assessment: ${assessmentId}`); 
  };
  
  const handleEditAssessment = (assessmentId) => {
    // Navigate to the actual builder view for the selected assessment/job
    navigate(`/assessments/builder/${assessmentId}`); 
  };

  const handleCreateNewMetadata = (metadata) => {
    // 1. In a real app, this would generate a new jobId and save the metadata
    console.log('New Assessment Metadata:', metadata);
    const newJobId = 'new-job-' + Date.now(); // Placeholder ID
    
    // 2. Navigate to the builder to add sections/questions for this new job/assessment
    navigate(`/assessments/builder/${newJobId}`); 
  };
  
  // --- RENDER LOGIC ---

  return (
    <div style={mainStyles.wrapper}>
      <div style={mainStyles.header}>
        <h1 style={mainStyles.title}>Assessments</h1>
        <p style={mainStyles.subtitle}>Choose an assessment to test your skills</p>
      </div>

      <button onClick={() => setIsModalOpen(true)} style={mainStyles.createButton}>
        + Create New Assessment
      </button>

      <div style={mainStyles.cardGrid}>
        {EXTERNAL_ASSESSMENTS_UI.map(assessment => (
          <AssessmentCard 
            key={assessment.id}
            assessment={assessment}
            onStart={handleStartAssessment}
            onEdit={handleEditAssessment}
          />
        ))}
      </div>

      <CreateAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNewMetadata}
      />
    </div>
  );
}

export default AssessmentBuilder;


// --- 4. INLINE STYLES FOR THE ASSESSMENT PAGE ---

const mainStyles = {
  wrapper: { background: 'linear-gradient(to right bottom, #f0f0ff, #f8f8ff)', minHeight: '100vh', padding: '50px 20px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.5em', fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: '1.1em', color: '#777' },
  createButton: { 
    display: 'block', 
    margin: '0 auto 40px', 
    padding: '12px 30px', 
    backgroundColor: '#3B82F6', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontSize: '1em', 
    fontWeight: '600', 
    cursor: 'pointer' 
  },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1400px', margin: '0 auto' }
};

const cardStyles = {
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'pointer' },
  iconWrapper: { borderRadius: '10px', padding: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '1.4em', fontWeight: 'bold', color: '#333' },
  description: { color: '#777', fontSize: '0.9em', marginTop: '10px', marginBottom: '20px', flexGrow: 1 },
  metaContainer: { display: 'flex', gap: '15px', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px', marginTop: 'auto' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '5px', color: '#555', fontSize: '0.85em' },
  metaIcon: { color: '#999' },
  difficultyBadge: { padding: '4px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.75em' },
  buttonContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
  startButton: { padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' },
  editButton: { padding: '10px 15px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};