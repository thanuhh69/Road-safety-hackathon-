import React from 'react';
import { COUNTRIES } from '../data/mockData';
import { 
  Building2, 
  FileWarning, 
  Coins, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  ShieldAlert, 
  RefreshCw 
} from 'lucide-react';

export default function DashboardView({ 
  selectedCountry, 
  roads, 
  complaints, 
  stats 
}) {
  const countryConfig = COUNTRIES[selectedCountry];

  // Format currencies
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

  // Find anomalous projects (High Risk roads)
  const anomalies = roads.filter(r => r.riskLevel === 'High' || r.budgetUtilized > r.budgetSanctioned);

  // Dynamic Chart calculations
  const totalRoads = roads.length;
  const highRiskCount = roads.filter(r => r.riskLevel === 'High').length;
  const medRiskCount = roads.filter(r => r.riskLevel === 'Medium').length;
  const lowRiskCount = roads.filter(r => r.riskLevel === 'Low').length;

  const highPct = totalRoads > 0 ? Math.round((highRiskCount / totalRoads) * 100) : 0;
  const medPct = totalRoads > 0 ? Math.round((medRiskCount / totalRoads) * 100) : 0;
  const lowPct = totalRoads > 0 ? Math.round((lowRiskCount / totalRoads) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      
      {/* 4 Stats Grid Cards */}
      <div className="grid-dashboard">
        {/* Card 1: Budget Utilization */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Coins size={22} className="neon-text-blue" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Spent / Sanctioned Budget
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '2px' }}>
              {formatCurrency(stats.totalBudgetUtilized)}
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Total: {formatCurrency(stats.totalBudgetSanctioned)}
            </span>
          </div>
        </div>

        {/* Card 2: Transparency Score */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={22} className="neon-text-green" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              National Transparency Score
            </span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginTop: '2px' }}>
              {stats.avgTransparency}/100
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              State Average: A+ Grade
            </span>
          </div>
        </div>

        {/* Card 3: Complaints Resolution */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={22} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Citizen Issues Resolved
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '2px' }}>
              {stats.resolvedComplaints} / {stats.totalComplaints}
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Pending: {stats.pendingComplaints} unresolved tickets
            </span>
          </div>
        </div>

        {/* Card 4: Red Flagged Audit Alerts */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: stats.highRiskRoads > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            border: stats.highRiskRoads > 0 ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={22} style={{ color: stats.highRiskRoads > 0 ? 'var(--danger)' : 'var(--text-secondary)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Corruption Audit Red Flags
            </span>
            <h3 style={{ fontSize: '1.25rem', color: stats.highRiskRoads > 0 ? 'var(--danger)' : '#fff', marginTop: '2px' }}>
              {stats.highRiskRoads} Suspicious Projects
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Risk Level: {stats.highRiskRoads > 0 ? 'Critical Audit Required' : 'Optimal'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid (Interactive Custom SVGs) */}
      <div className="grid-2col">
        
        {/* Chart 1: Budget Sanctioned vs Spent for Roads */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} className="neon-text-blue" />
            Budget Discrepancy Auditing (Sanctioned vs Utilized)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {roads.map((road) => {
              const maxVal = Math.max(...roads.map(r => Math.max(r.budgetSanctioned, r.budgetUtilized)));
              const sanctionedWidth = (road.budgetSanctioned / maxVal) * 100;
              const utilizedWidth = (road.budgetUtilized / maxVal) * 100;
              const overrun = road.budgetUtilized > road.budgetSanctioned;

              return (
                <div key={road.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{road.name}</span>
                    <span style={{ fontSize: '0.72rem', color: overrun ? 'var(--danger)' : 'var(--text-secondary)' }}>
                      Spent: {formatCurrency(road.budgetUtilized)} / Budget: {formatCurrency(road.budgetSanctioned)}
                    </span>
                  </div>
                  
                  {/* Visual Bar tracks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* Sanctioned Bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '3px', position: 'relative' }}>
                      <div style={{
                        width: `${sanctionedWidth}%`,
                        height: '100%',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '3px',
                        transition: 'width 0.8s ease'
                      }}></div>
                    </div>

                    {/* Utilized Bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '3px', position: 'relative' }}>
                      <div style={{
                        width: `${utilizedWidth}%`,
                        height: '100%',
                        backgroundColor: overrun ? 'var(--danger)' : 'var(--primary)',
                        boxShadow: overrun ? '0 0 8px var(--danger-glow)' : '0 0 8px var(--primary-glow)',
                        borderRadius: '3px',
                        transition: 'width 0.8s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '0.7rem', color: 'var(--text-secondary)', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '1px' }}></div>
              <span>Sanctioned Budget Allocation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '1px' }}></div>
              <span>Utilized (Under Budget)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '6px', backgroundColor: 'var(--danger)', borderRadius: '1px' }}></div>
              <span>Over Budget (Anomaly Flagged)</span>
            </div>
          </div>

        </div>

        {/* Chart 2: Corruption Risk Allocation */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} className="neon-text-blue" />
              Infrastructure Corruption Risk Distribution
            </h3>
            
            {/* Horizontal Split Bar Chart */}
            <div style={{
              display: 'flex',
              height: '32px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginTop: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: `${lowPct}%`, backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }} title="Low Risk">
                {lowPct > 10 ? `${lowPct}%` : ''}
              </div>
              <div style={{ width: `${medPct}%`, backgroundColor: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.72rem', fontWeight: 700 }} title="Medium Risk">
                {medPct > 10 ? `${medPct}%` : ''}
              </div>
              <div style={{ width: `${highPct}%`, backgroundColor: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }} title="High Risk">
                {highPct > 10 ? `${highPct}%` : ''}
              </div>
            </div>

            {/* Labels details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Low Risk (Standard performance indices)</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{lowRiskCount} Roads ({lowPct}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Medium Risk (Minor overruns / delays)</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{medRiskCount} Roads ({medPct}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>High Risk (Repetitive repairs & budget spikes)</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{highRiskCount} Roads ({highPct}%)</strong>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '0.75rem',
            lineHeight: 1.3,
            color: 'var(--text-muted)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <Building2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span>Risk grades are calculated hourly based on the ratio of spending to durability and verified public complaint density.</span>
          </div>

        </div>

      </div>

      {/* AI Corruption Risk Detections Logs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} className="neon-text-red" />
          Live Corruption Audit Flags
        </h3>

        {anomalies.length === 0 ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No financial or logistical anomalies detected in current country database.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {anomalies.map((road) => {
              const overrunAmt = road.budgetUtilized - road.budgetSanctioned;
              const overrunPct = ((overrunAmt / road.budgetSanctioned) * 100).toFixed(0);

              return (
                <div key={road.id} style={{
                  padding: '14px 16px',
                  background: 'rgba(239, 68, 68, 0.02)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <ShieldAlert size={18} style={{ color: 'var(--danger)', marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{road.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Type: {road.type} • Authority: {road.authority}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '4px', lineHeight: 1.3 }}>
                        Reason: {overrunAmt > 0 ? `Budget overrun of ${overrunPct}% (${formatCurrency(overrunAmt)} extra). ` : ''}
                        Repetitive resurfacing interventions ({road.repairHistory.length} logs in 18 months). SUBSTANDARD DURABILITY score.
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-high" style={{ marginBottom: '6px' }}>🔴 Audit High Risk</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quality Index: {road.qualityScore}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
