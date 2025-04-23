// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ isOpen }) => (
  <div
    style={{
        position: 'fixed',           // ⬅️ Overlay the page
        top: 0,
        left: 0,
        height: '100vh',
        width: isOpen ? '250px' : '0px',
        backgroundColor: '#222',
        color: 'white',
        overflowX: 'hidden',
        transition: '0.3s',
        padding: isOpen ? '1rem' : '0px',
        zIndex: 1000                 // ⬅️ Stay above everything else
    }}
  >
    {isOpen && (
      <>
        <h2>Sidebar Menu</h2>
        <p>🏠 Home</p>
        <p>📁 Uploads</p>
        <p>📸 Webcam</p>
      </>
    )}
  </div>
);

export default Sidebar;
