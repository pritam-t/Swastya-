import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';

const CONDITIONS = ['Hypertension', 'Type 2 Diabetes', 'Celiac', 'High Cholesterol', 'GERD', 'Kidney Disease', 'Heart Disease'];
const MEDICATIONS = ['Lisinopril', 'Metformin', 'Warfarin', 'Simvastatin', 'Atorvastatin', 'Amlodipine', 'Omeprazole'];
const ALLERGENS = ['Nuts', 'Dairy', 'Shellfish', 'Soy', 'Gluten', 'Eggs', 'Fish'];

const ALLERGEN_ICONS = {
  Nuts: 'nutrition', Dairy: 'water_drop', Shellfish: 'set_meal',
  Soy: 'grass', Gluten: 'grain', Eggs: 'egg', Fish: 'phishing'
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [vitals, setVitals] = useState({ age: 28, gender: 'Female', weight: 60, height: 165 });
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medSearch, setMedSearch] = useState('');
  const [allergens, setAllergens] = useState([]);

  const toggleItem = (item, list, setList) => {
    setList(l => l.includes(item) ? l.filter(i => i !== item) : [...l, item]);
  };

  const handleSave = () => {
    dbService.saveProfile({ vitals, conditions, medications, allergens, savedAt: new Date().toISOString() });
    navigate('/');
  };

  const filteredMeds = MEDICATIONS.filter(m => m.toLowerCase().includes(medSearch.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '5rem' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="glass-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>spa</span>
          <span className="font-editorial" style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--primary)' }}>Swastya+</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2].map(i => (
            <div key={i} style={{ width: 28, height: 4, borderRadius: 999, background: step >= i ? 'var(--primary)' : 'var(--surface-container-highest)', transition: 'background 0.3s' }} />
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 540, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* STEP 1: Personal Vitals */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--on-surface-variant)', marginBottom: 8 }}>Step 1 of 2</p>
              <h1 className="font-editorial" style={{ fontSize: '2.5rem', fontStyle: 'italic', color: 'var(--on-surface)', lineHeight: 1.2 }}>Personal Vitals</h1>
              <p style={{ marginTop: 8, color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>The clinical foundation of your profile.</p>
            </div>

            <div style={{ background: 'var(--surface-container-low)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Age */}
              <div>
                <label style={labelStyle}>Chronological Age</label>
                <input
                  type="number" value={vitals.age} min={1} max={120}
                  onChange={e => setVitals(v => ({ ...v, age: +e.target.value }))}
                  className="thin-line-input font-editorial"
                  style={{ fontSize: '1.5rem', fontStyle: 'italic' }}
                  placeholder="Enter age"
                />
              </div>

              {/* Gender */}
              <div>
                <label style={labelStyle}>Biological Identification</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} onClick={() => setVitals(v => ({ ...v, gender: g }))} style={{
                      padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid',
                      borderColor: vitals.gender === g ? 'var(--primary)' : 'rgba(189,201,202,0.3)',
                      background: vitals.gender === g ? 'var(--primary)' : 'var(--surface-container-lowest)',
                      color: vitals.gender === g ? '#fff' : 'var(--on-surface)',
                      fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}>{g}</button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                  <label style={labelStyle}>Current Weight</label>
                  <span className="font-editorial" style={{ fontSize: '1.5rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                    {vitals.weight} <span style={{ fontSize: '0.75rem', fontStyle: 'normal', color: 'var(--on-surface-variant)' }}>kg</span>
                  </span>
                </div>
                <input type="range" min={30} max={200} value={vitals.weight} style={{ width: '100%' }}
                  onChange={e => setVitals(v => ({ ...v, weight: +e.target.value }))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.625rem', color: 'var(--outline)', fontWeight: 700, letterSpacing: '0.1em' }}>
                  <span>30 KG</span><span>200 KG</span>
                </div>
              </div>

              {/* Height */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                  <label style={labelStyle}>Standing Stature</label>
                  <span className="font-editorial" style={{ fontSize: '1.5rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                    {vitals.height} <span style={{ fontSize: '0.75rem', fontStyle: 'normal', color: 'var(--on-surface-variant)' }}>cm</span>
                  </span>
                </div>
                <input type="range" min={100} max={250} value={vitals.height} style={{ width: '100%' }}
                  onChange={e => setVitals(v => ({ ...v, height: +e.target.value }))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.625rem', color: 'var(--outline)', fontWeight: 700, letterSpacing: '0.1em' }}>
                  <span>100 CM</span><span>250 CM</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary" style={ctaStyle}>
              Continue to Clinical Context
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 2: Clinical Context */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, fontSize: '0.875rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Back
              </button>
              <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--on-surface-variant)', marginBottom: 8 }}>Step 2 of 2</p>
              <h1 className="font-editorial" style={{ fontSize: '2.5rem', fontStyle: 'italic', color: 'var(--on-surface)', lineHeight: 1.2 }}>Clinical Context</h1>
              <p style={{ marginTop: 8, color: 'var(--on-surface-variant)', fontSize: '0.9375rem' }}>Help us understand your medical background.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Conditions */}
              <div style={{ background: 'var(--surface-container-low)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Health Conditions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CONDITIONS.map(c => (
                    <button key={c} onClick={() => toggleItem(c, conditions, setConditions)} style={{
                      padding: '0.5rem 0.875rem', borderRadius: 999, fontSize: '0.8125rem', fontWeight: 500,
                      border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
                      borderColor: conditions.includes(c) ? 'var(--primary)' : 'rgba(189,201,202,0.35)',
                      background: conditions.includes(c) ? 'var(--secondary-fixed)' : 'var(--surface-container-lowest)',
                      color: conditions.includes(c) ? 'var(--on-secondary-fixed)' : 'var(--on-surface-variant)'
                    }}>{conditions.includes(c) && '✓ '}{c}</button>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div style={{ background: 'var(--surface-container-low)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Medications</h3>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 18 }}>search</span>
                  <input type="text" value={medSearch} onChange={e => setMedSearch(e.target.value)}
                    placeholder="Search medications..." className="thin-line-input" style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {filteredMeds.map(m => (
                    <button key={m} onClick={() => toggleItem(m, medications, setMedications)} style={{
                      padding: '0.5rem 0.875rem', borderRadius: 999, fontSize: '0.8125rem', fontWeight: 500,
                      border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
                      borderColor: medications.includes(m) ? 'var(--tertiary)' : 'rgba(189,201,202,0.35)',
                      background: medications.includes(m) ? 'var(--tertiary-fixed)' : 'var(--surface-container-lowest)',
                      color: medications.includes(m) ? 'var(--on-tertiary-fixed)' : 'var(--on-surface-variant)'
                    }}>{medications.includes(m) && '✓ '}{m}</button>
                  ))}
                  {filteredMeds.length === 0 && <p style={{ color: 'var(--outline)', fontSize: '0.875rem' }}>No matches found.</p>}
                </div>
              </div>

              {/* Allergens */}
              <div style={{ background: 'var(--surface-container-low)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Allergens</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
                  {ALLERGENS.map(a => (
                    <button key={a} onClick={() => toggleItem(a, allergens, setAllergens)} style={{
                      padding: '0.875rem 0.5rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 500,
                      border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                      borderColor: allergens.includes(a) ? 'var(--error)' : 'rgba(189,201,202,0.35)',
                      background: allergens.includes(a) ? 'var(--error-container)' : 'var(--surface-container-lowest)',
                      color: allergens.includes(a) ? 'var(--error)' : 'var(--on-surface-variant)'
                    }}>
                      <span className="material-symbols-outlined" style={{ display: 'block', marginBottom: 4, fontSize: 22 }}>{ALLERGEN_ICONS[a]}</span>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary" style={ctaStyle}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
              Establish Health Baseline
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--outline)' }}>
              Your data is saved privately on this device.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.6875rem', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)'
};
const ctaStyle = {
  width: '100%', marginTop: '2rem', padding: '1.1rem', borderRadius: '0.75rem',
  fontSize: '0.9375rem', fontWeight: 600, display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: 8, letterSpacing: '0.02em'
};
