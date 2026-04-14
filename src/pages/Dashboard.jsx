import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { gradeMenu } from '../services/gradingEngine';
import { getMockMenuData } from '../services/ocrService';

const GRADE_CONFIG = {
  optimal:  { bg: '#E8F1EF', border: 'var(--secondary)', label: 'Optimal', icon: 'favorite', iconColor: 'var(--secondary)', chipBg: 'var(--secondary-fixed)', chipText: 'var(--on-secondary-fixed)', badge: 'Heart-Healthy Selection' },
  modified: { bg: '#F9F4E8', border: 'var(--tertiary)', label: 'Modified', icon: 'edit_note', iconColor: 'var(--tertiary)', chipBg: 'var(--tertiary-fixed)', chipText: 'var(--on-tertiary-fixed)', badge: 'Safe with Tweak' },
  risk:     { bg: '#FFFFFF', border: 'var(--error)', label: 'Risk', icon: 'warning', iconColor: 'var(--error)', chipBg: 'var(--error-container)', chipText: 'var(--error)', badge: 'Potential Interaction' },
};

function DishCard({ dish }) {
  const [expanded, setExpanded] = useState(false);
  const [logged, setLogged] = useState(false);
  const cfg = GRADE_CONFIG[dish.grade] || GRADE_CONFIG.optimal;

  const handleLog = () => {
    dbService.addMealLog({ name: dish.name, grade: dish.grade, price: dish.price });
    dbService.saveHealthTrend({ meals: 1, optimalCount: dish.grade === 'optimal' ? 1 : 0 });
    setLogged(true);
  };

  return (
    <div className="card-lift" style={{
      background: cfg.bg, borderRadius: '1.5rem',
      borderLeft: dish.grade === 'risk' ? `4px solid ${cfg.border}` : 'none',
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem',
      cursor: 'pointer', position: 'relative', overflow: 'hidden'
    }} onClick={() => setExpanded(e => !e)}>
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: cfg.chipBg, color: cfg.chipText, borderRadius: 999, padding: '0.35rem 0.75rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', alignSelf: 'flex-start' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: cfg.iconColor }}>{cfg.icon}</span>
        {cfg.badge}
      </div>

      {/* Dish Name */}
      <h3 className="font-editorial" style={{ fontSize: '1.375rem', color: 'var(--on-surface)', lineHeight: 1.25, fontStyle: 'italic' }}>{dish.name}</h3>

      {/* Description */}
      {dish.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.55 }}>{dish.description}</p>
      )}

      {/* Expand: Reasons */}
      {expanded && (
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dish.reasons?.map((r, i) => (
            <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, background: 'rgba(255,255,255,0.5)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>{r}</div>
          ))}
          {dish.instruction && (
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: dish.grade === 'risk' ? 'var(--error)' : 'var(--primary)', fontStyle: 'italic', padding: '0.25rem 0.25rem' }}>
              → {dish.instruction}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        {dish.price && <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>{dish.price}</span>}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {expanded ? 'Less ' : 'Details '}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{expanded ? 'expand_less' : 'expand_more'}</span>
          </span>
          {!logged ? (
            <button onClick={(e) => { e.stopPropagation(); handleLog(); }} style={{
              fontSize: '0.75rem', fontWeight: 600, color: '#fff', background: 'var(--primary)',
              border: 'none', borderRadius: 999, padding: '0.35rem 0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add_circle</span> Log Meal
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span> Logged
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const p = dbService.getProfile();
    setProfile(p);
    // Load latest scan results, or grade mock data
    const stored = localStorage.getItem('swastya_scan_results');
    if (stored) {
      setDishes(JSON.parse(stored));
    } else {
      const mock = getMockMenuData();
      setDishes(gradeMenu(mock, p || {}));
    }
  }, []);

  const counts = { optimal: dishes.filter(d => d.grade === 'optimal').length, modified: dishes.filter(d => d.grade === 'modified').length, risk: dishes.filter(d => d.grade === 'risk').length };
  const filtered = activeFilter === 'all' ? dishes : dishes.filter(d => d.grade === activeFilter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '6rem' }}>
      {/* TOP NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="glass-nav">
        <span className="font-editorial" style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--primary)' }}>Swastya+</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/trends" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>show_chart</span>
            </button>
          </Link>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--secondary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title={user?.displayName} onClick={async () => { if(window.confirm('Sign out?')) { await signOut(); navigate('/login'); } }}>
            <span style={{ fontWeight: 700, color: 'var(--on-secondary-fixed)', fontSize: '0.875rem' }}>{user?.displayName?.[0] || 'P'}</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Editorial Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)', marginBottom: 8, fontWeight: 600 }}>Today's Recommendations</p>
          <h1 className="font-editorial" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: 'var(--on-surface)', lineHeight: 1.1, fontStyle: 'italic' }}>
            Augmented Menu
          </h1>
          <div style={{ width: 48, height: 3, background: 'var(--primary)', borderRadius: 999, margin: '1rem 0' }} />
          <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.65, maxWidth: 520, fontSize: '0.9375rem' }}>
            {profile
              ? `Cross-referenced against your profile${profile.conditions?.length ? ` (${profile.conditions.join(', ')})` : ''}. Tap a card for details.`
              : 'Complete your health profile for personalised results. Tap a card for details.'}
          </p>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[['all', 'All Dishes', 'restaurant_menu', 'var(--primary)', 'var(--surface-container-low)', 'var(--on-surface)'],
            ['optimal', `${counts.optimal} Optimal`, 'favorite', 'var(--secondary)', 'var(--secondary-fixed)', 'var(--on-secondary-fixed)'],
            ['modified', `${counts.modified} Modified`, 'edit_note', 'var(--tertiary)', 'var(--tertiary-fixed)', 'var(--on-tertiary-fixed)'],
            ['risk', `${counts.risk} Risk`, 'warning', 'var(--error)', 'var(--error-container)', 'var(--error)']
          ].map(([key, lbl, icon, ic, bg, tc]) => (
            <button key={key} onClick={() => setActiveFilter(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 999,
              border: '1.5px solid', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              background: activeFilter === key ? bg : 'var(--surface-container-lowest)',
              borderColor: activeFilter === key ? ic : 'rgba(189,201,202,0.35)',
              color: activeFilter === key ? tc : 'var(--on-surface-variant)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: activeFilter === key ? ic : 'var(--outline)' }}>{icon}</span>
              {lbl}
            </button>
          ))}
        </div>

        {/* Dish Cards */}
        {!profile && (
          <div style={{ background: 'var(--tertiary-fixed)', borderRadius: '1rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: 20 }}>info</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-tertiary-fixed)' }}>
              <Link to="/onboarding" style={{ color: 'var(--primary)', fontWeight: 600 }}>Complete your health profile</Link> to get personalised, clinically-aware recommendations.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(dish => <DishCard key={dish.name} dish={dish} />)}
        </div>
      </main>

      {/* Bottom Nav */}
      <BottomNav active="dashboard" />

      {/* Scan FAB */}
      <Link to="/scanner" style={{ textDecoration: 'none' }}>
        <button style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 60,
          width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
          boxShadow: '0 4px 24px rgba(0,96,103,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.15s', fontFamily: 'inherit'
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 28 }}>qr_code_scanner</span>
        </button>
      </Link>
    </div>
  );
}

function BottomNav({ active }) {
  const items = [
    { key: 'dashboard', to: '/', icon: 'dashboard', label: 'Dashboard' },
    { key: 'scanner', to: '/scanner', icon: 'qr_code_scanner', label: 'Scan' },
    { key: 'trends', to: '/trends', icon: 'show_chart', label: 'Trends' },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '0.75rem 1rem', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.05)'
    }}>
      {items.map(item => (
        <Link key={item.key} to={item.to} style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '0.375rem 1rem',
            borderRadius: '0.75rem', transition: 'all 0.2s',
            background: active === item.key ? 'var(--secondary-fixed)' : 'transparent'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: active === item.key ? 'var(--primary)' : 'var(--outline)' }}>{item.icon}</span>
            <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: active === item.key ? 'var(--primary)' : 'var(--outline)' }}>{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
