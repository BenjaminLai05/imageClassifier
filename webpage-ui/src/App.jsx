// src/App.jsx
import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar'; // Import the sidebar component

const sharedBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '300px',
    width: '300px',
    boxSizing: 'border-box',
    border: '1px dashed #eee'
};

function App() {
    // State variables
    const [dragging, setDragging] = useState(false);        // For drag-over visual effect
    const [fileName, setFileName] = useState("");           // To store dropped/selected file name
    const [sidebarOpen, setSidebarOpen] = useState(false);  // Controls whether sidebar is shown

    const inputRef = useRef(); // Reference to hidden input for manual file upload

    // Handles dropping a file into the drag area
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setFileName(file.name);
    };

    // Handles file selected from file picker
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFileName(file.name);
    };

    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            {/* LEFT SIDEBAR */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Sidebar Toggle Button — Fixed Top-Left */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1100,
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                ☰
            </button>

            {/* Centered Content Wrapper */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                padding: '2rem'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'flex-start'
                }}>
                    {/* File Drag Box */}
                    <div style={{ ...sharedBoxStyle }}>
                        <div
                            style={{
                                flexGrow: 1,
                                border: dragging ? '3px dashed #007bff' : '3px dashed #ccc',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background: dragging ? '#f0f8ff' : '#fff',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '1rem'
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                        >
                            <div style={{ fontSize: '3rem' }}>🚀</div>
                            <p>Drag A File Here</p>
                            <input
                                ref={inputRef}
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                            {fileName && (
                                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                                    📄 {fileName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Upload and Webcam Options */}
                    <div style={{ ...sharedBoxStyle, gap: '1rem' }}>
                        <div
                            onClick={() => inputRef.current.click()}
                            style={{
                                flexGrow: 1,
                                border: '3px dashed #007bff',
                                borderRadius: '12px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '1rem'
                            }}
                        >
                            📁<br />
                            <span>Upload File</span>
                        </div>

                        <div
                            onClick={() => alert("Open webcam UI here!")}
                            style={{
                                flexGrow: 1,
                                border: '3px dashed #28a745',
                                borderRadius: '12px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '1rem'
                            }}
                        >
                            📸<br />
                            <span>Webcam Photo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
