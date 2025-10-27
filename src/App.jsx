import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import JobsBoard from './pages/JobsBoard.jsx';
// import CandidatesList from './components/CandidatesList.jsx';
import CandidatesKanban from './pages/CandidatesKanban.jsx';
import AssessmentBuilder from './pages/AssessmentBuilder.jsx';
import './App.css';

function App() {

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsBoard />} /> 
            <Route path="/jobs/:jobId" element={<h2 className="placeholder-text">Job Details View Coming Soon...</h2>} />
            <Route path="/candidates" element={<CandidatesKanban />} /> 
            <Route path="/assessments" element={<AssessmentBuilder />} />
            {/* <Route path="/assessments/:jobId" element = {
              <h2 className="placeholder-text" style={appStyles.placeholderText}>Specific Job Assessment Builder Coming Soon...</h2>} /> 
            */}

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;