import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Eye, 
  Zap, 
  RefreshCw,
  Search
} from 'lucide-react';

const PRESETS = [
  {
    id: "preset-pothole",
    name: "IITM In-Gate Pothole (Zone 13)",
    type: "Pothole",
    damage: 78,
    severity: "Critical",
    action: "Immediate Cold-Mix Asphalt Relaying within 24 hours",
    defectCount: 3,
    boxes: [
      { x: 30, y: 45, w: 25, h: 20, label: "Pothole #1 (Critical: 84%)" },
      { x: 60, y: 35, w: 15, h: 12, label: "Pothole #2 (High: 68%)" }
    ],
    // High-tech vector road canvas style
    svgBackground: (
      <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="400" height="250" fill="#1a1e2e" />
        {/* Road perspective */}
        <polygon points="120,250 280,250 220,100 180,100" fill="#2d3548" />
        <line x1="200" y1="100" x2="200" y2="250" stroke="#f8c12c" strokeWidth="2" strokeDasharray="8,8" />
        {/* Pothole vector blobs */}
        <ellipse cx="180" cy="180" rx="35" ry="18" fill="#0d111a" stroke="#ef4444" strokeWidth="2" />
        <ellipse cx="250" cy="150" rx="20" ry="10" fill="#0d111a" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Grid lines to make it look futuristic */}
        <path d="M 0,50 L 400,50 M 0,100 L 400,100 M 0,150 L 400,150 M 0,200 L 400,200" stroke="rgba(0, 165, 233, 0.08)" strokeWidth="1" />
        <path d="M 50,0 L 50,250 M 100,0 L 100,250 M 150,0 L 150,250 M 200,0 L 200,250 M 250,0 L 250,250 M 300,0 L 300,250 M 350,0 L 350,250" stroke="rgba(0, 165, 233, 0.08)" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "preset-crack",
    name: "Sardar Patel Road Segment B",
    type: "Road Cracks",
    damage: 42,
    severity: "Medium",
    action: "Micro-surfacing seal coat application to block moisture",
    defectCount: 5,
    boxes: [
      { x: 15, y: 25, w: 40, h: 50, label: "Structural Fatigue Cracking (58%)" },
      { x: 60, y: 70, w: 30, h: 20, label: "Block Crack (35%)" }
    ],
    svgBackground: (
      <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="400" height="250" fill="#1a1e2e" />
        {/* Road perspective */}
        <polygon points="80,250 320,250 210,80 190,80" fill="#333b4e" />
        {/* Crack lines */}
        <path d="M150,230 Q140,180 160,150 T180,100" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="2,2" />
        <path d="M250,210 Q280,160 260,130" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M160,150 L200,160" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Radar radar grid */}
        <circle cx="200" cy="125" r="80" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
        <circle cx="200" cy="125" r="40" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
        <line x1="0" y1="125" x2="400" y2="125" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
        <line x1="200" y1="0" x2="200" y2="250" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "preset-water",
    name: "Guindy Junction Left Undercut",
    type: "Waterlogging",
    damage: 89,
    severity: "Critical",
    action: "Desilting drain intakes and route stormwater bypass line",
    defectCount: 1,
    boxes: [
      { x: 10, y: 55, w: 80, h: 40, label: "Submersion Zone #1 Depth: 14in" }
    ],
    svgBackground: (
      <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="400" height="250" fill="#111524" />
        {/* Road perspective */}
        <polygon points="100,250 300,250 205,90 195,90" fill="#202737" />
        {/* Water puddle */}
        <ellipse cx="200" cy="200" rx="85" ry="35" fill="rgba(14, 165, 233, 0.3)" stroke="var(--accent)" strokeWidth="2.5" />
        {/* Water ripple rings */}
        <ellipse cx="200" cy="200" rx="65" ry="25" fill="none" stroke="rgba(14, 165, 233, 0.5)" strokeWidth="1" />
        <ellipse cx="180" cy="190" rx="35" ry="12" fill="none" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="0.8" />
        <path d="M 0,20 L 400,230" stroke="rgba(239, 68, 68, 0.1)" strokeWidth="1" />
        {/* HUD corners */}
        <path d="M 20,20 L 40,20 M 20,20 L 20,40 M 380,20 L 360,20 M 380,20 L 380,40 M 20,230 L 40,230 M 20,230 L 20,210 M 380,230 L 360,230 M 380,230 L 380,210" stroke="var(--accent)" strokeWidth="2" fill="none" />
      </svg>
    )
  }
];

export default function AIHealthMonitor({ onEscalateToComplaint }) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scannedData, setScannedData] = useState(PRESETS[0]);
  const [customFile, setCustomFile] = useState(null);

  const scanLogs = [
    "Establishing handshake with Roadwatch Neural Node...",
    "Injecting Convolutional Kernels into frame buffer...",
    "Running Edge Detection and Surface Deformation Filters...",
    "Isolating pothole coordinate contours...",
    "Evaluating defect severity vector & generating depth estimates...",
    "Telemetry finalized. Results ready for submission."
  ];

  const handleTriggerScan = (preset) => {
    setSelectedPreset(preset);
    setScanning(true);
    setScanStep(0);
    setScannedData(null);
    setCustomFile(null);
  };

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanLogs.length - 1) {
          clearInterval(interval);
          setScanning(false);
          setScannedData(selectedPreset);
          return prev;
        }
        return prev + 1;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [scanning, selectedPreset]);

  // Handle custom mock upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomFile(file.name);
      setScanning(true);
      setScanStep(0);
      setScannedData(null);

      // Create a mock preset for the uploaded file
      const uploadMockPreset = {
        id: "custom-upload",
        name: `User Scan: ${file.name}`,
        type: "Pothole",
        damage: 64,
        severity: "High",
        action: "Deploy hot-mix resurfacing crew",
        defectCount: 2,
        boxes: [
          { x: 25, y: 35, w: 20, h: 25, label: "Pothole Detected (High: 71%)" },
          { x: 55, y: 55, w: 30, h: 15, label: "Surface Crack (Medium: 55%)" }
        ],
        svgBackground: (
          <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%', display: 'block' }}>
            <rect width="400" height="250" fill="#111625" />
            <polygon points="120,250 280,250 210,120 190,120" fill="#2d3345" />
            {/* Mock custom pothole */}
            <ellipse cx="200" cy="180" rx="45" ry="25" fill="#060913" stroke="#ef4444" strokeWidth="2" />
            <path d="M 170,180 Q 200,195 230,175" stroke="#ef4444" strokeWidth="1" fill="none" />
            {/* Grid overlay */}
            <circle cx="200" cy="125" r="110" fill="none" stroke="rgba(14, 165, 233, 0.08)" strokeWidth="1" />
            {/* Matrix code falling style */}
            <text x="15" y="40" fill="rgba(16, 185, 129, 0.25)" fontFamily="monospace" fontSize="8">F_DEPTH: 8.5cm</text>
            <text x="15" y="55" fill="rgba(16, 185, 129, 0.25)" fontFamily="monospace" fontSize="8">LAT: 12.9915</text>
            <text x="15" y="70" fill="rgba(16, 185, 129, 0.25)" fontFamily="monospace" fontSize="8">LNG: 80.2337</text>
          </svg>
        )
      };

      setSelectedPreset(uploadMockPreset);
    }
  };

  const getSeverityBadgeClass = (sev) => {
    if (sev === 'Critical') return 'badge-high';
    if (sev === 'High') return 'badge-medium';
    return 'badge-low';
  };

  return (
    <div className="grid-2col animate-fade-in">
      
      {/* Visual Scan Area (Left) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Core Scanner HUD */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} className="neon-text-blue" />
            Road Neural Core Scanner
          </h3>

          <div className="scan-container" style={{ height: '300px', width: '100%', position: 'relative' }}>
            
            {/* Render the diagnostic graphics */}
            {selectedPreset.svgBackground}

            {/* Bounding boxes overlays (only when scanning finishes) */}
            {!scanning && scannedData && scannedData.boxes.map((box, i) => (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.w}%`,
                  height: `${box.h}%`,
                  border: '2px solid var(--danger)',
                  boxShadow: '0 0 10px var(--danger-glow)',
                  zIndex: 20
                }}
              >
                {/* Floating label */}
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '-2px',
                  backgroundColor: 'var(--danger)',
                  color: 'white',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  {box.label}
                </span>
              </div>
            ))}

            {/* Laser Line */}
            {scanning && <div className="scan-laser"></div>}

            {/* Scanning Overlay (Blackout blur while in progress) */}
            {scanning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(6, 9, 19, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                zIndex: 15,
                backdropFilter: 'blur(2px)'
              }}>
                <RefreshCw size={36} className="neon-text-blue" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                  AI INFERENCE IN PROGRESS...
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: 'var(--secondary)',
                  textAlign: 'center',
                  minHeight: '24px',
                  maxWidth: '300px'
                }}>
                  &gt; {scanLogs[scanStep]}
                </p>
              </div>
            )}
          </div>

          {/* Trigger Scan bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Current Diagnostic Target: <strong style={{ color: 'var(--text-primary)' }}>{selectedPreset.name}</strong>
            </span>
            <button 
              className="btn btn-primary"
              onClick={() => handleTriggerScan(selectedPreset)}
              disabled={scanning}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Zap size={14} />
              Re-Scan Target
            </button>
          </div>
        </div>

        {/* Diagnostic Preset Feeds Picker */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
            Select Diagnostic Camera Feed
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleTriggerScan(preset)}
                disabled={scanning}
                style={{
                  background: selectedPreset.id === preset.id ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedPreset.id === preset.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  height: '60px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#0d111a',
                  marginBottom: '8px',
                  opacity: selectedPreset.id === preset.id ? 0.9 : 0.5,
                  transition: 'all 0.2s'
                }}>
                  {preset.svgBackground}
                </div>
                <strong style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {preset.name}
                </strong>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Defect: {preset.type}
                </span>
              </button>
            ))}
          </div>

          <div style={{
            margin: '16px 0',
            height: '1px',
            backgroundColor: 'var(--border-subtle)'
          }} />

          {/* Upload Button Option */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Upload Defect Photo</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scan citizen smartphone photos for potholes and cracks</p>
            </div>
            <label className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
              <Upload size={14} />
              Browse Image
              <input type="file" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      </div>

      {/* AI Telemetry Logs & Escalation (Right) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Telemetry Report Card */}
        {scannedData ? (
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  color: 'var(--accent)',
                  border: '1px solid var(--border-glow)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(14, 165, 233, 0.05)'
                }}>
                  NODE_ID: {scannedData.id.toUpperCase()}
                </span>
                
                <span className={`badge ${getSeverityBadgeClass(scannedData.severity)}`}>
                  <AlertTriangle size={12} />
                  {scannedData.severity} Severity
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Defect Audit Report
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Analysis generated via Roadwatch Core-Vision V3 Neural Net.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Defect Classification */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classification:</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{scannedData.type}</strong>
                </div>

                {/* Sub-defects found */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Detected Elements:</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{scannedData.defectCount} instances</strong>
                </div>

                {/* Damage Index Metric */}
                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Damage Index:</span>
                    <strong style={{ 
                      fontSize: '0.85rem', 
                      color: scannedData.damage > 70 ? 'var(--danger)' : scannedData.damage > 40 ? 'var(--warning)' : 'var(--secondary)' 
                    }}>
                      {scannedData.damage}% Severe
                    </strong>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${scannedData.damage}%`,
                      height: '100%',
                      backgroundColor: scannedData.damage > 70 ? 'var(--danger)' : scannedData.damage > 40 ? 'var(--warning)' : 'var(--secondary)'
                    }}></div>
                  </div>
                </div>

                {/* Recommended Remediation Action */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginTop: '10px'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Recommended Action
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {scannedData.action}
                  </p>
                </div>

              </div>
            </div>

            {/* Escalation Action Button */}
            <div style={{ marginTop: '24px' }}>
              <button 
                className="btn btn-success" 
                onClick={() => onEscalateToComplaint({
                  defectType: scannedData.type,
                  severity: scannedData.severity,
                  description: `AI Visual Scan reports ${scannedData.type} defect with ${scannedData.damage}% damage index at ${scannedData.name}. Recommendation: ${scannedData.action}.`
                })}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Plus size={16} />
                Lodge Smart Complaint
              </button>
              <p style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: '8px',
                lineHeight: 1.3
              }}>
                Lodging will automatically route telemetry diagnostics and bounding-box coordinates to the respective authority desk.
              </p>
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Cpu size={32} className="neon-text-blue" style={{ animation: 'pulse 1.5s infinite', marginBottom: '16px' }} />
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Awaiting Diagnostics</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px', marginTop: '6px' }}>
              Please trigger a neural scan on the left pane to generate visual damage coordinates and telemetry.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
