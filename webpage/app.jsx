const { useState, useRef } = React;

function App() {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const inputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setFileName(file.name);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFileName(file.name);
    };

    return (
        <div style={{
            display: 'flex',
            gap: '2rem',
            padding: '2rem',
            alignItems: 'flex-start',
            justifyContent: 'center'
        }}>
            {/* 🟦 Left Side: Drag Box Container */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '300px',
                width: '300px',
                boxSizing: 'border-box',
                border: '1px dashed #eee' // optional debug border
            }}>
                {/* Drag & Drop Zone */}
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
                    onClick={() => inputRef.current.click()}
                >
                    <div style={{ fontSize: '3rem' }}>🚀</div>
                    <p>Drag a file here, or</p>
                    <span style={{ color: '#007bff', textDecoration: 'underline' }}>
                        Choose a file to upload
                    </span>
                    <input
                        ref={inputRef}
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                    {fileName && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>📄 {fileName}</p>}
                </div>
            </div>

            {/* 🟩 Right Side: Button Column */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                height: '300px',
                width: '300px',
                boxSizing: 'border-box',
                border: '1px dashed #eee' // optional debug border
            }}>
                {/* Upload File Box */}
                <div
                    onClick={() => inputRef.current.click()}
                    style={{
                        flexGrow: 1,
                        border: '2px dashed #007bff',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem',
                        boxSizing: 'border-box'
                    }}
                >
                    📁<br />
                    <span>Upload File</span>
                </div>

                {/* Webcam Photo Box */}
                <div
                    onClick={() => alert("Open webcam UI here!")}
                    style={{
                        flexGrow: 1,
                        border: '2px dashed #28a745',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem',
                        boxSizing: 'border-box'
                    }}
                >
                    📸<br />
                    <span>Webcam Photo</span>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
