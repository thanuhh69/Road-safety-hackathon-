import React from 'react';
import { 
  Map, 
  BarChart3, 
  Cpu, 
  FileText, 
  Users, 
  ShieldAlert, 
  UserCheck, 
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole,
  setView
}) {
  const menuItems = [
    { id: 'map', label: 'Interactive Map', icon: Map, badge: null },
    { id: 'transparency', label: 'Transparency Stats', icon: BarChart3, badge: null },
    { id: 'ai-health', label: 'AI Health Monitor', icon: Cpu, badge: 'AI' },
    { id: 'complaints', label: 'Smart Complaints', icon: FileText, badge: 'LIVE' },
    { id: 'contractors', label: 'Contractor Ledger', icon: Users, badge: null },
  ];

  const roles = [
    { id: 'citizen', label: 'Citizen Portal', icon: UserCheck, color: 'var(--secondary)' },
    { id: 'authority', label: 'Authority Desk', icon: Settings, color: 'var(--primary)' },
    { id: 'admin', label: 'Admin Terminal', icon: ShieldAlert, color: 'var(--danger)' }
  ];

  return (
    <aside className="sidebar glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      borderRadius: '0 24px 24px 0',
      borderLeft: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      zIndex: 100
    }}>
      <div>
        {/* Branding Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 8px 32px 8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <Cpu size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              ROAD<span className="neon-text-blue">WATCH</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="pulse-dot pulse-green" style={{ width: '6px', height: '6px' }}></span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', transform: 'translateY(-1px)' }}>
                IITM HACKATHON
              </span>
            </div>
          </div>
        </div>

        {/* Tab Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.92rem',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  textAlign: 'left'
                }}
                className="interactive-list-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background: item.badge === 'AI' ? 'linear-gradient(135deg, var(--accent), var(--primary))' : 'rgba(239, 68, 68, 0.2)',
                    color: item.badge === 'AI' ? '#fff' : '#f87171',
                    border: item.badge === 'AI' ? 'none' : '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & Log Out */}
      <div>
        <div style={{
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '10px'
          }}>
            Terminal Role
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {roles.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole(role.id)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSelected ? role.color + '20' : 'transparent',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isSelected ? 600 : 500,
                    transition: 'all 0.2s',
                    border: isSelected ? `1px solid ${role.color}40` : '1px solid transparent'
                  }}
                >
                  <RoleIcon size={14} style={{ color: isSelected ? role.color : 'var(--text-muted)' }} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{role.label}</span>
                  {isSelected && <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: role.color,
                    boxShadow: `0 0 8px ${role.color}`
                  }}></span>}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setView('landing')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.05)',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
        >
          <LogOut size={16} />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
}
