import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const Navigate = useNavigate();

  const handleNavigation = (path) => {
    setActiveLink(path);
    setIsMobileMenuOpen(false);
    // For demo - replace with actual navigation
    Navigate(`${path}`);
    // alert(`Navigate to: ${path}`);
  };

  const navLinks = [
    { path: '/jobs', label: 'Jobs' },
    { path: '/candidates', label: 'Candidates' },
    { path: '/assessments', label: 'Assessments' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                : 'bg-white shadow-md'
            }`}>
              <Briefcase className={`w-6 h-6 transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-amber-600'
              }`} />
            </div>
            <span className={`text-2xl font-bold transition-all duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-gray-900'
            }`}>
              Talent<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Flow</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  activeLink === link.path
                    ? 'text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md'
                    : isScrolled
                    ? 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-white hover:bg-opacity-90'
                }`}
              >
                {link.label}
                {activeLink === link.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white hover:bg-opacity-90'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link, index) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`w-full text-left px-6 py-3 rounded-lg font-medium transition-all duration-300 transform ${
                  activeLink === link.path
                    ? 'text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md scale-105'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50 hover:translate-x-2'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className={`h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 transition-opacity duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </header>
  );
};

export default Header;