import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapContainerView from './components/MapContainer';
import DashboardView from './components/DashboardView';
import AIHealthMonitor from './components/AIHealthMonitor';
import ComplaintsPortal from './components/ComplaintsPortal';
import ContractorAccountability from './components/ContractorAccountability';
import AIChatbot from './components/AIChatbot';

import { 
  MOCK_ROADS, 
  MOCK_COMPLAINTS, 
  getCountryStats, 
  COUNTRIES 
} from './data/mockData';

import { 
  Shield, 
  TrendingUp, 
  Eye, 
  Users, 
  Globe, 
  Award, 
  HeartHandshake, 
  Zap, 
  Lock, 
  CheckCircle,
  Database,
  Search
} from 'lucide-react';

export default function App() {
  // Views: 'landing', 'login', 'dashboard'
  const [view, setView] = useState('landing');
  const [currentRole, setCurrentRole] = useState('citizen'); // citizen, authority, admin
  const [selectedCountry, setSelectedCountry] = useState('IN'); // IN, US, GB, AU, AE
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('map');
  const [roads, setRoads] = useState(MOCK_ROADS);
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [highlightedContractorId, setHighlightedContractorId] = useState(null);
  const [escalatedComplaint, setEscalatedComplaint] = useState(null);

  // Auto geocode helper coordinates based on country center changes
  useEffect(() => {
    // When selectedCountry changes, default the active tab to 'map'
    setActiveTab('map');
  }, [selectedCountry]);

  // Handle escalating an AI-scanned defect into the Complaints tab
  const handleEscalateToComplaint = (defectData) => {
    setEscalatedComplaint(defectData);
    setActiveTab('complaints');
  };

  // Click on a contractor in the map sidebar takes us to Contractor tab & filters
  const handleSelectContractor = (contractor) => {
    setHighlightedContractorId(contractor.id);
    setActiveTab('contractors');
  };

  // Inspect defect clicked on map takes us to Complaints tab & opens details
  const handleInspectComplaint = (complaint) => {
    setActiveTab('complaints');
  };

  // Update road quality dynamically after authority completes a repair work order
  const updateRoadQuality = (roadId, amount) => {
    setRoads(prevRoads => ({
      ...prevRoads,
      [selectedCountry]: prevRoads[selectedCountry].map(r => {
        if (r.id === roadId) {
          const newQuality = Math.min(100, r.qualityScore + amount);
          let newRisk = r.riskLevel;
          if (newQuality > 75) newRisk = 'Low';
          else if (newQuality > 50) newRisk = 'Medium';
          
          return {
            ...r,
            qualityScore: newQuality,
            riskLevel: newRisk,
            complaintCount: Math.max(0, r.complaintCount - 1),
            potholesCount: r.potholesCount > 0 ? r.potholesCount - 1 : 0
          };
        }
        return r;
      })
    }));
  };

  // Calculate stats dynamically based on current modified states
  const activeRoadsList = roads[selectedCountry];
  const activeComplaintsList = complaints;
  const currentStats = getCountryStats(selectedCountry, activeRoadsList, activeComplaintsList.filter(c => c.country === selectedCountry));

  // Enter Console Login bypass
  const handleBypassLogin = (roleToSet) => {
    setCurrentRole(roleToSet);
    setView('dashboard');
    setActiveTab('map');
  };

  return (
    <>
      {/* 1. STARTUP LANDING PAGE VIEW */}
      {view === 'landing' && (
        <div style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at 10% 20%, #0d152a 0%, #060913 90%)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          overflowY: 'auto'
        }}>
          {/* Header Branding */}
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 40px',
            maxWidth: '1280px',
            margin: '0 auto',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px var(--primary-glow)'
              }}>
                <Shield size={16} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                ROAD<span className="neon-text-blue">WATCH</span> AI
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleBypassLogin('citizen')}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Citizen Portal
              </button>
              <button 
                onClick={() => setView('login')}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Console Sign In
              </button>
            </div>
          </nav>

          {/* Hero Pitch Section */}
          <header style={{
            maxWidth: '900px',
            margin: '80px auto 40px auto',
            textAlign: 'center',
            padding: '0 20px',
            position: 'relative'
          }}>
            {/* IITM Hackathon Ribbon Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              padding: '6px 16px',
              marginBottom: '24px'
            }}>
              <Award size={14} className="neon-text-green" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                IIT Madras National Road Safety Hackathon 2026 Submission
              </span>
            </div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              The AI-Powered <span className="neon-text-blue">Accountability Layer</span> <br />
              for Public Infrastructure
            </h1>
            
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto 32px auto'
            }}>
              Fusing automated neural defect detection, transparent spatial integrity mapping, and algorithmic contractor audit log sheets to establish fraud-free governance.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button 
                onClick={() => handleBypassLogin('citizen')}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <Zap size={18} />
                Launch Live Dashboard
              </button>
              <button 
                onClick={() => setView('login')}
                className="btn btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <Lock size={16} />
                Auditor Handshake
              </button>
            </div>
          </header>

          {/* System Key Telemetry Strip */}
          <section style={{ maxWidth: '1080px', margin: '40px auto 80px auto', padding: '0 20px' }}>
            <div className="glass-panel" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              padding: '30px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>5</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Audited Nations
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>4,800 KM+</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Highway Mapped
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>96.2%</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Scanning Accuracy
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>₹250 Cr+</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Public Funds Logged
                </p>
              </div>
            </div>
          </section>

          {/* Features Pitch Grid */}
          <section style={{
            maxWidth: '1100px',
            margin: '0 auto 100px auto',
            padding: '0 20px'
          }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '40px' }}>Core Ecosystem Protocols</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <Globe size={28} className="neon-text-blue" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Global Geolocation Routing</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Instantly switch between India, USA, UK, Australia, and UAE. The dashboard automatically syncs regional currencies, local highways department APIs, and contractor licensing rules.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <TrendingUp size={28} className="neon-text-green" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Transparency Ledger</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Visualizes spending ratios, maintenance logs, and contract bidding histories. Outlines budget discrepancy risks dynamically to flag anomalies.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <Database size={28} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>AI Neural Defect Scanner</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Utilizes visual neural nets to analyze pavement camera logs for potholes and cracks, estimating exact damage percentages and generating remediation reports automatically.
                </p>
              </div>
            </div>
          </section>

          {/* IIT Madras Footer footer */}
          <footer style={{
            textAlign: 'center',
            padding: '40px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            © 2026 ROADWATCH AI • Developed for IIT Madras National Road Safety Hackathon • Under licensing guidelines.
          </footer>
        </div>
      )}

      {/* 2. CONSOLE LOGIN GATE VIEW */}
      {view === 'login' && (
        <div style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at 10% 20%, #0d152a 0%, #060913 90%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'var(--font-body)',
          color: '#fff'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 0 15px var(--primary-glow)'
              }}>
                <Lock size={20} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Console Handshake</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Authenticate to dispatch works or bypass audit overrides
              </p>
            </div>

            {/* Simulated Credentials info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}>
              <strong>Bypass Notice:</strong> Select target console role below to test full administrative and highway authority routing workflows instantly.
            </div>

            {/* Quick access bypass buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => handleBypassLogin('citizen')}
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
              >
                Enter as Citizen Auditor
              </button>
              <button 
                onClick={() => handleBypassLogin('authority')}
                className="btn btn-primary"
                style={{ justifyContent: 'center' }}
              >
                Enter as GCC Highway Authority
              </button>
              <button 
                onClick={() => handleBypassLogin('admin')}
                className="btn btn-danger"
                style={{ justifyContent: 'center' }}
              >
                Enter as Root System Admin
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <button 
                onClick={() => setView('landing')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textDecoration: 'underline'
                }}
              >
                Return to Landing Page
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. CORE INSTRUMENT CONTROL DESK (MAIN DASHBOARD VIEW) */}
      {view === 'dashboard' && (
        <div className="app-container">
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            currentRole={currentRole} 
            setCurrentRole={setCurrentRole}
            setView={setView}
          />

          {/* Main Area */}
          <div className="main-content">
            <Header 
              activeTab={activeTab}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              currentRole={currentRole}
              stats={currentStats}
            />

            {/* Dashboard Content */}
            <main className="page-container">
              {activeTab === 'map' && (
                <MapContainerView 
                  selectedCountry={selectedCountry}
                  roads={roads[selectedCountry]}
                  complaints={complaints}
                  onSelectContractor={handleSelectContractor}
                  onInspectComplaint={handleInspectComplaint}
                />
              )}

              {activeTab === 'transparency' && (
                <DashboardView 
                  selectedCountry={selectedCountry}
                  roads={roads[selectedCountry]}
                  complaints={complaints}
                  stats={currentStats}
                />
              )}

              {activeTab === 'ai-health' && (
                <AIHealthMonitor 
                  onEscalateToComplaint={handleEscalateToComplaint}
                />
              )}

              {activeTab === 'complaints' && (
                <ComplaintsPortal 
                  selectedCountry={selectedCountry}
                  roads={roads[selectedCountry]}
                  complaints={complaints}
                  setComplaints={setComplaints}
                  updateRoadQuality={updateRoadQuality}
                  currentRole={currentRole}
                  escalatedComplaint={escalatedComplaint}
                  setEscalatedComplaint={setEscalatedComplaint}
                />
              )}

              {activeTab === 'contractors' && (
                <ContractorAccountability 
                  selectedCountry={selectedCountry}
                  roads={roads[selectedCountry]}
                  complaints={complaints}
                  highlightedContractorId={highlightedContractorId}
                  clearHighlight={() => setHighlightedContractorId(null)}
                />
              )}
            </main>

            {/* Floating Chatbot Assistant */}
            <AIChatbot 
              selectedCountry={selectedCountry}
              roads={roads[selectedCountry]}
              complaints={complaints}
            />
          </div>
        </div>
      )}
    </>
  );
}
