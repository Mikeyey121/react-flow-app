import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{ 
      background: '#000000',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      height: '4rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }} className="w-full">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem',
        height: '100%'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        }}>
          {/* Logo and Brand */}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <a href="/" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              padding: '0.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.5rem',
                marginRight: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <svg 
                  style={{ color: 'white', height: '1.75rem', width: '1.75rem' }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
                  />
                </svg>
              </div>
              <span style={{ 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '1.35rem',
                letterSpacing: '0.5px',
                marginRight: '0.75rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>ERD Solutions</span>
            </a>
          </div>

          {/* Desktop Navigation - Only ERD Creator */}
          <nav style={{ 
            display: 'none',
            '@media (min-width: 768px)': {
              display: 'flex'
            }
          }} className="md:flex space-x-1">
            <a 
              href="/erd-creator"
              style={{ 
                color: 'white', 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '6px',
                margin: '0 0.25rem',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ERD Creator
            </a>
          </nav>

          {/* Auth Button - Only Sign Up */}
          <div style={{ 
            display: 'none',
            '@media (min-width: 768px)': {
              display: 'flex'
            }
          }} className="md:flex items-center">
            <a 
              href="/signup" 
              style={{ 
                color: '#000000', 
                backgroundColor: 'white', 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                borderRadius: '6px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.backgroundColor = '#f8f8f8';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'block' }} className="md:hidden">
            <button 
              onClick={toggleMenu}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              {isMenuOpen ? (
                <svg 
                  style={{ height: '1.5rem', width: '1.5rem' }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  style={{ height: '1.5rem', width: '1.5rem' }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only ERD Creator and Sign Up */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '4rem',
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          animation: 'slideDown 0.3s ease-out forwards'
        }} className="md:hidden">
          <div style={{ padding: '0.75rem 1rem' }}>
            {['ERD Creator', 'Sign Up'].map((item, index) => (
              <a 
                key={index}
                href={item === 'Sign Up' ? '/signup' : '/erd-creator'} 
                style={{ 
                  color: 'white', 
                  display: 'block', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '6px', 
                  fontWeight: '500',
                  margin: '0.5rem 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderLeft = '3px solid white';
                  e.currentTarget.style.paddingLeft = '1.25rem';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderLeft = '3px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.paddingLeft = '1rem';
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 