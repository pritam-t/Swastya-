import { useState } from 'react';
import PropTypes from 'prop-types';
import { dbService } from '../services/dbService';

const GRADE_CONFIG = {
  optimal:  { bg: '#E8F1EF', border: 'var(--secondary)', label: 'Optimal', icon: 'favorite', iconColor: 'var(--secondary)', chipBg: 'var(--secondary-fixed)', chipText: 'var(--on-secondary-fixed)', badge: 'Heart-Healthy Selection' },
  modified: { bg: '#F9F4E8', border: 'var(--tertiary)', label: 'Modified', icon: 'edit_note', iconColor: 'var(--tertiary)', chipBg: 'var(--tertiary-fixed)', chipText: 'var(--on-tertiary-fixed)', badge: 'Safe with Tweak' },
  risk:     { bg: '#FFFFFF', border: 'var(--error)', label: 'Risk', icon: 'warning', iconColor: 'var(--error)', chipBg: 'var(--error-container)', chipText: 'var(--error)', badge: 'Potential Interaction' },
};

/**
 * DishCard displays a graded menu item, highlighting reasons and instructions.
 * Keyboard accessible (Tab to focus, Enter to expand).
 */
export default function DishCard({ dish }) {
  const [expanded, setExpanded] = useState(false);
  const [logged, setLogged] = useState(false);
  const cfg = GRADE_CONFIG[dish.grade] || GRADE_CONFIG.optimal;

  const handleLog = (e) => {
    e.stopPropagation();
    dbService.addMealLog({ name: dish.name, grade: dish.grade, price: dish.price });
    dbService.saveHealthTrend({ meals: 1, optimalCount: dish.grade === 'optimal' ? 1 : 0 });
    setLogged(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpanded(e => !e);
    }
  };

  return (
    <div 
      className="card-lift" 
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={handleKeyDown}
      onClick={() => setExpanded(e => !e)}
      style={{
        background: cfg.bg, borderRadius: '1.5rem',
        borderLeft: dish.grade === 'risk' ? `4px solid ${cfg.border}` : 'none',
        padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        outline: 'none' // focus ring handled by global CSS if needed
      }}
    >
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: cfg.chipBg, color: cfg.chipText, borderRadius: 999, padding: '0.35rem 0.75rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', alignSelf: 'flex-start' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: cfg.iconColor }} aria-hidden="true">{cfg.icon}</span>
        {cfg.badge}
      </div>

      {/* Dish Name */}
      <h3 className="font-editorial" style={{ fontSize: '1.375rem', color: 'var(--on-surface)', lineHeight: 1.25, fontStyle: 'italic', margin: 0 }}>{dish.name}</h3>

      {/* Description */}
      {dish.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.55, margin: 0 }}>{dish.description}</p>
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
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">{expanded ? 'expand_less' : 'expand_more'}</span>
          </span>
          {!logged ? (
            <button 
              onClick={handleLog} 
              aria-label={`Log ${dish.name} as a meal`}
              style={{
                fontSize: '0.75rem', fontWeight: 600, color: '#fff', background: 'var(--primary)',
                border: 'none', borderRadius: 999, padding: '0.35rem 0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden="true">add_circle</span> Log Meal
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden="true">check_circle</span> Logged
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

DishCard.propTypes = {
  dish: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    grade: PropTypes.oneOf(['optimal', 'modified', 'risk']).isRequired,
    reasons: PropTypes.arrayOf(PropTypes.string),
    instruction: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,
};
