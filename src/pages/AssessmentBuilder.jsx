import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, Edit, Eye, Plus, Target, TrendingUp, 
  Briefcase, Brain, Sparkles, Award, CheckCircle, Zap, Trash2,
  Save, X, ChevronDown, ChevronUp, GripVertical, ArrowLeft
} from 'lucide-react';

// ============================================================================
// MOCK DATA AND INDEXEDDB HELPER
// ============================================================================

const INITIAL_ASSESSMENTS = [
  {
    id: 'sample-1',
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals",
    duration: "20 minutes",
    difficulty: "Beginner",
    gradient: "from-blue-500 to-cyan-500",
    icon: 'FileText',
    questions: [
      { id: 'q1', type: 'single-choice', question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'const'], correctAnswer: 1 },
      { id: 'q2', type: 'multi-choice', question: 'Select all semantic HTML5 elements:', options: ['<article>', '<div>', '<section>', '<header>'], correctAnswer: [0, 2, 3] },
      { id: 'q3', type: 'text', question: 'Explain closures in JavaScript', correctAnswer: '' },
    ]
  },
  {
    id: 'sample-2',
    title: "React Fundamentals",
    description: "Core React and hooks knowledge",
    duration: "30 minutes",
    difficulty: "Intermediate",
    gradient: "from-purple-500 to-pink-500",
    icon: 'TrendingUp',
    questions: [
      { id: 'q1', type: 'single-choice', question: 'Which hook manages state?', options: ['useMemo', 'useState', 'useEffect', 'useRef'], correctAnswer: 1 },
      { id: 'q2', type: 'multi-choice', question: 'Valid React hooks?', options: ['useState', 'useEffect', 'useRouter', 'useContext'], correctAnswer: [0, 1, 3] },
    ]
  },
];

// Simple localStorage for demo (IndexedDB)
const saveAssessments = (assessments) => {
  localStorage.setItem('talentflow_assessments', JSON.stringify(assessments));
};

const loadAssessments = () => {
  const stored = localStorage.getItem('talentflow_assessments');
  return stored ? JSON.parse(stored) : INITIAL_ASSESSMENTS;
};

const getIconComponent = (iconName) => {
  const icons = { FileText, TrendingUp, Target, Briefcase, Brain };
  return icons[iconName] || FileText;
};

// ============================================================================
// MAIN ASSESSMENT LIST PAGE
// ============================================================================

function AssessmentBuilder() {
  const [assessments, setAssessments] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'preview' | 'edit' | 'create'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAssessments(loadAssessments());
  }, []);

  const handlePreview = (id) => {
    const assessment = assessments.find(a => a.id === id);
    setSelectedAssessment(assessment);
    setCurrentView('preview');
  };

  const handleEdit = (id) => {
    const assessment = assessments.find(a => a.id === id);
    setSelectedAssessment(assessment);
    setCurrentView('edit');
  };

  const handleCreateNew = (metadata) => {
    const newAssessment = {
      ...metadata,
      id: 'custom-' + Date.now(),
      gradient: 'from-green-500 to-emerald-500',
      icon: 'Brain',
      questions: []
    };
    setSelectedAssessment(newAssessment);
    setIsModalOpen(false);
    setCurrentView('create');
  };

  const handleSaveAssessment = (updatedAssessment) => {
    const newAssessments = assessments.some(a => a.id === updatedAssessment.id)
      ? assessments.map(a => a.id === updatedAssessment.id ? updatedAssessment : a)
      : [...assessments, updatedAssessment];
    
    setAssessments(newAssessments);
    saveAssessments(newAssessments);
    setCurrentView('list');
    setSelectedAssessment(null);
  };

  const handleDeleteAssessment = (id) => {
    if (window.confirm('Delete this assessment?')) {
      const newAssessments = assessments.filter(a => a.id !== id);
      setAssessments(newAssessments);
      saveAssessments(newAssessments);
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedAssessment(null);
  };

  // Render different views
  if (currentView === 'preview') {
    return <AssessmentPreview assessment={selectedAssessment} onBack={handleBack} onEdit={() => setCurrentView('edit')} />;
  }

  if (currentView === 'edit' || currentView === 'create') {
    return <AssessmentEditor assessment={selectedAssessment} onSave={handleSaveAssessment} onBack={handleBack} />;
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-2xl mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Assessments</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, manage, and preview skill assessments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-4 text-center border-2 border-blue-100">
            <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
            <p className="text-sm text-gray-600">Assessments</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border-2 border-purple-100">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {assessments.reduce((sum, a) => sum + (a.questions?.length || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Questions</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border-2 border-amber-100">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{assessments.length * 30}m</p>
            <p className="text-sm text-gray-600">Total Time</p>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all mb-12"
        >
          <Plus className="w-6 h-6" />
          Create New Assessment
        </button>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map(assessment => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDeleteAssessment}
            />
          ))}
        </div>

        <CreateAssessmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateNew}
        />
      </div>
    </div>
  );
}

// ============================================================================
// ASSESSMENT CARD COMPONENT
// ============================================================================

const AssessmentCard = ({ assessment, onPreview, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getIconComponent(assessment.icon);

  const difficultyColors = {
    Beginner: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    Intermediate: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    Advanced: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    Expert: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  };

  const diffStyle = difficultyColors[assessment.difficulty] || difficultyColors.Beginner;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-2xl p-6 border-2 border-gray-200 transition-all duration-300 transform ${
        isHovered ? 'shadow-2xl -translate-y-2 border-amber-300' : 'shadow-md'
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${assessment.gradient} transition-transform duration-300 ${
          isHovered ? 'scale-110 rotate-3' : ''
        }`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-xl font-bold text-gray-900 mb-2 transition-colors ${
            isHovered ? 'text-amber-600' : ''
          }`}>
            {assessment.title}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${diffStyle.bg} ${diffStyle.text} border-2 ${diffStyle.border}`}>
            {assessment.difficulty}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assessment.description}</p>

      <div className="flex items-center gap-4 py-3 mb-4 border-t border-b border-gray-200">
        <span className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          {assessment.questions?.length || 0} Questions
        </span>
        <span className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {assessment.duration}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onPreview(assessment.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Eye className="w-5 h-5" />
          Preview
        </button>
        <button
          onClick={() => onEdit(assessment.id)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(assessment.id)}
          className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CREATE ASSESSMENT MODAL
// ============================================================================

const CreateAssessmentModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '30 minutes',
    difficulty: 'Intermediate'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ title: '', description: '', duration: '30 minutes', difficulty: 'Intermediate' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Assessment</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Python Developer Assessment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Brief description..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="30 minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg"
            >
              Create & Add Questions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// ASSESSMENT PREVIEW PAGE
// ============================================================================

const AssessmentPreview = ({ assessment, onBack, onEdit }) => {
  const IconComponent = getIconComponent(assessment.icon);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Assessments
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-4 rounded-xl bg-gradient-to-br ${assessment.gradient}`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assessment.title}</h1>
              <p className="text-gray-600">{assessment.description}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <span className="flex items-center gap-2 text-gray-700">
              <FileText className="w-5 h-5" />
              <strong>{assessment.questions?.length || 0} Questions</strong>
            </span>
            <span className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <strong>{assessment.duration}</strong>
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              assessment.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
              assessment.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
              assessment.difficulty === 'Advanced' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {assessment.difficulty}
            </span>
          </div>
        </div>

        {/* Questions */}
        {(!assessment.questions || assessment.questions.length === 0) ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Yet</h3>
            <p className="text-gray-600 mb-6">Start building this assessment by adding questions</p>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Questions
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assessment.questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{q.question}</h3>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {q.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {q.options && (
                  <div className="space-y-2 ml-11">
                    {q.options.map((opt, i) => {
                      const isCorrect = Array.isArray(q.correctAnswer) 
                        ? q.correctAnswer.includes(i) 
                        : q.correctAnswer === i;
                      
                      return (
                        <div
                          key={i}
                          className={`p-3 border-2 rounded-lg ${
                            isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type={q.type === 'multi-choice' ? 'checkbox' : 'radio'}
                              checked={isCorrect}
                              disabled
                              className="w-4 h-4"
                            />
                            <span className="text-gray-800">{opt}</span>
                            {isCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === 'text' && (
                  <div className="ml-11">
                    <textarea
                      disabled
                      placeholder="Text answer area..."
                      className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                      rows="4"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Edit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <Edit className="w-6 h-6" />
            Edit This Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ASSESSMENT EDITOR PAGE
// ============================================================================

const AssessmentEditor = ({ assessment, onSave, onBack }) => {
  const [editedAssessment, setEditedAssessment] = useState(assessment);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: 'q-' + Date.now(),
      type: 'single-choice',
      question: '',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0
    };
    setEditedAssessment({
      ...editedAssessment,
      questions: [...(editedAssessment.questions || []), newQuestion]
    });
    setEditingQuestionId(newQuestion.id);
  };

  const handleUpdateQuestion = (questionId, updates) => {
    setEditedAssessment({
      ...editedAssessment,
      questions: editedAssessment.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Delete this question?')) {
      setEditedAssessment({
        ...editedAssessment,
        questions: editedAssessment.questions.filter(q => q.id !== questionId)
      });
    }
  };

  const handleSave = () => {
    onSave(editedAssessment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="w-5 h-5" />
            Save Assessment
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={editedAssessment.title}
                onChange={(e) => setEditedAssessment({ ...editedAssessment, title: e.target.value })}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full text-gray-900"
                placeholder="Assessment Title"
              />
              <input
                type="text"
                value={editedAssessment.description}
                onChange={(e) => setEditedAssessment({ ...editedAssessment, description: e.target.value })}
                className="text-gray-600 bg-transparent border-none focus:outline-none w-full mt-1"
                placeholder="Description"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={editedAssessment.duration}
              onChange={(e) => setEditedAssessment({ ...editedAssessment, duration: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 w-32"
              placeholder="Duration"
            />
            <select
              value={editedAssessment.difficulty}
              onChange={(e) => setEditedAssessment({ ...editedAssessment, difficulty: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {(editedAssessment.questions || []).map((question, idx) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={idx}
              isEditing={editingQuestionId === question.id}
              onEdit={() => setEditingQuestionId(question.id)}
              onCollapse={() => setEditingQuestionId(null)}
              onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}
        </div>

        {/* Add Question Button */}
        <button
          onClick={handleAddQuestion}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6" />
          Add Question
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// QUESTION EDITOR COMPONENT
// ============================================================================

const QuestionEditor = ({ question, index, isEditing, onEdit, onCollapse, onUpdate, onDelete }) => {
  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const handleAddOption = () => {
    onUpdate({ options: [...question.options, 'New Option'] });
  };

  const handleRemoveOption = (optionIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onUpdate({ options: newOptions });
  };

  const handleCorrectAnswerToggle = (optionIndex) => {
    if (question.type === 'multi-choice') {
      const current = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      const newCorrect = current.includes(optionIndex)
        ? current.filter(i => i !== optionIndex)
        : [...current, optionIndex];
      onUpdate({ correctAnswer: newCorrect });
    } else {
      onUpdate({ correctAnswer: optionIndex });
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg flex items-center justify-center font-bold">
          {index + 1}
        </span>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide px-2 py-1 bg-blue-100 rounded">
          {question.type.replace('-', ' ')}
        </span>
        <div className="flex-1"></div>
        <button
          onClick={isEditing ? onCollapse : onEdit}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          {isEditing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
        >
          <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            {/* Question Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question Type</label>
              <select
                value={question.type}
                onChange={(e) => onUpdate({ type: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="single-choice">Single Choice</option>
                <option value="multi-choice">Multiple Choice</option>
                <option value="text">Text Answer</option>
              </select>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
              <textarea
                value={question.question}
                onChange={(e) => onUpdate({ question: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                placeholder="Enter your question here..."
              />
            </div>

            {/* Options (for choice questions) */}
            {(question.type === 'single-choice' || question.type === 'multi-choice') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Answer Options {question.type === 'multi-choice' && '(Check all correct answers)'}
                </label>
                <div className="space-y-2">
                  {question.options.map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type={question.type === 'multi-choice' ? 'checkbox' : 'radio'}
                        checked={
                          question.type === 'multi-choice'
                            ? (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(i))
                            : question.correctAnswer === i
                        }
                        onChange={() => handleCorrectAnswerToggle(i)}
                        className="w-5 h-5 text-green-600"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${i + 1}`}
                      />
                      {question.options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(i)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddOption}
                  className="mt-2 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {question.type === 'multi-choice' 
                    ? 'Check the box next to correct answers'
                    : 'Select the radio button for the correct answer'
                  }
                </p>
              </div>
            )}

            {/* Text Question Hint */}
            {question.type === 'text' && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Text Answer Question:</strong> Candidates will provide a written response. 
                  This question type requires manual review.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Collapsed View
          <div>
            <p className="text-gray-900 font-medium mb-2">{question.question || 'New Question'}</p>
            {question.options && (
              <div className="flex flex-wrap gap-2">
                {question.options.slice(0, 3).map((opt, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {opt}
                  </span>
                ))}
                {question.options.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{question.options.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;