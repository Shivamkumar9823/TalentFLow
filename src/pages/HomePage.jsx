import React, { useState, useEffect } from 'react';
import { Briefcase, Users, ClipboardList, Zap, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Job Management",
      description: "Create, edit, and manage job postings with ease"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Candidate Tracking",
      description: "Track and organize candidates throughout the hiring process"
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Assessments",
      description: "Streamline candidate evaluation and feedback"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "IndexedDB Storage",
      description: "All data stored locally in your browser"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast & Responsive",
      description: "Lightning-fast performance with no backend delays"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "MSW Powered",
      description: "Mock Service Worker for realistic network simulation"
    }
  ];

  const Navigate = useNavigate();

  // const handleNavigation = (path) => {
  //   // For demo purposes - replace with actual navigation
  //   Navg
  //   alert(`Navigate to: ${path}`);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 mt-15">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Talent<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Flow</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-light">
            Your Mini Hiring Platform for Modern Recruitment
          </p>
          
          <p className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage jobs, candidates, and assessments with a powerful front-end system backed by IndexedDB and Mock Service Worker
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => Navigate('/jobs')}
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Manage Jobs
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button 
              onClick={() => Navigate('/candidates')}
              className="group px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-200 hover:border-amber-400"
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                View Candidates
              </span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`mt-24 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Hire Better
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-300"
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className={`mt-20 max-w-4xl mx-auto transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 shadow-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Fully Client-Side Architecture</h3>
            </div>
            <p className="text-amber-50 leading-relaxed">
              TalentFlow runs entirely in your browser with no backend required. All data is stored locally using IndexedDB, and network requests are intercepted by Mock Service Worker (MSW) for a realistic API experience. Perfect for prototyping, demos, and learning modern hiring workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-amber-200 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 text-sm">
            Built with React, React Router, and IndexedDB • Mock Service Worker Integration
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;