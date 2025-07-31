import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";

const App = () => {
  console.log("TrailWhisper app loaded with MainPage as landing!");
  
  // Add Google Fonts
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@400;500;600;700&family=Amatic+SC:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/landing" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const MainPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const aboutRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  const reviewsRef = React.useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const theme = darkMode
    ? {
        background: '#0a192f',
        text: '#ccd6f6',
        card: '#112240',
        accent: '#64ffda',
        secondary: '#233554',
        paper: '#0d2538',
        stamp: '#3ea6ff',
        vintage: '#1e3a5f',
        shadow: 'rgba(0, 0, 0, 0.4)',
      }
    : {
        background: '#e6f7ff',
        text: '#1e3a5f',
        card: '#f0faff',
        accent: '#0077cc',
        secondary: '#005fa3',
        paper: '#d9f0ff',
        stamp: '#3ea6ff',
        vintage: '#a3d4ff',
        shadow: 'rgba(30, 58, 95, 0.15)',
      };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 15% 85%, ${theme.vintage}15 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, ${theme.secondary}15 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${theme.accent}08 0%, transparent 70%),
          linear-gradient(135deg, ${theme.background} 0%, ${theme.paper} 100%)
        `,
        color: theme.text,
        fontFamily: '"Crimson Text", "Georgia", serif',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          background: `
            linear-gradient(135deg, ${theme.card}f8 0%, ${theme.paper}f8 100%)
          `,
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 8px 32px ${theme.shadow},
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 1px 0 ${theme.accent}40
          `,
          position: 'sticky',
          top: 0,
          zIndex: 999,
          borderBottom: `3px solid ${theme.accent}`,
          borderImage: `linear-gradient(90deg, transparent, ${theme.accent}, transparent) 1`,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: '700',
              fontFamily: '"Dancing Script", cursive',
              color: theme.accent,
              textShadow: `3px 3px 6px ${theme.shadow}`,
              margin: 0,
            }}
          >
            TrailWhisper
          </h1>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {['About', 'Features', 'Reviews'].map((item, index) => {
            const refs = [aboutRef, featuresRef, reviewsRef];
            return (
              <button
                key={item}
                onClick={() => scrollToSection(refs[index])}
                style={{
                  background: 'transparent',
                  color: theme.text,
                  border: 'none',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  fontFamily: '"Crimson Text", serif',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.accent;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.text;
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Login Button */}
<button
  onClick={() => window.location.href = '/login'}
  style={{
    ...postcardButton(theme),
    borderRadius: '50px', // Makes the button oval
    padding: '0.8rem 2rem', // Adjust padding for oval shape
  }}
>
  Login
</button>

{/* Sign Up Button */}
<button
  onClick={() => window.location.href = '/signup'}
  style={{
    ...postcardButton(theme),
    background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.secondary} 100%)`,
    color: theme.background,
    fontWeight: 'bold',
    borderRadius: '50px', // Makes the button oval
    padding: '0.8rem 2rem', // Adjust padding for oval shape
  }}
>
  Sign Up
</button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.accent,
              color: theme.background,
              border: 'none',
              padding: '0.8rem',
              borderRadius: '50%', // Makes the button round
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              fontFamily: '"Crimson Text", serif',
              boxShadow: `0 4px 8px ${theme.shadow}`,
              transition: 'all 0.3s ease',
              width: '3rem', // Ensures the button is circular
              height: '3rem', // Ensures the button is circular
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.background}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {darkMode ? (
                <circle cx="12" cy="12" r="5" /> // Sun Icon
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /> // Moon Icon
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: '4rem 1rem 2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            background: `
              linear-gradient(135deg, ${theme.card}f5 0%, ${theme.paper}f5 100%)
            `,
            padding: '5rem 4rem',
            borderRadius: '25px',
            boxShadow: `
              0 25px 50px ${theme.shadow},
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 0 1px ${theme.accent}40
            `,
            border: `2px solid ${theme.accent}50`,
            position: 'relative',
            transform: 'rotate(-0.8deg)',
          }}
        >
          <h2
            style={{
              fontSize: '4.5rem',
              fontFamily: '"Kalam", cursive',
              color: theme.accent,
              marginBottom: '2.5rem',
              textShadow: `3px 3px 6px ${theme.shadow}`,
              lineHeight: '1.1',
            }}
          >
            Your Journey Starts Here
          </h2>
          <p
            style={{
              fontSize: '1.5rem',
              lineHeight: '1.9',
              color: theme.text,
              fontStyle: 'italic',
              maxWidth: '650px',
              margin: '0 auto',
            }}
          >
            {'Capture memories, plan adventures, and guide your wanderlust through the pages of your digital travel journal...'}
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            style={{
              ...postcardButton(theme),
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.secondary} 100%)`,
              color: theme.background,
              fontWeight: 'bold',
              fontSize: '1.3rem',
              padding: '1.5rem 3.5rem',
              marginTop: '3rem',
              boxShadow: `0 8px 24px ${theme.shadow}`,
              borderRadius: '18px',
              letterSpacing: '1px',
              fontFamily: '"Kalam", cursive',
              transition: 'all 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.09) rotate(-2deg)';
              e.target.style.boxShadow = `0 16px 32px ${theme.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) rotate(0deg)';
              e.target.style.boxShadow = `0 8px 24px ${theme.shadow}`;
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section ref={aboutRef} style={journalPageStyle(theme, 'right')}>
        <div style={{ position: 'relative', padding: '2rem' }}> {/* Decreased padding */}
          <h2 style={handwrittenHeading(theme)}>
            About TrailWhisper
            <div style={{ marginLeft: '1.5rem' }}>
             
            </div>
          </h2>
          <div
            style={{
              background: `
                repeating-linear-gradient(
                  transparent,
                  transparent 1.8rem,
                  ${theme.accent}35 1.8rem,
                  ${theme.accent}35 calc(1.8rem + 1px)
                ),
                linear-gradient(135deg, ${theme.paper}90 0%, ${theme.card}90 100%)
              `,
              padding: '2.5rem',
              borderRadius: '15px',
              position: 'relative',
              boxShadow: `inset 0 3px 6px ${theme.shadow}`,
            }}
          >
            <p style={journalText(theme)}>
              TrailWhisper is your ultimate digital travel companion designed to capture the soul of
              your adventures and help you craft unforgettable stories. Seamlessly journal your trips,
              upload stunning visuals, tag cherished memories, and plan future explorations all in one
              beautiful, intuitive platform.
            </p>
            
          </div>
          {/* Enhanced Paper Corner Fold */}
          <div
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, transparent 50%, ${theme.secondary}90 50%)`,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
              boxShadow: `0 3px 6px ${theme.shadow}`,
            }}
          />
        </div>
      </section>

      {/* Significantly Enhanced Features Section */}
      <section ref={featuresRef} style={journalPageStyle(theme, 'center')}>
        <h2 style={handwrittenHeading(theme)}>
          Features 
          <div style={{ marginLeft: '1.5rem' }}>

          </div>
        </h2>
        
        {/* Enhanced Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '1.5rem', // Decreased gap
          marginTop: '2rem', // Decreased margin
          maxWidth: '1200px',
          margin: '2rem auto 0',
        }}>
          {[
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="currentColor" opacity="0.8"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
              </svg>,
              title: 'Secure Journaling',
              text: 'Write freely with support for image uploads and memory tagging. Your stories are encrypted and safely stored.',
              accent: theme.stamp
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8" cy="16" r="2" fill="currentColor"/>
              </svg>,
              title: 'Real-Time Dashboard',
              text: 'View and manage your travel logs instantly with our intuitive dashboard. Track your adventures at a glance.',
              accent: theme.accent
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>,
              title: 'Dark Mode',
              text: 'Journal comfortably, day or night. Our adaptive interface adjusts to your preferences and environment.',
              accent: theme.secondary
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor" opacity="0.8"/>
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>,
              title: 'Elegant Design',
              text: 'Clean, responsive, and built for focus. Every element is crafted to enhance your journaling experience.',
              accent: theme.vintage
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: `
                  linear-gradient(135deg, ${theme.card}95 0%, ${theme.paper}95 100%)
                `,
                borderRadius: '20px',
                border: `3px solid ${feature.accent}60`,
                boxShadow: `0 8px 25px ${theme.shadow}`,
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px) rotate(1deg)';
                e.target.style.boxShadow = `0 15px 35px ${theme.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) rotate(0deg)';
                e.target.style.boxShadow = `0 8px 25px ${theme.shadow}`;
              }}
            >
              {/* Feature Card Header */}
              <div style={{
                background: `linear-gradient(135deg, ${feature.accent}20 0%, ${feature.accent}10 100%)`,
                padding: '2rem 2rem 1rem',
                borderBottom: `2px dashed ${feature.accent}40`,
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ 
                    color: feature.accent,
                    background: `${feature.accent}20`,
                    padding: '0.8rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    fontFamily: '"Kalam", cursive',
                    color: feature.accent,
                    margin: 0,
                    textShadow: `1px 1px 2px ${theme.shadow}`,
                  }}>
                    {feature.title}
                  </h3>
                </div>
              </div>
              
              {/* Feature Card Content */}
              <div style={{ padding: '2rem' }}>
                <p style={{ 
                  ...journalText(theme), 
                  margin: 0, 
                  fontSize: '1.1rem',
                  lineHeight: '1.6'
                }}>
                  {feature.text}
                </p>
              </div>
              {/* Decorative corner elements */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '20px',
                  height: '20px',
                  background: `${feature.accent}40`,
                  borderRadius: '50%',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  width: '15px',
                  height: '15px',
                  background: `${feature.accent}30`,
                  transform: 'rotate(45deg)',
                  opacity: 0.4,
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Reviews Section with Actual Images */}
      <section ref={reviewsRef} style={journalPageStyle(theme, 'center')}>
        <h2 style={handwrittenHeading(theme)}>
          Traveler Stories
          <div style={{ marginLeft: '1.5rem' }}>
           
          </div>
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '4rem',
          }}
        >
          {[
            {
              name: 'Ava',
              review: 'TrailWhisper helped me document my entire solo Europe trip beautifully.',
              location: 'Paris, France',
              imageUrl: 'https://media.istockphoto.com/id/1345426734/photo/eiffel-tower-paris-river-seine-sunset-twilight-france.jpg?s=612x612&w=0&k=20&c=I5rAH5d_-Yyag8F0CKzk9vzMr_1rgkAASGTE11YMh9A=',
            },
            {
              name: 'Zayn',
              review: 'The planner picked out hidden gems I would\'ve missed otherwise!',
              location: 'Tokyo, Japan',
              imageUrl: 'https://media.istockphoto.com/id/484915982/photo/akihabara-tokyo.jpg?s=612x612&w=0&k=20&c=kbCRYJS5vZuF4jLB3y4-apNebcCEkWnDbKPpxXdf9Cg=',
            },
            {
              name: 'Noor',
              review: 'Simple and secure ! I feel like my memories are preserved forever.',
              location: 'Bali, Indonesia',
              imageUrl: 'data:image/jpeg;base64,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',
            },
          ].map((review, i) => (
            <div
              key={i}
              style={{
                ...polaroidStyle(theme),
                transform: `rotate(${(i - 1) * 4}deg)`,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = `rotate(0deg) scale(1.08)`;
                e.target.style.zIndex = '10';
                e.target.style.boxShadow = `0 20px 45px ${theme.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = `rotate(${(i - 1) * 4}deg) scale(1)`;
                e.target.style.zIndex = '1';
                e.target.style.boxShadow = `0 10px 30px ${theme.shadow}`;
              }}
            >
              {/* Enhanced Polaroid Photo Area with Actual Images */}
              <div
                style={{
                  width: '100%',
                  height: '220px',
                  borderRadius: '10px 10px 0 0',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${theme.vintage}30 0%, ${theme.secondary}30 100%)`,
                }}
              >
                <img
                  src={review.imageUrl}
                  alt={`Travel memory from ${review.location}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px 8px 0 0',
                  }}
                />
                {/* Vintage photo overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 15px,
                        ${theme.shadow} 15px,
                        ${theme.shadow} 16px
                      )
                    `,
                    opacity: 0.08,
                  }}
                />
              </div>
              
              {/* Enhanced Review Text */}
              <p style={{ 
                fontStyle: 'italic', 
                fontSize: '1.1rem',
                lineHeight: '1.5',
                margin: '0 0 1.5rem 0',
                fontFamily: '"Kalam", cursive',
                color: theme.text,
              }}>
                "{review.review}"
              </p>
              
              {/* Enhanced Signature */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ 
                  fontWeight: 'bold', 
                  margin: '0',
                  fontFamily: '"Dancing Script", cursive',
                  fontSize: '1.4rem',
                  color: theme.accent,
                  textShadow: `1px 1px 2px ${theme.shadow}`,
                }}>
                  - {review.name}
                </p>
                <p style={{ 
                  fontSize: '1rem', 
                  margin: '0.3rem 0 0 0',
                  opacity: 0.8,
                  fontStyle: 'italic',
                  fontFamily: '"Crimson Text", serif',
                }}>
                  {review.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer style={{
        ...journalPageStyle(theme, 'center'),
        fontSize: '1rem',
        opacity: 0.9,
        marginTop: '3rem', // Decreased margin
        textAlign: 'center',
        padding: '1rem', // Decreased padding
      }}>
        <div style={{
          padding: '.3rem',
          borderTop: `1px dashed ${theme.accent}70`,
          fontFamily: '"Dancing Script", cursive',
          fontSize: '1.3rem',
          position: 'relative',
        }}>
          <div style={{ marginBottom: '2rem' }}>
            © 2025 TrailWhisper. Built for explorers, dreamers, and wanderers. Mehreen Mallick Fiona.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Styling Functions
const journalPageStyle = (theme, alignment = 'center') => ({
  padding: '5rem 2rem',
  textAlign: alignment,
  color: theme.text,
  background: `
    linear-gradient(135deg, ${theme.card}f8 0%, ${theme.paper}f8 100%)
  `,
  borderRadius: '25px',
  boxShadow: `
    0 20px 45px ${theme.shadow},
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 0 1px ${theme.accent}25
  `,
  margin: '4rem auto',
  maxWidth: '1200px',
  position: 'relative',
  border: `2px solid ${theme.accent}40`,
  backdropFilter: 'blur(15px)',
});

const handwrittenHeading = (theme) => ({
  fontSize: '3.5rem',
  fontWeight: '600',
  fontFamily: '"Kalam", cursive',
  color: theme.accent,
  marginBottom: '2.5rem',
  textShadow: `3px 3px 6px ${theme.shadow}`,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const journalText = (theme) => ({
  fontSize: '1.3rem',
  lineHeight: '2.1',
  color: theme.text,
  fontFamily: '"Crimson Text", serif',
  textAlign: 'left',
  marginBottom: '1.8rem',
});

const travelTagButton = (theme) => ({
  background: `linear-gradient(135deg, ${theme.card} 0%, ${theme.paper} 100%)`,
  color: theme.text,
  border: `3px solid ${theme.accent}`,
  padding: '1rem 1.8rem',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: '600',
  fontFamily: '"Crimson Text", serif',
  borderRadius: '30px 8px 30px 8px',
  transition: 'all 0.4s ease',
  boxShadow: `0 4px 8px ${theme.shadow}`,
  position: 'relative',
  textDecoration: 'none',
});

const postcardButton = (theme) => ({
  background: `linear-gradient(135deg, ${theme.paper} 0%, ${theme.card} 100%)`,
  color: theme.text,
  border: `3px solid ${theme.accent}`,
  padding: '1.2rem 2.5rem',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: '600',
  fontFamily: '"Crimson Text", serif',
  borderRadius: '12px',
  transition: 'all  0.4s ease',
  boxShadow: `0 4px 12px ${theme.shadow}`,
  position: 'relative',
});

const polaroidStyle = (theme) => ({
  background: theme.card,
  padding: '2rem 2rem 2.5rem',
  borderRadius: '15px',
  maxWidth: '320px',
  fontFamily: '"Crimson Text", serif',
  boxShadow: `0 10px 30px ${theme.shadow}`,
  transition: 'all 0.5s ease',
  cursor: 'pointer',
  border: `2px solid ${theme.accent}50`,
  position: 'relative',
});

export default App;