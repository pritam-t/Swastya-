import PropTypes from 'prop-types';

/**
 * MetricCard displays a single major statistic visually.
 */
export default function MetricCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '1.25rem', padding: '1.25rem', flex: 1, minWidth: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color }} aria-hidden="true">{icon}</span>
        </div>
        <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 600, margin: 0 }}>{label}</p>
      </div>
      <p className="font-editorial" style={{ fontSize: '2rem', color: 'var(--on-surface)', fontStyle: 'italic', lineHeight: 1, margin: 0 }}>{value}</p>
      {sub && <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--outline)', margin: 0 }}>{sub}</p>}
    </div>
  );
}

MetricCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string,
  color: PropTypes.string.isRequired,
};
