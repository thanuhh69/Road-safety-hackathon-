import React, { useState } from 'react';
import { COUNTRIES, CONTRACTORS } from '../data/mockData';
import { 
  Users, 
  Star, 
  ShieldAlert, 
  Activity, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

export default function ContractorAccountability({ 
  selectedCountry, 
  roads, 
  complaints,
  highlightedContractorId, // Passed if coming from Map click
  clearHighlight
}) {
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'risk', 'budget'
  const countryConfig = COUNTRIES[selectedCountry];

  // Filter contractors active in this country
  const countryContractors = CONTRACTORS.filter(c => c.countries.includes(selectedCountry));
  
  // Calculate dynamic stats for each contractor based on live complaints & roads state
  const contractorsWithLiveStats = countryContractors.map(c => {
    // Roads maintained in this country
    const maintainedRoads = roads.filter(r => r.contractorId === c.id);
    const roadNames = maintainedRoads.map(r => r.name);
    
    // Live complaints count
    const liveComplaints = complaints.filter(comp => comp.country === selectedCountry && maintainedRoads.some(r => r.id === comp.roadId));
    const totalComplaints = liveComplaints.length;
    const resolvedComplaints = liveComplaints.filter(comp => comp.status === 'Resolved').length;
    
    // Quality & transparency averages
    const avgQuality = maintainedRoads.length > 0 
      ? Math.round(maintainedRoads.reduce((sum, r) => sum + r.qualityScore, 0) / maintainedRoads.length)
      : c.qualityScore;

    // Budget efficiency
    const budgetAllocated = maintainedRoads.reduce((sum, r) => sum + r.budgetSanctioned, 0) || c.budgetAllocated;
    const budgetSpent = maintainedRoads.reduce((sum, r) => sum + r.budgetUtilized, 0) || c.budgetSpent;
    const budgetOverrun = budgetSpent > budgetAllocated;

    // Recalculate Risk Score dynamically based on quality, complaints, budget overrun
    let riskFactor = c.riskScore;
    if (budgetOverrun) riskFactor = Math.min(100, riskFactor + 15);
    if (avgQuality < 50) riskFactor = Math.min(100, riskFactor + 20);
    const activeCritical = liveComplaints.filter(comp => comp.severity === 'Critical' && comp.status !== 'Resolved').length;
    riskFactor = Math.min(100, riskFactor + (activeCritical * 10));

    return {
      ...c,
      roadsList: roadNames,
      totalComplaints,
      resolvedComplaints,
      avgQuality,
      budgetAllocated,
      budgetSpent,
      riskScore: riskFactor
    };
  });

  // Sort logic
  const sortedContractors = [...contractorsWithLiveStats].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating; // Leaderboard (best first)
    if (sortBy === 'risk') return b.riskScore - a.riskScore; // Audit alert (high risk first)
    if (sortBy === 'budget') {
      const aRatio = a.budgetSpent / a.budgetAllocated;
      const bRatio = b.budgetSpent / b.budgetAllocated;
      return bRatio - aRatio; // Highest spending ratio first
    }
    return 0;
  });

  const getRiskColor = (score) => {
    if (score >= 75) return 'var(--danger)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--secondary)';
  };

  const getRiskLabel = (score) => {
    if (score >= 75) return '🟢 Critical Risk';
    if (score >= 40) return '🟡 Medium Risk';
    return '🟢 Safe / Low Risk'; // Actually 🟢 low risk, 🟡 med risk, 🔴 high risk
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      
      {/* Controls Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} className="neon-text-blue" />
            National Contractor Audit Ledger
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Comparing {sortedContractors.length} active infrastructure contractors in {countryConfig.name}
          </p>
        </div>

        {/* Sorting Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Sort Audit:</span>
          
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setSortBy('rating')}
              style={{
                background: sortBy === 'rating' ? 'var(--primary)' : 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              ★ Performance Rating
            </button>
            <button
              onClick={() => setSortBy('risk')}
              style={{
                background: sortBy === 'risk' ? 'var(--danger)' : 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              ⚠️ Risk Index
            </button>
            <button
              onClick={() => setSortBy('budget')}
              style={{
                background: sortBy === 'budget' ? 'var(--accent)' : 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              💸 Budget Overruns
            </button>
          </div>
        </div>
      </div>

      {/* Highlighter Notification Alert if targeted */}
      {highlightedContractorId && (
        <div style={{
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid var(--primary)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
            Viewing details for: <strong>{contractorsWithLiveStats.find(c => c.id === highlightedContractorId)?.name}</strong>
          </span>
          <button 
            onClick={clearHighlight} 
            className="btn btn-secondary" 
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Contractor Leaderboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {sortedContractors
          .filter(c => !highlightedContractorId || c.id === highlightedContractorId)
          .map((c, index) => {
            const riskColor = getRiskColor(c.riskScore);
            const isCriticalRisk = c.riskScore >= 70;
            const utilizationRatio = c.budgetSpent / c.budgetAllocated;

            return (
              <div 
                key={c.id} 
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: isCriticalRisk ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-subtle)',
                  background: isCriticalRisk ? 'rgba(239, 68, 68, 0.02)' : 'var(--bg-card)'
                }}
              >
                {/* Header info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        RANK #{index + 1} • {c.id.toUpperCase()}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '2px' }}>{c.name}</h4>
                    </div>

                    {/* Star Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                      <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                      <strong style={{ fontSize: '0.8rem', color: '#fff' }}>{c.rating.toFixed(1)}</strong>
                    </div>
                  </div>

                  {/* Roads maintained tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {c.roadsList.map((road, i) => (
                      <span key={i} style={{
                        fontSize: '0.68rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: 'var(--text-secondary)'
                      }}>
                        🛣️ {road}
                      </span>
                    ))}
                    {c.roadsList.length === 0 && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>No roads currently assigned</span>
                    )}
                  </div>
                </div>

                {/* Risk and metrics section */}
                <div style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Risk Index bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={12} style={{ color: riskColor }} />
                        Corruption Risk Index
                      </span>
                      <strong style={{ color: riskColor }}>
                        {c.riskScore}% {isCriticalRisk ? '🔴 High Risk' : c.riskScore >= 40 ? '🟡 Medium' : '🟢 Low'}
                      </strong>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.riskScore}%`, height: '100%', backgroundColor: riskColor }}></div>
                    </div>
                  </div>

                  {/* Quality Index */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Repaired Durability Index:</span>
                    <strong style={{ color: c.avgQuality > 80 ? 'var(--secondary)' : c.avgQuality > 50 ? 'var(--warning)' : 'var(--danger)' }}>
                      {c.avgQuality}% Quality
                    </strong>
                  </div>

                  {/* Complaints Rate */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Public Defect Ratio:</span>
                    <strong style={{ color: c.totalComplaints > 15 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {c.totalComplaints} Logged ({c.resolvedCount} Resolved)
                    </strong>
                  </div>
                </div>

                {/* Financial overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Allocated:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(c.budgetAllocated)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Spent:</span>
                    <span style={{ color: utilizationRatio > 1.0 ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 600 }}>
                      {formatCurrency(c.budgetSpent)}
                    </span>
                  </div>
                  
                  {/* Budget overrun meter */}
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, utilizationRatio * 100)}%`,
                        height: '100%',
                        backgroundColor: utilizationRatio > 1.0 ? 'var(--danger)' : 'var(--primary)'
                      }}></div>
                    </div>
                    {utilizationRatio > 1.0 && (
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--danger)', marginTop: '2px', fontWeight: 600 }}>
                        ⚠️ Over-budget by {((utilizationRatio - 1.0) * 100).toFixed(0)}%! Auditing details flagged.
                      </span>
                    )}
                  </div>
                </div>

                {/* Audit reasons if high risk */}
                {isCriticalRisk && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.7rem',
                    color: '#fca5a5',
                    lineHeight: 1.3
                  }}>
                    <strong>Audit Flag:</strong> High repair frequency & budget inflation ratios. Suspicious contract recycling.
                  </div>
                )}

              </div>
            );
          })}
      </div>
      
    </div>
  );
}
