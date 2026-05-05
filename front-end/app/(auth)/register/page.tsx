'use client';
 
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
 
const COURSES = [
  'BS Computer Science',
  'BS Information Technology',
  'BS Computer Engineering',
  'BS Information Systems',
  'Other',
];
 
const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
 
export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    course: '',
    year_level: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1); // 2-step form
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.student_id) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setStep(2);
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      router.push('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = passwordStrength(formData.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#f85149', '#e3b341', '#4fd1c5', '#3fb950'][strength];
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
 
        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Sora', sans-serif;
          background-color: #0a0f1e;
          overflow: hidden;
          position: relative;
        }
        .reg-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(79, 209, 197, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 209, 197, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridPan 30s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes gridPan {
          0%   { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }
        .blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .blob-1 { width: 420px; height: 420px; background: radial-gradient(circle, rgba(79,209,197,0.14) 0%, transparent 70%); top: -120px; right: -80px; }
        .blob-2 { width: 360px; height: 360px; background: radial-gradient(circle, rgba(56,139,253,0.12) 0%, transparent 70%); bottom: -80px; left: -60px; }
 
        /* Left panel */
        .left-panel {
          display: none;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 4rem;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) { .left-panel { display: flex; } }
 
        .steps-visual { display: flex; flex-direction: column; gap: 0; margin-top: 3rem; }
        .step-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .step-line-col { display: flex; flex-direction: column; align-items: center; }
        .step-circle {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .step-circle.active {
          background: linear-gradient(135deg, #388bfd, #4fd1c5);
          color: #0a0f1e;
          box-shadow: 0 0 16px rgba(79,209,197,0.4);
        }
        .step-circle.done {
          background: rgba(63,185,80,0.15);
          border: 1px solid rgba(63,185,80,0.4);
          color: #3fb950;
        }
        .step-circle.pending {
          background: rgba(56,139,253,0.06);
          border: 1px solid rgba(56,139,253,0.15);
          color: #484f58;
        }
        .step-connector { width: 1px; height: 32px; background: rgba(56,139,253,0.12); margin: 4px 0; }
        .step-content { padding-top: 6px; padding-bottom: 28px; }
        .step-name { font-size: 14px; font-weight: 500; color: #e6edf3; margin-bottom: 3px; }
        .step-name.pending { color: #484f58; }
        .step-desc { font-size: 12px; color: #8b949e; font-family: 'JetBrains Mono', monospace; }
 
        .org-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(79,209,197,0.08);
          border: 1px solid rgba(79,209,197,0.2);
          border-radius: 999px; padding: 6px 14px;
          width: fit-content; margin-bottom: 2rem;
        }
        .org-badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4fd1c5; box-shadow: 0 0 8px #4fd1c5;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; box-shadow: 0 0 8px #4fd1c5; }
          50%      { opacity:0.6; box-shadow: 0 0 16px #4fd1c5; }
        }
        .org-badge-text { font-size: 12px; font-weight: 500; color: #4fd1c5; letter-spacing: 0.05em; font-family: 'JetBrains Mono', monospace; }
        .left-headline { font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 700; color: #e6edf3; line-height: 1.15; margin-bottom: 1rem; letter-spacing: -0.02em; }
        .left-headline span { background: linear-gradient(135deg, #4fd1c5, #388bfd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .left-desc { font-size: 14px; color: #8b949e; line-height: 1.7; max-width: 380px; }
 
        /* Right panel */
        .right-panel {
          flex: 0 0 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1.5rem;
          position: relative; z-index: 1;
          overflow-y: auto;
        }
        @media (min-width: 1024px) {
          .right-panel {
            flex: 0 0 500px;
            border-left: 1px solid rgba(79,209,197,0.08);
            background: rgba(10,15,30,0.7);
            backdrop-filter: blur(24px);
          }
        }
 
        .form-card { width: 100%; max-width: 420px; padding: 1rem 0; }
 
        .form-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; }
        .form-logo-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg, #4fd1c5, #388bfd);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 20px rgba(79,209,197,0.35);
        }
        .form-logo-text { font-size: 15px; font-weight: 600; color: #e6edf3; }
        .form-logo-sub { font-size: 11px; color: #8b949e; font-family: 'JetBrains Mono', monospace; }
 
        .form-title { font-size: 1.6rem; font-weight: 700; color: #e6edf3; letter-spacing: -0.02em; margin-bottom: 4px; }
        .form-subtitle { font-size: 13px; color: #8b949e; margin-bottom: 1.5rem; }
 
        /* Step indicator (mobile) */
        .step-pills { display: flex; gap: 6px; margin-bottom: 1.5rem; }
        .step-pill {
          height: 4px; border-radius: 2px; flex: 1;
          background: rgba(56,139,253,0.12);
          transition: background 0.3s;
        }
        .step-pill.active { background: linear-gradient(90deg, #388bfd, #4fd1c5); }
 
        .error-box {
          background: rgba(248,81,73,0.08);
          border: 1px solid rgba(248,81,73,0.3);
          border-radius: 10px; padding: 11px 14px;
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 1.1rem; font-size: 13px; color: #f85149;
          animation: shakeIn 0.3s ease;
        }
        @keyframes shakeIn {
          0%   { transform: translateX(-6px); opacity: 0; }
          50%  { transform: translateX(4px); }
          100% { transform: translateX(0); opacity: 1; }
        }
 
        .field { margin-bottom: 1rem; }
        .field-label {
          display: block; font-size: 11px; font-weight: 500; color: #8b949e;
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;
        }
        .field-wrap { position: relative; }
        .field-input {
          width: 100%; background: rgba(22,27,42,0.8);
          border: 1px solid rgba(56,139,253,0.12);
          border-radius: 10px; padding: 11px 14px;
          font-size: 14px; color: #e6edf3;
          font-family: 'Sora', sans-serif; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box; -webkit-appearance: none;
        }
        .field-input:focus {
          border-color: rgba(79,209,197,0.45);
          box-shadow: 0 0 0 3px rgba(79,209,197,0.07), 0 0 12px rgba(79,209,197,0.08);
          background: rgba(22,27,42,1);
        }
        .field-input::placeholder { color: #484f58; }
        .field-input.has-toggle { padding-right: 44px; }
        .field-input option { background: #161b2a; color: #e6edf3; }
 
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
 
        .toggle-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #484f58;
          font-size: 15px; padding: 4px; line-height: 1; transition: color 0.2s;
        }
        .toggle-btn:hover { color: #8b949e; }
 
        .strength-bar { margin-top: 6px; }
        .strength-track { height: 3px; background: rgba(56,139,253,0.08); border-radius: 2px; overflow: hidden; }
        .strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
        .strength-label { font-size: 11px; font-family: 'JetBrains Mono', monospace; margin-top: 4px; }
 
        .btn-row { display: flex; gap: 10px; margin-top: 0.25rem; }
        .back-btn {
          padding: 12px 18px; border-radius: 10px;
          border: 1px solid rgba(56,139,253,0.15);
          background: transparent; color: #8b949e;
          font-size: 14px; font-family: 'Sora', sans-serif;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .back-btn:hover { border-color: rgba(56,139,253,0.35); color: #e6edf3; }
 
        .submit-btn {
          flex: 1; padding: 12px;
          border-radius: 10px; border: none;
          background: linear-gradient(135deg, #4fd1c5, #388bfd);
          color: #0a0f1e; font-size: 14px; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(79,209,197,0.25);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(79,209,197,0.35); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .submit-btn .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(10,15,30,0.3); border-top-color: #0a0f1e;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
 
        .login-link { text-align: center; font-size: 13px; color: #8b949e; margin-top: 1.25rem; }
        .login-link a { color: #4fd1c5; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .login-link a:hover { color: #388bfd; }
 
        .slide-in { animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        .slide-back { animation: slideBack 0.25s ease; }
        @keyframes slideBack { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
 
      <div className="reg-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
 
        {/* Left panel */}
        <div className="left-panel">
          <div className="org-badge">
            <div className="org-badge-dot" />
            <span className="org-badge-text">COECS-LGU</span>
          </div>
          <h1 className="left-headline">
            Join the<br /><span>Student Portal</span>
          </h1>
          <p className="left-desc">
            Create your account to access attendance records, track fines, check clearance status, and stay connected with org announcements.
          </p>
 
          <div className="steps-visual">
            {[
              { label: 'Personal info', desc: 'name · email · student ID', s: step > 1 ? 'done' : 'active' },
              { label: 'Account setup', desc: 'course · year · password', s: step === 2 ? 'active' : 'pending' },
            ].map((s, i) => (
              <div key={i}>
                <div className="step-row">
                  <div className="step-line-col">
                    <div className={`step-circle ${s.s}`}>
                      {s.s === 'done' ? '✓' : i + 1}
                    </div>
                    {i < 1 && <div className="step-connector" />}
                  </div>
                  <div className="step-content">
                    <div className={`step-name ${s.s === 'pending' ? 'pending' : ''}`}>{s.label}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Right panel */}
        <div className="right-panel">
          <div className="form-card">
            <div className="form-logo">
              <div className="form-logo-icon">🎓</div>
              <div>
                <div className="form-logo-text">COECS-LGU</div>
                <div className="form-logo-sub">Student Portal</div>
              </div>
            </div>
 
            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">
              Step {step} of 2 — {step === 1 ? 'Personal information' : 'Account setup'}
            </p>
 
            <div className="step-pills">
              <div className={`step-pill ${step >= 1 ? 'active' : ''}`} />
              <div className={`step-pill ${step >= 2 ? 'active' : ''}`} />
            </div>
 
            {error && (
              <div className="error-box">
                <span>⚠</span> {error}
              </div>
            )}
 
            {/* Step 1 */}
            {step === 1 && (
              <form onSubmit={handleNext} className="slide-in">
                <div className="field">
                  <label className="field-label">Full name</label>
                  <input className="field-input" name="name" placeholder="Maria Santos" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label className="field-label">Email address</label>
                  <input className="field-input" name="email" type="email" placeholder="you@coecs.local" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label className="field-label">Student ID</label>
                  <input className="field-input" name="student_id" placeholder="e.g. 2023-00001" value={formData.student_id} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: '0.25rem' }}>
                  Continue →
                </button>
              </form>
            )}
 
            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="slide-in">
                <div className="field-row">
                  <div className="field">
                    <label className="field-label">Course</label>
                    <select className="field-input" name="course" value={formData.course} onChange={handleChange} required>
                      <option value="">Select course</option>
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Year level</label>
                    <select className="field-input" name="year_level" value={formData.year_level} onChange={handleChange} required>
                      <option value="">Select year</option>
                      {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
 
                <div className="field">
                  <label className="field-label">Password</label>
                  <div className="field-wrap">
                    <input
                      className="field-input has-toggle"
                      name="password" type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={formData.password} onChange={handleChange} required
                    />
                    <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="strength-bar">
                      <div className="strength-track">
                        <div className="strength-fill" style={{ width: `${strength * 25}%`, background: strengthColor }} />
                      </div>
                      <div className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</div>
                    </div>
                  )}
                </div>
 
                <div className="field">
                  <label className="field-label">Confirm password</label>
                  <div className="field-wrap">
                    <input
                      className="field-input has-toggle"
                      name="password_confirmation" type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.password_confirmation} onChange={handleChange} required
                    />
                    <button type="button" className="toggle-btn" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? '🙈' : '👁'}
                    </button>
                  </div>
                  {formData.password_confirmation && (
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 4, color: formData.password === formData.password_confirmation ? '#3fb950' : '#f85149' }}>
                      {formData.password === formData.password_confirmation ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>
 
                <div className="btn-row">
                  <button type="button" className="back-btn" onClick={() => { setStep(1); setError(''); }}>← Back</button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading && <span className="spinner" />}
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </form>
            )}
 
            <div className="login-link">
              Already have an account? <Link href="/login">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}