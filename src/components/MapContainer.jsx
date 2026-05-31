import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import { COUNTRIES, CONTRACTORS } from '../data/mockData';
import { 
  ShieldAlert, 
  User, 
  Calendar, 
  Activity, 
  Coins, 
  X, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';

// Import leaflet styles directly so it renders correctly
import 'leaflet/dist/leaflet.css';

// Hook to update map view when center changes
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapContainerView({ 
  selectedCountry, 
  roads, 
  complaints,
  onSelectContractor,
  onInspectComplaint 
}) {
  const [selectedRoad, setSelectedRoad] = useState(null);
  const countryConfig = COUNTRIES[selectedCountry];
  
  // Close detail drawer when country changes
  useEffect(() => {
    setSelectedRoad(null);
  }, [selectedCountry]);

  // Helpers
  const getRoadRiskColor = (road) => {
    if (road.riskLevel === 'High') return 'var(--danger)';
    if (road.riskLevel === 'Medium') return 'var(--warning)';
    return 'var(--secondary)';
  };

  const getSeverityColor = (sev) => {
    if (sev === 'Critical') return 'var(--danger)';
    if (sev === 'High') return 'var(--warning)';
    return 'var(--info)';
  };

  const formatCurrency = (val) => {
    const symbol = countryConfig.currency;
    if (val >= 10000000 && selectedCountry === 'IN') {
      return `${symbol}${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000 && selectedCountry === 'IN') {
      return `${symbol}${(val / 100000).toFixed(1)} L`;
    }
    return `${symbol}${val.toLocaleString()}`;
  };

  const activeContractor = selectedRoad 
    ? CONTRACTORS.find(c => c.id === selectedRoad.contractorId) 
    : null;

  // Filter complaints for current country
  const countryComplaints = complaints.filter(c => c.country === selectedCountry);

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - var(--header-height) - 48px)',
      gap: '20px',
      position: 'relative'
    }}>
      {/* Map Container */}
      <div className="glass-panel" style={{
        flex: 1,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 1
      }}>
        <MapContainer 
          center={countryConfig.center} 
          zoom={countryConfig.zoom} 
          style={{ width: '100%', height: '100%', background: '#0a0e1a' }}
          zoomControl={true}
        >
          {/* CartoDB Dark Matter tile layer for futuristic look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapController center={countryConfig.center} zoom={countryConfig.zoom} />

          {/* Road Polylines */}
          {roads.map((road) => {
            const riskColor = getRoadRiskColor(road);
            const isSelected = selectedRoad?.id === road.id;

            return (
              <Polyline
                key={road.id}
                positions={road.coordinates}
                pathOptions={{
                  color: isSelected ? 'var(--accent)' : riskColor,
                  weight: isSelected ? 8 : 5,
                  opacity: isSelected ? 1 : 0.75,
                  lineCap: 'round',
                  lineJoin: 'round',
                  dashArray: road.riskLevel === 'High' ? '4, 8' : null // Dash high risk roads
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedRoad(road);
                  },
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      opacity: 1,
                      weight: isSelected ? 8 : 7
                    });
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      opacity: isSelected ? 1 : 0.75,
                      weight: isSelected ? 8 : 5
                    });
                  }
                }}
              />
            );
          })}

          {/* Complaint Dot Markers */}
          {countryComplaints.map((complaint) => {
            const color = getSeverityColor(complaint.severity);
            return (
              <CircleMarker
                key={complaint.id}
                center={complaint.coordinates}
                radius={8}
                pathOptions={{
                  fillColor: color,
                  color: '#ffffff',
                  weight: 1.5,
                  opacity: 1,
                  fillOpacity: 0.95
                }}
              >
                <Popup>
                  <div style={{
                    color: '#fff',
                    background: '#0d1426',
                    padding: '4px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="badge" style={{
                        backgroundColor: color + '20',
                        color: color,
                        border: `1px solid ${color}35`,
                        padding: '1px 6px',
                        fontSize: '0.65rem'
                      }}>
                        {complaint.severity}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{complaint.id}</span>
                    </div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>{complaint.defectType}</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '8px', lineHeight: 1.3 }}>
                      {complaint.description}
                    </p>
                    <button 
                      onClick={() => onInspectComplaint(complaint)}
                      className="btn btn-primary" 
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                    >
                      Inspect Timeline
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating Quick Map Legend */}
        <div className="glass-panel" style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 10,
          padding: '12px 16px',
          background: 'rgba(9, 14, 26, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px'
        }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Risk Map Legend
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '4px', backgroundColor: 'var(--secondary)', borderRadius: '2px' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>Low Corruption Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '4px', backgroundColor: 'var(--warning)', borderRadius: '2px' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>Medium Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '4px', borderTop: '4px dashed var(--danger)' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>High Risk (Suspicious Spending)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--danger)', display: 'inline-block' }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>Critical Issue Marker</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-Panel Inspector Drawer */}
      {selectedRoad ? (
        <div className="glass-panel animate-fade-in" style={{
          width: '380px',
          background: 'rgba(9, 14, 26, 0.95)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <span className="badge" style={{
                backgroundColor: selectedRoad.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.15)' : selectedRoad.riskLevel === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: selectedRoad.riskLevel === 'High' ? 'var(--danger)' : selectedRoad.riskLevel === 'Medium' ? 'var(--warning)' : 'var(--secondary)',
                border: `1px solid ${selectedRoad.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.3)' : selectedRoad.riskLevel === 'Medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
              }}>
                {selectedRoad.riskLevel} Risk Flag
              </span>
              <h3 style={{ fontSize: '1.2rem', marginTop: '6px', color: 'var(--text-primary)' }}>{selectedRoad.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedRoad.type} • {selectedRoad.authority}</p>
            </div>
            <button 
              onClick={() => setSelectedRoad(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Details Scroll Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Scorecard Radial Section */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {/* Quality Score */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Quality Index
                </span>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  marginTop: '4px',
                  color: selectedRoad.qualityScore > 80 ? 'var(--secondary)' : selectedRoad.qualityScore > 60 ? 'var(--warning)' : 'var(--danger)'
                }}>
                  {selectedRoad.qualityScore}%
                </div>
              </div>

              {/* Transparency Score */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Transparency
                </span>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  marginTop: '4px',
                  color: selectedRoad.transparencyScore > 80 ? 'var(--secondary)' : selectedRoad.transparencyScore > 60 ? 'var(--warning)' : 'var(--danger)'
                }}>
                  {selectedRoad.transparencyScore}/100
                </div>
              </div>
            </div>

            {/* Corruption Red Flags / Alerts */}
            {selectedRoad.riskLevel === 'High' && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                gap: '10px'
              }}>
                <ShieldAlert size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)' }}>Corruption Audit Alert</h4>
                  <ul style={{ fontSize: '0.72rem', color: '#fca5a5', paddingLeft: '14px', marginTop: '4px', lineHeight: 1.4 }}>
                    {selectedRoad.budgetUtilized > selectedRoad.budgetSanctioned && (
                      <li>Excessive spending anomaly: Budget overrun of {((selectedRoad.budgetUtilized - selectedRoad.budgetSanctioned)/selectedRoad.budgetSanctioned*100).toFixed(0)}%.</li>
                    )}
                    <li>Frequent relaying logs: {selectedRoad.repairHistory.length} interventions in the past 18 months.</li>
                    <li>Quality remains substandard despite premium resource allocations.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contractor Information */}
            {activeContractor && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Lead Contractor
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{activeContractor.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rating:</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: activeContractor.rating > 4 ? 'var(--secondary)' : activeContractor.rating > 2.5 ? 'var(--warning)' : 'var(--danger)' }}>
                        ★ {activeContractor.rating.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectContractor(activeContractor)}
                    style={{
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      color: 'var(--accent)',
                      borderRadius: '6px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Financial Telemetry */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Financial Auditing
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Coins size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Sanctioned:</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(selectedRoad.budgetSanctioned)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} style={{ color: selectedRoad.budgetUtilized > selectedRoad.budgetSanctioned ? 'var(--danger)' : 'var(--secondary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Utilized:</span>
                </div>
                <strong style={{ color: selectedRoad.budgetUtilized > selectedRoad.budgetSanctioned ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {formatCurrency(selectedRoad.budgetUtilized)}
                </strong>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: '4px' }}>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, (selectedRoad.budgetUtilized / selectedRoad.budgetSanctioned) * 100)}%`,
                    height: '100%',
                    backgroundColor: selectedRoad.budgetUtilized > selectedRoad.budgetSanctioned ? 'var(--danger)' : 'var(--secondary)'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Efficiency Ratio</span>
                  <span>{((selectedRoad.budgetUtilized / selectedRoad.budgetSanctioned) * 100).toFixed(0)}% Utilized</span>
                </div>
              </div>
            </div>

            {/* Repair & Maintenance History */}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                Maintenance Logs ({selectedRoad.repairHistory.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedRoad.repairHistory.map((log, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '12px',
                    position: 'relative',
                    paddingBottom: index < selectedRoad.repairHistory.length - 1 ? '12px' : 0
                  }}>
                    {/* Vertical connector line */}
                    {index < selectedRoad.repairHistory.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '7px',
                        top: '16px',
                        bottom: 0,
                        width: '1px',
                        backgroundColor: 'var(--border-subtle)'
                      }}></div>
                    )}
                    
                    {/* Dot */}
                    <div style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      border: '1px solid var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      marginTop: '2px'
                    }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
                    </div>

                    {/* Content */}
                    <div style={{ fontSize: '0.8rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{log.type}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {log.date}
                        </span>
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>Cost: {formatCurrency(log.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.01)'
          }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Construction: {selectedRoad.constructionDate}</span>
              <span>•</span>
              <span>Last Relaying: {selectedRoad.lastRelayingDate}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{
          width: '380px',
          background: 'rgba(9, 14, 26, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Activity size={28} className="neon-text-blue" />
          </div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Road Selected
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Click on any color-coded highway or city road line on the interactive map to review contractor bids, spending efficiency, repair timelines, and public complaint logs.
          </p>
        </div>
      )}
    </div>
  );
}
