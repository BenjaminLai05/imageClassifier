// src/components/Sidebar.jsx
import React from 'react';
import githubLogo from '../images/githublogo.png';


const Sidebar = ({ isOpen }) => (
  <div
    style={{
      position: 'fixed',
      top: '5rem',
      bottom: '2rem',
      left: 0,
      width: '250px',                 // ← always 250 px
      backgroundColor: '#141414',
      color: 'white',
      borderTopRightRadius: '10px',
      borderBottomRightRadius: '10px',
      zIndex: 1000,

      /* ─── slide-in / slide-out effect ─── */
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.4s ease',

      /* if you don’t want it to capture clicks when hidden */
      pointerEvents: isOpen ? 'auto' : 'none',
      overflowX: 'hidden',
      padding: '1rem'                 // keep padding constant
    }}
  >
    {isOpen && (
      <nav style={{ padding: '1rem' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li style={{ margin: '1rem 0', display: 'flex', alignItems: 'center' }}>
            🕒 <span style={{ marginLeft: '0.5rem' }}>Scan History</span>
          </li>
          <li style={{ margin: '1rem 0', display: 'flex', alignItems: 'center' }}>
            📈 <span style={{ marginLeft: '0.5rem' }}>Model Accuracy</span>
          </li>
          <li style={{ margin: '1rem 0', display: 'flex', alignItems: 'center' }}>
            <img
              src={githubLogo}
              alt="GitHub"
              style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.5rem',
                filter: 'invert(1)'
              }}
            />
            <span>GitHub Projects</span>
          </li>
        </ul>
      </nav>
    )}
  </div>
);

export default Sidebar;
