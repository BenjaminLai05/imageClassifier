// ───────────────────────────────────────── src/App.jsx
import React, { useState, useRef, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ParticlesComponent from './components/particles.js';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCamera, faRocket } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';        // spinner  ◀ NEW

/* ─── constants ─────────────────────────── */
const BOX_SIZE = 300;
const sharedBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: `${BOX_SIZE}px`,
  width: `${BOX_SIZE}px`,
  boxSizing: 'border-box',
  border: '1px dashed #eee'
};

function App() {
  /* ─── state ───────────────────────────── */
  const [dragging, setDragging]     = useState(false);
  const [fileName1, setFileName1]   = useState('');
  const [fileName2, setFileName2]   = useState('');
  const [selectedFile, setSelectedFile] = useState(null);   // ◀ NEW
  const [isProcessing, setIsProcessing] = useState(false);  // ◀ NEW
  const [result, setResult]             = useState(null);   // ◀ NEW
  const [manualOpen, setManualOpen] = useState(false);
  const [hovered, setHovered]       = useState(false);
  const isOpen = manualOpen || hovered;

  const inputRef = useRef();

  /* ─── mount particles once ────────────── */
  const memoizedParticles = useMemo(
    () => <ParticlesComponent id="particles" />,
    []
  );

  /* ─── handlers ────────────────────────── */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName1(file.name);
      setSelectedFile(file);                    // store File obj
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName2(file.name);
      setSelectedFile(file);                    // store File obj
    }
  };

  /* runs when user clicks “Process” */
  async function handleProcess() {
    if (!selectedFile) {
      alert('Please upload an MRI first');
      return;
    }
    setIsProcessing(true);
    setResult(null);

    const form = new FormData();
    form.append('file', selectedFile);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/predict`,
        { method: 'POST', body: form }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();            // {label, confidence}
      setResult(data);
    } catch (err) {
      alert('Server error: ' + err);
    } finally {
      setIsProcessing(false);
    }
  }

  /* ─── render ───────────────────────────── */
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {memoizedParticles}
      <Sidebar isOpen={isOpen} />

      {/* header bar */}
      <div style={{
        display:'flex', alignItems:'center', padding:'1rem',
        backgroundColor:'black', color:'white', fontSize:'1.5rem',
        fontWeight:'bold', position:'fixed', top:0, left:0, width:'100%',
        zIndex:1100
      }}>
        <button onClick={() => setManualOpen(o => !o)} style={{
          fontSize:'1.5rem', cursor:'pointer', background:'transparent',
          border:'none', color:'white', marginRight:'1rem'
        }}>
          ☰
        </button>
        <span style={{position:'absolute', left:'50%', transform:'translateX(-50%)'}}>
          🧠 MRI Scan Inbox
        </span>
      </div>

      {/* main column */}
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', height:'100%', width:'100%',
        padding:'2rem', gap:'2.5rem'
      }}>
        {/* container pair */}
        <div style={{
          display:'flex', gap:'2rem', alignItems:'flex-start', position:'relative'
        }}>
          {/* drag-and-drop box (LEFT) */}
          <div style={{ ...sharedBoxStyle }}>
            <div
              style={{
                flexGrow:1, border:'3px solid grey', borderRadius:'12px',
                cursor:'pointer', background:'white', display:'flex',
                flexDirection:'column', justifyContent:'center',
                alignItems:'center', textAlign:'center', padding:'1rem'
              }}
              onDragOver={(e)=>{e.preventDefault(); setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={handleDrop}
            >
              <FontAwesomeIcon icon={faRocket} size="4x" /><br/>
              <p>Drag A File Here</p>
              <input ref={inputRef} type="file" hidden onChange={handleFileChange}/>
              {fileName1 && <p style={{marginTop:'1rem', fontWeight:'bold'}}>
                📄 {fileName1}
              </p>}
            </div>
          </div>

          {/* upload + webcam column (RIGHT) */}
          <div style={{ ...sharedBoxStyle, gap:'1rem' }}>
            {/* upload */}
            <div onClick={()=>inputRef.current.click()} style={{
              flexGrow:1, border:'3px solid grey', borderRadius:'12px',
              textAlign:'center', cursor:'pointer', display:'flex',
              flexDirection:'column', justifyContent:'center',
              alignItems:'center', padding:'1rem', background:'white'
            }}>
              <FontAwesomeIcon icon={faFolderOpen} size="2x"/><br/>
              <span>Upload File</span>
              <input ref={inputRef} type="file" hidden onChange={handleFileChange}/>
              {fileName2 && <p style={{marginTop:'1rem', fontWeight:'bold'}}>
                📄 {fileName2}
              </p>}
            </div>

            {/* webcam */}
            <div onClick={()=>alert('Open webcam UI here!')} style={{
              flexGrow:1, border:'3px solid grey', borderRadius:'12px',
              textAlign:'center', cursor:'pointer', display:'flex',
              flexDirection:'column', justifyContent:'center',
              alignItems:'center', padding:'1rem', background:'white'
            }}>
              <FontAwesomeIcon icon={faCamera} size="2x"/><br/>
              <span>Webcam Photo</span>
            </div>
          </div>

          {/* download button (left) */}
          <a href={`${process.env.PUBLIC_URL}/brain_mri_dataset.zip`} download style={{
            position:'absolute', left:0, top:BOX_SIZE+16,
            padding:'0.75rem 1.5rem', fontSize:'1rem', borderRadius:'8px',
            border:'2px solid white', backgroundColor:'black', color:'white',
            textDecoration:'none', textAlign:'center', cursor:'pointer'
          }}>
            Download Dataset
          </a>

          {/* process button (right) */}
          <button
            onClick={handleProcess}
            disabled={!selectedFile || isProcessing}
            style={{
              position:'absolute', right:0, top:BOX_SIZE+16,
              padding:'0.75rem 1.5rem', fontSize:'1rem', borderRadius:'8px',
              border:'none', backgroundColor:'black', color:'white',
              border:'2px solid white', cursor:'pointer',
              opacity: (!selectedFile || isProcessing) ? 0.5 : 1
            }}
          >
            {isProcessing ? 'Processing…' : 'Process'}
          </button>
        </div>

        {/* feedback row */}
        {isProcessing && <ClipLoader size={28} color="#ffffff" />}
        {result && (
          <p style={{color:'white', fontSize:'1.25rem'}}>
            Result: <strong>{result.label}</strong> &nbsp;
            ({(result.confidence*100).toFixed(1)}%)
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
