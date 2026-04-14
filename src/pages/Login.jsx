import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const isConfigured = authService.isSupabaseConfigured();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    setLoading(true);

    // Allow pritam123 / 12345678 as username/password shortcut
    const emailOrUser = email.trim();
    const { success, error: err } = await signIn(emailOrUser, password);

    if (success) {
      const profile = dbService.getProfile();
      navigate(profile ? '/' : '/onboarding', { replace: true });
    } else {
      setError(err || 'Sign in failed. Check your credentials.');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);

    const { success, error: err } = await signUp(email.trim(), password, displayName.trim());

    if (success) {
      if (!isConfigured) {
        navigate('/onboarding', { replace: true });
      } else {
        setInfo('Account created! Please check your email to confirm your account, then sign in.');
        setTab('signin');
      }
    } else {
      setError(err || 'Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(160deg, #e8f4f6 0%, var(--surface-container-low) 50%, #f0f8f5 100%)'
    }}>
      {/* LEFT — Editorial Panel (Desktop only) */}
      <div className="login-panel" style={{
        flex: 1, flexDirection: 'column', justifyContent: 'space-between',
        padding: '3rem', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, var(--primary) 0%, #003d42 100%)'
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'rgba(255,255,255,0.7)' }}>spa</span>
          <h1 className="font-editorial" style={{ color: '#fff', fontSize: '2rem', fontStyle: 'italic', marginTop: 12 }}>Swastya+</h1>
        </div>

        <div>
          <p className="font-editorial" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '2.5rem', lineHeight: 1.25, fontStyle: 'italic', marginBottom: '1.5rem' }}>
            "Your health,<br />brilliantly informed."
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 340 }}>
            Swastya+ cross-references restaurant menus with your clinical profile in real time — so every meal is a confident, healthy choice.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {[['AI-Powered', 'menu_book'], ['Clinically Aware', 'health_metrics'], ['Always Private', 'lock']].map(([label, icon]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24 }}>{icon}</span>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Auth Forms */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="mobile-logo">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', marginBottom: '0.875rem', boxShadow: '0 8px 24px rgba(0,96,103,0.2)' }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 30 }}>spa</span>
            </div>
            <h2 className="font-editorial" style={{ fontSize: '1.875rem', color: 'var(--on-surface)', fontStyle: 'italic' }}>
              {tab === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ marginTop: 4, color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
              {tab === 'signin' ? 'Sign in to your health companion' : 'Start your health journey'}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--surface-container)', borderRadius: '0.875rem', padding: 4, marginBottom: '1.5rem', gap: 4 }}>
            {[['signin', 'Sign In', 'login'], ['signup', 'Create Account', 'person_add']].map(([key, label, icon]) => (
              <button key={key} id={`tab-${key}`} onClick={() => { setTab(key); setError(''); setInfo(''); }} style={{
                flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: tab === key ? 'var(--surface-container-lowest)' : 'transparent',
                color: tab === key ? 'var(--primary)' : 'var(--on-surface-variant)',
                boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Supabase status banner */}
          {!isConfigured && (
            <div style={{ background: 'var(--tertiary-fixed)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: 18, flexShrink: 0, marginTop: 1 }}>info</span>
              <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--on-tertiary-fixed)', fontWeight: 600, marginBottom: 2 }}>Running in Demo Mode</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--on-tertiary-fixed-variant)', lineHeight: 1.5 }}>
                  Add <code style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 3, padding: '0 4px' }}>VITE_SUPABASE_URL</code> and <code style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 3, padding: '0 4px' }}>VITE_SUPABASE_ANON_KEY</code> to <strong>.env</strong> to enable real authentication.
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--on-tertiary-fixed-variant)', marginTop: 4 }}>Demo login: <strong>pritam123</strong> / <strong>12345678</strong></p>
              </div>
            </div>
          )}

          {/* Card */}
          <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 8px 40px rgba(24,28,29,0.06), 0 2px 8px rgba(24,28,29,0.04)' }}>

            {/* Info message (e.g. confirm email) */}
            {info && (
              <div style={{ background: 'var(--secondary-fixed)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: 18 }}>check_circle</span>
                <span style={{ color: 'var(--on-secondary-fixed)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{info}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background: 'var(--error-container)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--error)', fontSize: 18, flexShrink: 0 }}>error</span>
                <span style={{ color: 'var(--on-error-container)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn}>
                <Field label="Email / Username" icon="person" type="text" value={email} onChange={setEmail} placeholder={isConfigured ? 'you@email.com' : 'pritam123 or email'} autoComplete="username" />
                <div style={{ marginTop: '1.5rem' }}>
                  <PasswordField label="Password" value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(s => !s)} />
                </div>
                <SubmitButton loading={loading} label="Sign In" icon="login" />
              </form>
            )}

            {/* SIGN UP FORM */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp}>
                <Field label="Display Name" icon="badge" type="text" value={displayName} onChange={setDisplayName} placeholder="Your name" autoComplete="name" required />
                <div style={{ marginTop: '1.5rem' }}>
                  <Field label="Email" icon="email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" required />
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <PasswordField label="Password" value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(s => !s)} placeholder="Min. 6 characters" />
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} show={showPassword} onToggle={() => setShowPassword(s => !s)} placeholder="Re-enter your password" autoComplete="new-password" />
                </div>
                <SubmitButton loading={loading} label="Create Account" icon="person_add" />
              </form>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--outline)', lineHeight: 1.65 }}>
            {isConfigured ? 'Powered by Supabase — your data is end-to-end secure.' : 'Your data is stored locally on this device.'}
          </p>
        </div>
      </div>

      <style>{`
        .login-panel { display: none; }
        @media (min-width: 768px) { .login-panel { display: flex !important; } .mobile-logo { display: none; } }
        @media (max-width: 767px) { .mobile-logo { display: block !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ---------- small helper sub-components ---------- */
function Field({ label, icon, type, value, onChange, placeholder, autoComplete, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 20 }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} autoComplete={autoComplete} className="thin-line-input" style={{ paddingLeft: '1.75rem' }} />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder = 'Enter your password', autoComplete = 'current-password' }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 20 }}>lock</span>
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required autoComplete={autoComplete} className="thin-line-input" style={{ paddingLeft: '1.75rem', paddingRight: '2rem' }} />
        <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)', padding: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
    </div>
  );
}

function SubmitButton({ loading, label, icon }) {
  return (
    <button type="submit" disabled={loading} className="btn-primary" style={{
      width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '0.75rem',
      fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '0.02em',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      opacity: loading ? 0.75 : 1
    }}>
      {loading
        ? <><span className="material-symbols-outlined" style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}>progress_activity</span> Please wait...</>
        : <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span> {label}</>
      }
    </button>
  );
}
