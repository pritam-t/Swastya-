import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { getMockMenuData } from '../services/ocrService';
import { dbService } from '../services/dbService';
import { gradeMenu } from '../services/gradingEngine';

const OCR_BOXES = [
  { top: '28%', left: '12%', label: 'Grilled Salmon', border: 'var(--primary)' },
  { top: '42%', left: '45%', label: 'Cobb Salad', border: 'var(--secondary)' },
  { top: '58%', left: '20%', label: 'Quinoa Bowl', border: 'var(--tertiary)' },
  { top: '35%', right: '10%', label: 'Lentil Soup', border: 'var(--primary)' },
];

export default function Scanner() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | scanning | analysing | done
  const [progress, setProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Image compression failed:', error);
      }
    }
  };

  const handleCapture = async () => {
    // Phase 1: Smart Freeze / Scanning
    setPhase('scanning');
    let p = 0;
    const tick = setInterval(() => { p += 3; setProgress(Math.min(p, 90)); if (p >= 90) clearInterval(tick); }, 80);
    await new Promise(r => setTimeout(r, 2600));
    clearInterval(tick);

    // Phase 2: AI Analysis
    setPhase('analysing');
    setProgress(95);
    await new Promise(r => setTimeout(r, 1800));
    setProgress(100);
    setPhase('done');

    // Grade the mock data against user profile
    const profile = dbService.getProfile() || {};
    const dishes = getMockMenuData();
    const graded = gradeMenu(dishes, profile);
    // Store graded results for Dashboard to consume
    localStorage.setItem('swastya_scan_results', JSON.stringify(graded));

    await new Promise(r => setTimeout(r, 500));
    navigate('/dashboard');
  };

  return (
    <div style={{ position: 'relative', height: '100dvh', background: '#0a0e0f', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* TOP CONTROLS */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)'
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 22 }}>arrow_back</span>
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 22 }}>flash_on</span>
          </button>
        </div>
      </header>

      {/* CAMERA VIEWPORT */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {/* Background (simulated camera feed or uploaded image) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1a2a2c 0%, #0d1a1b 40%, #142228 100%)'
        }}>
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded Menu" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          ) : (
            <div style={{
              position: 'absolute', inset: '15%', borderRadius: '1rem',
              background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8de 100%)',
              opacity: 0.85, transform: 'rotate(-1deg)',
              display: 'flex', flexDirection: 'column', padding: '2rem', overflow: 'hidden'
            }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.6rem, 1.5vw, 0.9rem)', color: '#3a2e1a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', opacity: 0.9 }}>Today's Menu</p>
              {['Grilled Salmon', 'Cobb Salad', 'Quinoa Buddha Bowl', 'Soy Glazed Pork', 'Lentil Soup', 'Pasta Alfredo'].map(d => (
                <div key={d} style={{ borderBottom: '1px solid rgba(58,46,26,0.12)', padding: '0.4rem 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.55rem, 1.2vw, 0.8rem)', color: '#3a2e1a', opacity: 0.9 }}>{d}</span>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.5rem, 1vw, 0.7rem)', color: '#6a5e44' }}>₹{Math.floor(Math.random() * 200 + 180)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scanning line (animated) */}
        {(phase === 'scanning' || phase === 'analysing') && (
          <div className="scan-line" style={{ zIndex: 20 }} />
        )}

        {/* OCR Bounding Boxes */}
        {(phase === 'scanning' || phase === 'analysing') && OCR_BOXES.map((box, i) => (
          <div key={i} style={{
            position: 'absolute', top: box.top, left: box.left, right: box.right,
            padding: '0.375rem 0.75rem', borderRadius: '0.5rem',
            border: `1.5px solid ${box.border}`, background: `${box.border}1A`,
            backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', gap: 6,
            zIndex: 20, animation: `fadeIn 0.3s ease ${i * 0.25}s both`
          }}>
            <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: box.border, flexShrink: 0 }} />
            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{box.label}</span>
          </div>
        ))}

        {/* Viewfinder corners */}
        <div style={{ position: 'absolute', inset: '8%', zIndex: 10, pointerEvents: 'none' }}>
          {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
            <div key={`${v}-${h}`} style={{
              position: 'absolute', [v]: -1, [h]: -1, width: 32, height: 32,
              borderTop: v === 'top' ? '3px solid var(--primary)' : 'none',
              borderBottom: v === 'bottom' ? '3px solid var(--primary)' : 'none',
              borderLeft: h === 'left' ? '3px solid var(--primary)' : 'none',
              borderRight: h === 'right' ? '3px solid var(--primary)' : 'none',
              borderRadius: v === 'top' && h === 'left' ? '8px 0 0 0' : v === 'top' && h === 'right' ? '0 8px 0 0' : v === 'bottom' && h === 'left' ? '0 0 0 8px' : '0 0 8px 0'
            }} />
          ))}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Progress bar */}
        {phase !== 'idle' && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)', zIndex: 30 }}>
            <div style={{ height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.1s ease' }} />
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS */}
      <div style={{
        position: 'relative', zIndex: 30, padding: '2rem 2rem 3rem',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
      }}>
        {/* Status chip */}
        <div 
          aria-live="polite"
          role="status"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '0.5rem 1.25rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--primary-fixed)', fontSize: 16 }} aria-hidden="true">auto_awesome</span>
          <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary-fixed)', fontWeight: 700 }}>
            {phase === 'idle' ? 'Align Menu within the Frame' :
             phase === 'scanning' ? 'Detecting text blocks...' :
             phase === 'analysing' ? 'Clinical AI analysing...' : 'Analysis complete!'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={phase !== 'idle'}
            style={{ background: 'none', border: 'none', cursor: phase !== 'idle' ? 'default' : 'pointer', padding: 0 }}
            title="Upload Menu Image"
          >
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span className="material-symbols-outlined" style={{ color: phase !== 'idle' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)', fontSize: 24 }}>upload_file</span>
            </div>
          </button>
          
          {/* Capture Button */}
          <button
            onClick={handleCapture}
            disabled={phase !== 'idle'}
            style={{ background: 'none', border: 'none', cursor: phase !== 'idle' ? 'default' : 'pointer', padding: 0, position: 'relative' }}
          >
            <div style={{ width: 88, height: 88, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: phase !== 'idle' ? 'rgba(255,255,255,0.3)' : '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255,255,255,0.3)', transition: 'all 0.3s'
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 34 }}>
                  {phase === 'done' ? 'check_circle' : 'camera'}
                </span>
              </div>
            </div>
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          
          <div style={{ width: 50, height: 50 }}></div> {/* Spacer to keep capture button centered */}
        </div>

        <p className="font-editorial" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center', letterSpacing: '0.02em' }}>
          Tap to scan &amp; analyse
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
