import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Send, X, MessageSquare, ArrowUpRight } from 'lucide-react';
import { COUNTRIES, CONTRACTORS } from '../data/mockData';

export default function AIChatbot({ selectedCountry, roads, complaints }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Affirmative. I am Roadwatch Core AI. I have cataloged local infrastructure budgets, contractor audit histories, and active defect tickets. How can I assist you today?" 
    }
  ]);
  const messagesEndRef = useRef(null);
  const countryConfig = COUNTRIES[selectedCountry];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Clean suggestion chips based on country
  const getSuggestions = () => {
    if (selectedCountry === 'IN') {
      return [
        { label: "Who maintains Sardar Patel Road?", query: "Who is responsible for Sardar Patel Road?" },
        { label: "Sardar Patel Road budget spent?", query: "How much budget was spent on Sardar Patel Road?" },
        { label: "When was OMR repaired last?", query: "When was Rajiv Gandhi Salai (OMR) repaired last?" },
        { label: "Which contractor has highest risk?", query: "Which contractor is the highest risk?" }
      ];
    }
    if (selectedCountry === 'US') {
      return [
        { label: "Who maintains Broadway?", query: "Who is responsible for Broadway?" },
        { label: "Broadway budget spent?", query: "How much budget was spent on Broadway?" },
        { label: "When was FDR Drive repaired last?", query: "When was FDR Drive repaired last?" },
        { label: "Which contractor has highest risk?", query: "Which contractor is the highest risk?" }
      ];
    }
    return [
      { label: `Show road database for ${countryConfig.name}`, query: `List all roads` },
      { label: "Show active complaints", query: "Show active complaints" },
      { label: "Who is the highest risk contractor?", query: "Which contractor is the highest risk?" }
    ];
  };

  // Formatting currency
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

  // Simple Pattern Matching NLP Engine
  const processQuery = (query) => {
    const q = query.toLowerCase();
    const countryRoads = roads.filter(r => r.id.startsWith(selectedCountry.toLowerCase()) || r.authority.includes(countryConfig.name));
    
    // 1. "Who is responsible for X" or "Who maintains X"
    if (q.includes("responsible") || q.includes("maintain") || q.includes("who owns")) {
      const matchedRoad = countryRoads.find(r => q.includes(r.name.toLowerCase()) || (r.name.includes("OMR") && q.includes("omr")));
      if (matchedRoad) {
        const contractor = CONTRACTORS.find(c => c.id === matchedRoad.contractorId);
        return `${matchedRoad.name} is maintained by the ${matchedRoad.authority}. The active general contractor is ${contractor ? contractor.name : 'Unknown'} (Performance Score: ${contractor ? contractor.rating : 0}/5.0).`;
      }
    }

    // 2. "How much budget was spent on X" or "budget of X"
    if (q.includes("budget") || q.includes("spent") || q.includes("cost of")) {
      const matchedRoad = countryRoads.find(r => q.includes(r.name.toLowerCase()) || (r.name.includes("OMR") && q.includes("omr")));
      if (matchedRoad) {
        const overrun = matchedRoad.budgetUtilized > matchedRoad.budgetSanctioned;
        return `${matchedRoad.name} has a sanctioned budget of ${formatCurrency(matchedRoad.budgetSanctioned)}. The utilized amount is ${formatCurrency(matchedRoad.budgetUtilized)} (${((matchedRoad.budgetUtilized / matchedRoad.budgetSanctioned) * 100).toFixed(0)}% utilization). ${overrun ? "⚠️ Warning: This road has exceeded its sanctioned budget constraints." : "This road is currently within its financial limits."}`;
      }
    }

    // 3. "When was X repaired last" or "repair history of X"
    if (q.includes("repair") || q.includes("last relaying") || q.includes("repaired")) {
      const matchedRoad = countryRoads.find(r => q.includes(r.name.toLowerCase()) || (r.name.includes("OMR") && q.includes("omr")));
      if (matchedRoad) {
        if (matchedRoad.repairHistory.length === 0) {
          return `${matchedRoad.name} was constructed on ${matchedRoad.constructionDate} and has no recorded post-construction repair interventions.`;
        }
        const lastRepair = matchedRoad.repairHistory[matchedRoad.repairHistory.length - 1];
        const historyDetails = matchedRoad.repairHistory.map(h => `${h.date} (${h.type} costing ${formatCurrency(h.cost)})`).join(', ');
        return `${matchedRoad.name} was last repaired on ${matchedRoad.lastRelayingDate} (Operation: ${lastRepair.type}). Comprehensive repair log: ${historyDetails}.`;
      }
    }

    // 4. "Which contractor has highest risk" or "highest risk contractor"
    if (q.includes("contractor") && (q.includes("risk") || q.includes("corrupt") || q.includes("bad"))) {
      const countryContractors = CONTRACTORS.filter(c => c.countries.includes(selectedCountry));
      const sorted = [...countryContractors].sort((a, b) => b.riskScore - a.riskScore);
      if (sorted.length > 0) {
        const worst = sorted[0];
        return `According to current audit logs, ${worst.name} holds the highest Risk Score of ${worst.riskScore}/100 in ${countryConfig.name}. This score is compiled from high public complaint frequencies and financial budget overrun patterns.`;
      }
    }

    // 5. "List all roads"
    if (q.includes("list all roads") || q.includes("show roads") || q.includes("what roads")) {
      const list = countryRoads.map(r => `${r.name} (${r.type})`).join(', ');
      return `Cataloged roads in ${countryConfig.name}: ${list}. You can click on any of these on the map dashboard to perform visual inspections.`;
    }

    // 6. "Show active complaints"
    if (q.includes("complaint") || q.includes("ticket") || q.includes("defect")) {
      const active = complaints.filter(c => c.country === selectedCountry && c.status !== 'Resolved');
      if (active.length === 0) {
        return `There are currently no active unresolved complaint tickets logged in ${countryConfig.name}.`;
      }
      const details = active.map(c => `#${c.id} - ${c.defectType} on ${c.roadName} (${c.severity})`).join('; ');
      return `Found ${active.length} active unresolved citizen tickets in ${countryConfig.name}: ${details}.`;
    }

    // Fallback response
    return `I apologize, my current pattern indexes do not contain the specific telemetry for that question. I can check coordinates, contractor risk ratings, maintenance timestamps, and budget allocations for: ${countryRoads.map(r => r.name).join(', ')}. Please try rephrasing!`;
  };

  const handleSendMessage = (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Trigger AI response animation
    setTimeout(() => {
      const reply = processQuery(messageText);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Circle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 32px var(--primary-glow)',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          <MessageSquare size={24} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <span className="pulse-dot pulse-green" style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            border: '2px solid #060913'
          }}></span>
        </button>
      )}

      {/* Expanded Chat Portal Panel */}
      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '380px',
          height: '520px',
          background: 'rgba(9, 14, 26, 0.96)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px var(--primary-glow)'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.1), transparent)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={16} color="white" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Roadwatch Core AI</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="pulse-dot pulse-green" style={{ width: '5px', height: '5px' }}></span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>ONLINE • NODE_V3</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
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

          {/* Messages Log Panel */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: m.sender === 'user' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: m.sender === 'user' ? '1px solid rgba(37, 99, 235, 0.4)' : '1px solid var(--border-subtle)',
                  color: m.sender === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.82rem',
                  lineHeight: 1.4,
                  wordBreak: 'break-word'
                }}
              >
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Quick Queries
            </span>
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }} className="no-scrollbar">
              {getSuggestions().map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(s.query)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent)',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  {s.label}
                  <ArrowUpRight size={10} />
                </button>
              ))}
            </div>
          </div>

          {/* Typing Footer Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(9, 14, 26, 0.99)',
              borderRadius: '0 0 20px 20px'
            }}
          >
            <input 
              type="text" 
              placeholder="Ask about budgets, contractors, or repairs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input"
              style={{
                fontSize: '0.8rem',
                padding: '8px 12px',
                borderRadius: '8px'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                padding: '8px 12px',
                borderRadius: '8px'
              }}
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
