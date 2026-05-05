'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Connection Logic: Safety check for session
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !user) return null;

  // Determine if Admin or Student based on login credentials
  const isAdmin = user.role === 'admin' || user.email === 'admin@coecs.local';

  return (
    <div className="dash-root">
      <style>{`
        .dash-root {
          min-height: 100vh;
          background-color: #0a0f1e;
          font-family: 'Sora', sans-serif;
          color: #e6edf3;
          display: flex;
        }

        /* Sidebar - Matching your Login Right Panel style */
        .sidebar {
          width: 280px;
          background: rgba(10, 15, 30, 0.7);
          backdrop-filter: blur(24px);
          border-right: 1px solid rgba(56, 139, 253, 0.08);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          z-index: 10;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #8b949e;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(56, 139, 253, 0.1);
          color: #388bfd;
        }

        /* Main Content */
        .main-view {
          flex: 1;
          padding: 2.5rem 3.5rem;
          position: relative;
          overflow-y: auto;
        }

        .dash-card {
          background: rgba(22, 27, 42, 0.6);
          border: 1px solid rgba(56, 139, 253, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          transition: transform 0.2s;
        }

        .dash-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 139, 253, 0.3);
        }

        .status-pill {
          background: rgba(79, 209, 197, 0.1);
          color: #4fd1c5;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          border: 1px solid rgba(79, 209, 197, 0.2);
        }

        .logout-btn {
          margin-top: auto;
          color: #f85149;
          border: 1px solid rgba(248, 81, 73, 0.2);
          background: rgba(248, 81, 73, 0.05);
        }

        .logout-btn:hover {
          background: rgba(248, 81, 73, 0.1);
          color: #ff6b6b;
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#388bfd] to-[#4fd1c5] flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            🎓
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">COECS-LGU</div>
            <div className="text-[10px] text-[#8b949e] font-mono">SYSTEM V1.0</div>
          </div>
        </div>

        <nav className="flex-1">
          <Link href="/student/dashboard" className="nav-item active">📊 Overview</Link>
          {isAdmin ? (
            <>
              <Link href="/admin/users" className="nav-item">👥 Manage Students</Link>
              <Link href="/admin/fines" className="nav-item">💰 Financial Records</Link>
            </>
          ) : (
            <>
              <Link href="/student/attendance" className="nav-item">📝 My Attendance</Link>
              <Link href="/student/fines" className="nav-item">💸 My Fines</Link>
              <Link href="/student/clearance" className="nav-item">✅ Clearance</Link>
            </>
          )}
        </nav>

        <button onClick={() => router.push('/logout')} className="nav-item logout-btn">
          🚪 Log Out Session
        </button>
      </aside>

      {/* Main Dashboard UI */}
      <main className="main-view">
        {/* Background Gradients from Login */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Welcome, <span className="text-[#388bfd]">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-[#8b949e] text-sm">
              {isAdmin ? 'System Administrative Access' : `Student ID: ${user.student_id || 'N/A'}`}
            </p>
          </div>
          <div className="status-pill">{isAdmin ? 'ADMIN' : 'STUDENT'}</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="dash-card">
            <div className="text-[#8b949e] text-[11px] font-mono uppercase mb-2">Total Attendance</div>
            <div className="text-3xl font-bold">92%</div>
            <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
               <div className="h-full bg-[#4fd1c5] w-[92%]" />
            </div>
          </div>

          <div className="dash-card">
            <div className="text-[#8b949e] text-[11px] font-mono uppercase mb-2">Pending Fines</div>
            <div className="text-3xl font-bold text-[#f85149]">₱0.00</div>
            <div className="text-[10px] text-green-400 mt-4">✓ ALL SETTLED</div>
          </div>

          <div className="dash-card">
            <div className="text-[#8b949e] text-[11px] font-mono uppercase mb-2">Announcements</div>
            <div className="text-3xl font-bold">3</div>
            <div className="text-[10px] text-[#388bfd] mt-4 font-bold cursor-pointer hover:underline">VIEW UPDATES →</div>
          </div>
        </div>

        <section className="mt-10 dash-card min-h-[300px] flex items-center justify-center border-dashed relative z-10">
          <div className="text-center">
            <div className="text-4xl mb-4 opacity-20">📂</div>
            <p className="text-[#8b949e] text-sm italic">No recent activity to display for this session.</p>
          </div>
        </section>
      </main>
    </div>
  );
}