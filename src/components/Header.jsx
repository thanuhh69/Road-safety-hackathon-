import React from 'react';
import { COUNTRIES } from '../data/mockData';
import { 
  Globe, 
  Percent, 
  TrendingUp, 
  FileWarning, 
  UserCheck, 
  Settings, 
  ShieldAlert 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  selectedCountry, 
  setSelectedCountry, 
  currentRole,
  stats
}) {
  const countryData = COUNTRIES[selectedCountry];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'map': return { title: 'Interactive Road Quality Map', subtitle: 'Real-time smart-city spatial audits and contractor transparency layers' };
      case 'transparency': return { title: 'Transparency & Integrity Ledger', subtitle: 'Corruption risk metrics, budget auditing dashboards, and anomalous spending alerts' };
      case 'ai-health': return { title: 'AI Road Health Monitoring', subtitle: 'Automated computer vision scans for potholes, crack grading, and severity analysis' };
      case 'complaints': return { title: 'Smart Citizen Complaints', subtitle: 'Interactive defect reporting, autonomous routing, and resolution timeline tracking' };
      case 'contractors': return { title: 'Contractor Accountability Matrix', subtitle: 'Performance records, budget utilizations, complaint resolution speed, and risk indexes' };
      default: return { title: 'Roadwatch AI Control Panel', subtitle: 'Smart governance and highway infrastructure integrity platform' };
    }
  };

  const { title, subtitle } = getTabTitle();

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'authority': return { icon: Settings, color: 'var(--primary)', label: 'Authority Console' };
      case 'admin': return { icon: ShieldAlert, color: 'var(--danger)', label: 'Root Admin' };
      default: return { icon: UserCheck, color: 'var(--secondary)', label: 'Citizen Console' };
    }
  };

  const role = getRoleIcon();
  const RoleIcon = role.icon;

  // Formatter for currency
  const formatCurrency = (val) => {
    if (val >= 10000000) {
      return `${countryData.currency}${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `${countryData.currency}${(val / 100000).toFixed(1)} L`;
    }
    return `${countryData.currency}${val.toLocaleString()}`;
  };

  return (
    <header className="glass-panel" style={{
      height: 'var(--header-height)',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width)',
      borderRadius: '0 0 0 24px',
      borderTop: 'none',
      borderRight: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 90
    }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {subtitle}
        </p>
      </div>

      {/* Global & Role Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Country Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} className="neon-text-blue" />
          <select 
            value={selectedCountry} 
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="form-select"
            style={{
              padding: '6px 32px 6px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(255,255,255,0.03) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394A3B8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 8px center',
              backgroundSize: '16px',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              width: 'auto'
            }}
          >
            {Object.entries(COUNTRIES).map(([code, data]) => (
              <option key={code} value={code} style={{ background: '#0a0e1a', color: '#fff' }}>
                {data.flag} {data.name}
              </option>
            ))}
          </select>
        </div>

        {/* Global Live Stats Strip */}
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '6px 16px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.01)',
          fontSize: '0.8rem',
          border: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Percent size={14} className="neon-text-green" />
            <span style={{ color: 'var(--text-secondary)' }}>Score:</span>
            <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{stats.avgTransparency}/100</span>
          </div>

          <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} className="neon-text-blue" />
            <span style={{ color: 'var(--text-secondary)' }}>Budget Util:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {((stats.totalBudgetUtilized / stats.totalBudgetSanctioned) * 100).toFixed(0)}%
            </span>
          </div>

          <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileWarning size={14} className="neon-text-red" />
            <span style={{ color: 'var(--text-secondary)' }}>Risks:</span>
            <span style={{ fontWeight: 700, color: stats.highRiskRoads > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
              {stats.highRiskRoads} Red Flags
            </span>
          </div>
        </div>

        {/* User Role Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          background: role.color + '15',
          border: `1px solid ${role.color}35`,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#fff'
        }}>
          <RoleIcon size={14} style={{ color: role.color }} />
          <span>{role.label}</span>
        </div>

      </div>
    </header>
  );
}
