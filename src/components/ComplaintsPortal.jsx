import React, { useState, useEffect } from 'react';
import { COUNTRIES, CONTRACTORS } from '../data/mockData';
import { 
  FileText, 
  Plus, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  Send, 
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Hammer
} from 'lucide-react';

export default function ComplaintsPortal({ 
  selectedCountry, 
  roads, 
  complaints, 
  setComplaints,
  updateRoadQuality,
  currentRole,
  escalatedComplaint, // Passed if coming from AI Health Monitor
  setEscalatedComplaint
}) {
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' or 'new'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Form States for New Complaint
  const [selectedRoadId, setSelectedRoadId] = useState('');
  const [defectType, setDefectType] = useState('Pothole');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [reporterName, setReporterName] = useState('');

  // Authority Form States
  const [assigneeContractorId, setAssigneeContractorId] = useState('');
  const [authorityComment, setAuthorityComment] = useState('');

  const countryConfig = COUNTRIES[selectedCountry];
  const countryRoads = roads.filter(r => r.id.startsWith(selectedCountry.toLowerCase()) || r.authority.includes(countryConfig.name));
  
  // If we have an escalated complaint from the AI health monitor, open the form and populate it!
  useEffect(() => {
    if (escalatedComplaint) {
      setActiveSubTab('new');
      setDefectType(escalatedComplaint.defectType);
      setSeverity(escalatedComplaint.severity);
      setDescription(escalatedComplaint.description);
      
      // Auto select first road of this country if available
      const firstRoad = roads[0];
      if (firstRoad) {
        setSelectedRoadId(firstRoad.id);
        setLocationName(`Segment near ${firstRoad.name}`);
      }
      
      // Reset escalation carrier
      setEscalatedComplaint(null);
    }
  }, [escalatedComplaint, roads, setEscalatedComplaint]);

  // Handle lodging new complaint
  const handleLodgeComplaint = (e) => {
    e.preventDefault();
    if (!selectedRoadId || !description || !locationName || !reporterName) {
      alert("Please fill all required fields.");
      return;
    }

    const selectedRoad = roads.find(r => r.id === selectedRoadId);
    const newId = `RW-${100 + complaints.length + 1}`;
    
    // Auto geocode: offset slightly from the road's start coordinates
    const roadStart = selectedRoad.coordinates[0];
    const latOffset = (Math.random() - 0.5) * 0.002;
    const lngOffset = (Math.random() - 0.5) * 0.002;
    const coordinates = [roadStart[0] + latOffset, roadStart[1] + lngOffset];

    const todayStr = new Date().toISOString().split('T')[0];

    const newComplaint = {
      id: newId,
      roadId: selectedRoad.id,
      roadName: selectedRoad.name,
      defectType,
      description,
      locationName,
      coordinates,
      severity,
      status: 'Reported',
      country: selectedCountry,
      reporterName,
      dateSubmitted: todayStr,
      image: 'user_uploaded.jpg',
      timeline: [
        { status: 'Reported', date: todayStr, comment: `Report submitted by citizen: ${reporterName}` }
      ]
    };

    setComplaints([newComplaint, ...complaints]);
    setSelectedComplaint(newComplaint);
    setActiveSubTab('list');
    
    // Reset Form
    setSelectedRoadId('');
    setDescription('');
    setLocationName('');
    setReporterName('');
  };

  // Handle Authority Actions
  const handleUpdateStatus = (complaintId, nextStatus, comment = "") => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const newTimeline = [...c.timeline, { 
          status: nextStatus, 
          date: todayStr, 
          comment: comment || `Status updated to ${nextStatus}.` 
        }];
        
        return {
          ...c,
          status: nextStatus,
          timeline: newTimeline
        };
      }
      return c;
    });

    setComplaints(updated);
    
    // Sync active inspector pane
    const updatedComp = updated.find(c => c.id === complaintId);
    setSelectedComplaint(updatedComp);

    // If marked Resolved, update road quality score and contractor stats dynamically!
    if (nextStatus === 'Resolved') {
      const comp = complaints.find(c => c.id === complaintId);
      // Boost quality score of the road since it was repaired
      updateRoadQuality(comp.roadId, 25); // increase quality score by 25% (cap 100)
    }
  };

  const handleAssignContractor = (complaintId) => {
    if (!assigneeContractorId) return;
    const contractor = CONTRACTORS.find(c => c.id === assigneeContractorId);
    const comment = `Work order dispatched. Assigned lead contractor: ${contractor.name}.`;
    
    // Advance status to "In Progress"
    handleUpdateStatus(complaintId, 'In Progress', comment);
    setAssigneeContractorId('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return 'var(--text-secondary)';
      case 'AI Analyzed': return 'var(--accent)';
      case 'Routed to Authority': return 'var(--info)';
      case 'In Progress': return 'var(--warning)';
      case 'Resolution Tracking': return 'var(--warning)';
      case 'Resolved': return 'var(--secondary)';
      default: return 'var(--text-muted)';
    }
  };

  const getSeverityColor = (sev) => {
    if (sev === 'Critical') return 'var(--danger)';
    if (sev === 'High') return 'var(--warning)';
    return 'var(--info)';
  };

  // Filter lists based on selected country
  const countryComplaints = complaints.filter(c => c.country === selectedCountry);
  const countryContractors = CONTRACTORS.filter(c => c.countries.includes(selectedCountry));

  return (
    <div className="grid-2col animate-fade-in">
      
      {/* List / Work Panel (Left) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Toggle between Lodge Form and Logs (Citizen Only) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn"
              onClick={() => setActiveSubTab('list')}
              style={{
                background: activeSubTab === 'list' ? 'var(--bg-card)' : 'transparent',
                border: activeSubTab === 'list' ? '1px solid var(--border-subtle)' : 'none',
                color: activeSubTab === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.85rem'
              }}
            >
              Complaints Log
            </button>
            {currentRole === 'citizen' && (
              <button 
                className="btn"
                onClick={() => setActiveSubTab('new')}
                style={{
                  background: activeSubTab === 'new' ? 'var(--bg-card)' : 'transparent',
                  border: activeSubTab === 'new' ? '1px solid var(--border-subtle)' : 'none',
                  color: activeSubTab === 'new' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  fontSize: '0.85rem'
                }}
              >
                Report Road Defect
              </button>
            )}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Active Tickets: {countryComplaints.length}
          </span>
        </div>

        {/* Complaints List tab */}
        {activeSubTab === 'list' ? (
          <div className="glass-panel" style={{ padding: '20px', maxHeight: '550px', overflowY: 'auto' }}>
            {countryComplaints.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active complaints reported in this country.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {countryComplaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
                  const sevColor = getSeverityColor(c.severity);
                  const statColor = getStatusColor(c.status);

                  return (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className="interactive-list-item"
                      style={{
                        padding: '14px 16px',
                        background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        {/* Status Light */}
                        <span className="pulse-dot" style={{
                          backgroundColor: statColor,
                          boxShadow: `0 0 8px ${statColor}`,
                          width: '8px',
                          height: '8px'
                        }}></span>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.defectType}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.id}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {c.roadName} • {c.locationName}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Severity Tag */}
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          color: sevColor,
                          border: `1px solid ${sevColor}35`,
                          background: sevColor + '10'
                        }}>
                          {c.severity}
                        </span>

                        {/* Status Label */}
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: statColor,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Report Form (Citizen Only) */
          <form className="glass-panel" onSubmit={handleLodgeComplaint} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              Submit Official Road Defect Report
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Select Road */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Select Affected Road *
                </label>
                <select 
                  value={selectedRoadId} 
                  onChange={(e) => setSelectedRoadId(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Road --</option>
                  {countryRoads.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                  ))}
                </select>
              </div>

              {/* Defect Type */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Defect Category *
                </label>
                <select 
                  value={defectType} 
                  onChange={(e) => setDefectType(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="Pothole">Pothole Cluster</option>
                  <option value="Waterlogging">Severe Flooding / Waterlogging</option>
                  <option value="Road Cracks">Fatigue Cracking</option>
                  <option value="Missing Signboards">Missing / Broken Signboard</option>
                  <option value="Streetlight Issues">Malfunctioning Streetlight</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Severity */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Audited Severity Level *
                </label>
                <select 
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="Low">Low - Minor cosmetic wear</option>
                  <option value="Medium">Medium - Standard structural issue</option>
                  <option value="High">High - Impedes traffic speed</option>
                  <option value="Critical">Critical - Major safety hazard / car damage</option>
                </select>
              </div>

              {/* Specific Location Description */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Landmark & Location Name *
                </label>
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Opposite Central Station, near Pillar 42"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Reporter Name */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Citizen Full Name / ID Number *
              </label>
              <input 
                type="text" 
                value={reporterName} 
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Anand Sen"
                className="form-input"
                required
              />
            </div>

            {/* Description Text */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Detailed Hazard Description *
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe size of potholes, waterlogging depth, or exact safety risks..."
                rows="3"
                className="form-textarea"
                required
              ></textarea>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Send size={16} />
              Submit Official Complaint to {countryConfig.authorities[0].split(" ")[0]}
            </button>
          </form>
        )}
      </div>

      {/* Audit & Timeline Inspector (Right) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {selectedComplaint ? (
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* Ticket Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--accent)' }}>
                  TICKET: {selectedComplaint.id}
                </span>
                
                <span className="badge" style={{
                  backgroundColor: getStatusColor(selectedComplaint.status) + '15',
                  color: getStatusColor(selectedComplaint.status),
                  border: `1px solid ${getStatusColor(selectedComplaint.status)}35`
                }}>
                  {selectedComplaint.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{selectedComplaint.defectType} Report</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Road: <strong style={{ color: 'var(--text-primary)' }}>{selectedComplaint.roadName}</strong>
              </p>

              {/* Defect Description */}
              <div style={{
                margin: '16px 0',
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                lineHeight: 1.4,
                color: 'var(--text-primary)'
              }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '6px' }}>
                  <MapPin size={12} />
                  <span>{selectedComplaint.locationName}</span>
                </div>
                {selectedComplaint.description}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '8px' }}>
                  <User size={12} />
                  <span>Reported by: {selectedComplaint.reporterName} on {selectedComplaint.dateSubmitted}</span>
                </div>
              </div>

              {/* Timeline tracking */}
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Resolution Progress Workflow
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {selectedComplaint.timeline.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                      
                      {/* Connector Line */}
                      {idx < selectedComplaint.timeline.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '6px',
                          top: '14px',
                          bottom: '-14px',
                          width: '1px',
                          backgroundColor: 'var(--border-subtle)'
                        }}></div>
                      )}

                      {/* Icon dot */}
                      <div style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        backgroundColor: t.status === 'Resolved' ? 'var(--secondary)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        marginTop: '2px',
                        boxShadow: `0 0 6px ${t.status === 'Resolved' ? 'var(--secondary)' : 'var(--primary)'}`
                      }}>
                        {t.status === 'Resolved' && <CheckCircle2 size={8} color="#fff" />}
                      </div>

                      {/* Text */}
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{t.status}</strong>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.date}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>{t.comment}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Authority Action Panel (Rendered dynamically if user is in Authority role) */}
            {currentRole === 'authority' && (
              <div style={{
                marginTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px'
              }}>
                <h4 style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} />
                  Authority Action Controls
                </h4>

                {/* Step 1: AI analysis click if reported */}
                {selectedComplaint.status === 'Reported' && (
                  <button 
                    onClick={() => handleUpdateStatus(
                      selectedComplaint.id, 
                      'AI Analyzed', 
                      'AI Diagnostic Scanned: Volumetric defect audit triggered. Severity validated.'
                    )}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                  >
                    Run Neural Audit Check
                  </button>
                )}

                {/* Step 2: Route to contractor if AI analyzed */}
                {selectedComplaint.status === 'AI Analyzed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Select Dispatch Contractor:</label>
                    <select 
                      value={assigneeContractorId}
                      onChange={(e) => setAssigneeContractorId(e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '8px' }}
                    >
                      <option value="">-- Choose Contractor --</option>
                      {countryContractors.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (★{c.rating})</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleAssignContractor(selectedComplaint.id)}
                      disabled={!assigneeContractorId}
                      className="btn btn-success"
                      style={{ fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                    >
                      <Hammer size={12} />
                      Dispatch Work Order
                    </button>
                  </div>
                )}

                {/* Step 3: Mark resolved if In Progress */}
                {selectedComplaint.status === 'In Progress' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Add final inspection comment..." 
                      value={authorityComment}
                      onChange={(e) => setAuthorityComment(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '8px' }}
                    />
                    <button 
                      onClick={() => handleUpdateStatus(selectedComplaint.id, 'Resolved', authorityComment || "Defect successfully resolved and verified.")}
                      className="btn btn-success"
                      style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                    >
                      Verify & Mark Resolved
                    </button>
                  </div>
                )}

                {/* Step 4: Already resolved state */}
                {selectedComplaint.status === 'Resolved' && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--secondary)',
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    Ticket closed. Quality metrics updated.
                  </div>
                )}
              </div>
            )}
            
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <FileText size={32} className="neon-text-blue" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Select Ticket</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px', marginTop: '6px' }}>
              Choose a complaint ticket from the ledger to inspect its real-time audit logs and resolution progress tracking.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
