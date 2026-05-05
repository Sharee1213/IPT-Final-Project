'use client';
 
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
 
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
 
        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Sora', sans-serif;
          background-color: #0a0f1e;
          overflow: hidden;
          position: relative;
        }
 
        /* Animated background grid */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(56, 139, 253, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 139, 253, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridPan 30s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
 
        @keyframes gridPan {
          0%   { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }
 
        /* Glow blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(56, 139, 253, 0.18) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(79, 209, 197, 0.12) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation-delay: -4s;
        }
        .blob-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
          top: 50%; left: 50%;
          animation-delay: -2s;
        }
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }
 
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
        @media (min-width: 1024px) {
          .left-panel { display: flex; }
        }
 
        .org-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(56, 139, 253, 0.1);
          border: 1px solid rgba(56, 139, 253, 0.25);
          border-radius: 999px;
          padding: 6px 14px;
          width: fit-content;
          margin-bottom: 2.5rem;
        }
        .org-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #388bfd;
          box-shadow: 0 0 8px #388bfd;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #388bfd; }
          50%       { opacity: 0.6; box-shadow: 0 0 16px #388bfd; }
        }
        .org-badge-text {
          font-size: 12px;
          font-weight: 500;
          color: #388bfd;
          letter-spacing: 0.05em;
          font-family: 'JetBrains Mono', monospace;
        }
 
        .left-headline {
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 700;
          color: #e6edf3;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .left-headline span {
          background: linear-gradient(135deg, #388bfd, #4fd1c5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
 
        .left-desc {
          font-size: 1rem;
          color: #8b949e;
          line-height: 1.7;
          max-width: 400px;
          margin-bottom: 3rem;
        }
 
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #8b949e;
          font-size: 14px;
        }
        .feature-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(56, 139, 253, 0.08);
          border: 1px solid rgba(56, 139, 253, 0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }
 
        /* Right panel / form */
        .right-panel {
          flex: 0 0 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) {
          .right-panel {
            flex: 0 0 480px;
            border-left: 1px solid rgba(56, 139, 253, 0.08);
            background: rgba(10, 15, 30, 0.7);
            backdrop-filter: blur(24px);
          }
        }
 
        .form-card {
          width: 100%;
          max-width: 400px;
        }
 
        .form-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2.5rem;
        }
        .form-logo-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #388bfd, #4fd1c5);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 20px rgba(56, 139, 253, 0.4);
        }
        .form-logo-text {
          font-size: 15px;
          font-weight: 600;
          color: #e6edf3;
          letter-spacing: -0.01em;
        }
        .form-logo-sub {
          font-size: 11px;
          color: #8b949e;
          font-family: 'JetBrains Mono', monospace;
        }
 
        .form-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #e6edf3;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .form-subtitle {
          font-size: 14px;
          color: #8b949e;
          margin-bottom: 2rem;
        }
 
        .error-box {
          background: rgba(248, 81, 73, 0.08);
          border: 1px solid rgba(248, 81, 73, 0.3);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
          font-size: 13px;
          color: #f85149;
          animation: shakeIn 0.3s ease;
        }
        @keyframes shakeIn {
          0%   { transform: translateX(-6px); opacity: 0; }
          50%  { transform: translateX(4px); }
          100% { transform: translateX(0); opacity: 1; }
        }
 
        .field {
          margin-bottom: 1.1rem;
        }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #8b949e;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-family: 'JetBrains Mono', monospace;
        }
        .field-wrap {
          position: relative;
        }
        .field-input {
          width: 100%;
          background: rgba(22, 27, 42, 0.8);
          border: 1px solid rgba(56, 139, 253, 0.12);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #e6edf3;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: rgba(56, 139, 253, 0.5);
          box-shadow: 0 0 0 3px rgba(56, 139, 253, 0.08), 0 0 12px rgba(56, 139, 253, 0.1);
          background: rgba(22, 27, 42, 1);
        }
        .field-input::placeholder { color: #484f58; }
        .field-input.has-toggle { padding-right: 44px; }
 
        .toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #484f58;
          font-size: 16px;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: #8b949e; }
 
        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #388bfd, #4fd1c5);
          color: #0a0f1e;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(56, 139, 253, 0.3);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(56, 139, 253, 0.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .submit-btn .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(10,15,30,0.3);
          border-top-color: #0a0f1e;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
 
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.4rem 0;
          color: #484f58;
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(56, 139, 253, 0.08);
        }
 
        .register-link {
          text-align: center;
          font-size: 13px;
          color: #8b949e;
        }
        .register-link a {
          color: #388bfd;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .register-link a:hover { color: #4fd1c5; }
 
        .demo-hint {
          margin-top: 1.5rem;
          background: rgba(56, 139, 253, 0.04);
          border: 1px solid rgba(56, 139, 253, 0.1);
          border-radius: 10px;
          padding: 12px 14px;
        }
        .demo-hint-title {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #388bfd;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .demo-row {
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          color: #8b949e;
          line-height: 1.8;
        }
        .demo-row span { color: #e6edf3; }
      `}</style>
 
      <div className="login-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
 
        {/* Left panel */}
        <div className="left-panel">
          <div className="org-badge">
            <div className="org-badge-dot" />
            <span className="org-badge-text">COECS-LGU</span>
          </div>
 
          <h1 className="left-headline">
            Student Activity<br />
            <span>Management System</span>
          </h1>
 
          <p className="left-desc">
            Track attendance, manage fines, check clearance status, and stay updated with org announcements — all in one place.
          </p>
 
          <div className="feature-list">
            {[
              { icon: '📊', text: 'Real-time attendance tracking' },
              { icon: '💰', text: 'Fine & payment management' },
              { icon: '✅', text: 'Clearance status at a glance' },
              { icon: '📢', text: 'Org announcements & notifications' },
            ].map((f) => (
              <div className="feature-item" key={f.text}>
                <div className="feature-icon">{f.icon}</div>
                {f.text}
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
 
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your student account</p>
 
            {error && (
              <div className="error-box">
                <span>⚠</span>
                {error}
              </div>
            )}
 
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <input
                    className="field-input"
                    type="email"
                    placeholder="you@coecs.local"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
 
              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input
                    className={`field-input has-toggle`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
 
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
 
            <div className="divider">or</div>
 
            <div className="register-link">
              Don&apos;t have an account?{' '}
              <Link href="/register">Create one here</Link>
            </div>
 
            <div className="demo-hint">
              <div className="demo-hint-title">// DEMO CREDENTIALS</div>
              <div className="demo-row">admin &nbsp;&nbsp;→ <span>admin@coecs.local</span></div>
              <div className="demo-row">student → <span>student@coecs.local</span></div>
              <div className="demo-row">password → <span>password</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}