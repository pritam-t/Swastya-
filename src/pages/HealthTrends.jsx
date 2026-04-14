import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const DUMMY_WEEKLY = [
  { day: 'Mon', optimal: 2, modified: 1, risk: 0, score: 88 },
  { day: 'Tue', optimal: 1, modified: 2, risk: 1, score: 62 },
  { day: 'Wed', optimal: 3, modified: 0, risk: 0, score: 95 },
  { day: 'Thu', optimal: 2, modified: 1, risk: 0, score: 84 },
  { day: 'Fri', optimal: 1, modified: 1, risk: 1, score: 58 },
  { day: 'Sat', optimal: 2, modified: 2, risk: 0, score: 79 },
  { day: 'Sun', optimal: 3, modified: 1, risk: 0, score: 91 },
];

const MetricCard = ({ icon, label, value, sub, color }) => (
  <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '1.25rem', padding: '1.25rem', flex: 1, minWidth: 120 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color }}>{icon}</span>
      </div>
      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 600 }}>{label}</p>
    </div>
    <p className="font-editorial" style={{ fontSize: '2rem', color: 'var(--on-surface)', fontStyle: 'italic', lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--outline)' }}>{sub}</p>}
  </div>
);

export default function HealthTrends() {
  const [logs, setLogs] = useState([]);
  const [weekData, setWeekData] = useState(DUMMY_WEEKLY);
  const profile = dbService.getProfile();

  useEffect(() => {
    const l = dbService.getMealLogs();
    setLogs(l);
    // Merge real logged data into the last day's slot
    if (l.length > 0) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      setWeekData(prev => prev.map(d => d.day === today ? { ...d, optimal: l.filter(m => m.grade === 'optimal').length, modified: l.filter(m => m.grade === 'modified').length, risk: l.filter(m => m.grade === 'risk').length } : d));
    }
  }, []);

  const totalOptimal = logs.filter(l => l.grade === 'optimal').length;
  const totalLogged = logs.length;
  const score = totalLogged > 0 ? Math.round((totalOptimal / totalLogged) * 100) : 85;
  const bmi = profile ? (profile.vitals?.weight / ((profile.vitals?.height / 100) ** 2)).toFixed(1) : '—';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) return (
      <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '0.75rem', padding: '0.75rem 1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '0.8125rem' }}>
        <p style={{ fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => <p key={p.dataKey} style={{ color: p.color }}>{p.dataKey}: {p.value}</p>)}
      </div>
    );
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '6rem' }}>
      {/* Top Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }} className="glass-nav">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-container)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--on-surface-variant)' }}>arrow_back</span>
        </Link>
        <span className="font-editorial" style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--primary)' }}>Health Trends</span>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)', marginBottom: 8, fontWeight: 600 }}>Weekly Report</p>
          <h1 className="font-editorial" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--on-surface)', lineHeight: 1.15, fontStyle: 'italic' }}>Your Health Pulse</h1>
          <div style={{ width: 48, height: 3, background: 'var(--primary)', borderRadius: 999, margin: '1rem 0' }} />
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2rem' }}>
          <MetricCard icon="health_metrics" label="Health Score" value={`${score}%`} sub="Based on logged meals" color="var(--secondary)" />
          <MetricCard icon="restaurant_menu" label="Meals Logged" value={totalLogged || '—'} sub="This session" color="var(--primary)" />
          {profile && <MetricCard icon="monitor_weight" label="BMI" value={bmi} sub={bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'Obese'} color="var(--tertiary)" />}
        </div>

        {/* Area Chart — Health Score */}
        <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 className="font-editorial" style={{ fontSize: '1.25rem', color: 'var(--on-surface)', fontStyle: 'italic', marginBottom: '1.25rem' }}>Weekly Health Score</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006067" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#006067" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(189,201,202,0.3)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--outline)', fontFamily: 'Inter' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--outline)', fontFamily: 'Inter' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — Meal Grades */}
        <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 className="font-editorial" style={{ fontSize: '1.25rem', color: 'var(--on-surface)', fontStyle: 'italic', marginBottom: '1.25rem' }}>Meal Grades by Day</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(189,201,202,0.3)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--outline)', fontFamily: 'Inter' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--outline)', fontFamily: 'Inter' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="optimal" stackId="a" fill="#d1e8dd" radius={[0,0,0,0]} />
              <Bar dataKey="modified" stackId="a" fill="#f5e0ba" radius={[0,0,0,0]} />
              <Bar dataKey="risk" stackId="a" fill="#ffdad6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
            {[['Optimal', '#d1e8dd', '#006067'], ['Modified', '#f5e0ba', '#635537'], ['Risk', '#ffdad6', '#ba1a1a']].map(([lbl, bg, tc]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1.5px solid ${tc}` }} />
                {lbl}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        {logs.length > 0 && (
          <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '1.5rem', padding: '1.5rem' }}>
            <h2 className="font-editorial" style={{ fontSize: '1.25rem', color: 'var(--on-surface)', fontStyle: 'italic', marginBottom: '1rem' }}>Recent Meal Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {logs.slice(-5).reverse().map(log => {
                const COLORS = { optimal: 'var(--secondary)', modified: 'var(--tertiary)', risk: 'var(--error)' };
                return (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(189,201,202,0.2)' }}>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--on-surface)', fontSize: '0.9375rem' }}>{log.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--outline)', marginTop: 2 }}>{new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS[log.grade] || 'var(--outline)', background: COLORS[log.grade]?.replace(')', ',0.12)').replace('var(', 'rgba(0,0,0,0)') || 'var(--surface-container)', padding: '0.25rem 0.625rem', borderRadius: 999 }}>{log.grade}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {logs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline-variant)', display: 'block', marginBottom: 12 }}>restaurant_menu</span>
            <p>No meals logged yet. <Link to="/scanner" style={{ color: 'var(--primary)', fontWeight: 600 }}>Scan a menu</Link> to get started.</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0.75rem 1rem', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', boxShadow: '0 -4px 24px rgba(0,0,0,0.05)' }}>
        {[['/', 'dashboard', 'Dashboard'], ['/scanner', 'qr_code_scanner', 'Scan'], ['/trends', 'show_chart', 'Trends']].map(([to, icon, lbl]) => (
          <Link key={lbl} to={to} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '0.375rem 1rem', borderRadius: '0.75rem', background: to === '/trends' ? 'var(--secondary-fixed)' : 'transparent' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: to === '/trends' ? 'var(--primary)' : 'var(--outline)' }}>{icon}</span>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: to === '/trends' ? 'var(--primary)' : 'var(--outline)' }}>{lbl}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
