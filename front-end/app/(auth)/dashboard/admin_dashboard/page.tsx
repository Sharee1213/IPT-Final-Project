'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/lib/auth-context';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1.5">
            System <span className="text-[#388bfd]">Overview</span>
          </h1>
          <p className="text-[#8b949e] text-base">
            Welcome back, <span className="text-white font-medium">{user?.name}</span>. Here is the latest system activity.
          </p>
        </div>
        
        {/* Status Pill - Matching Register Steps visual */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 text-[11px] uppercase tracking-widest text-[#4fd1c5] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4fd1c5] shadow-[0_0_8px_#4fd1c5] animate-pulse" />
            Admin Access
        </div>
      </header>

      {/* Stats Grid - Premium Cards */}
      <style>{`
        .dash-card {
          background: rgba(22, 27, 42, 0.6);
          border: 1px solid rgba(56, 139, 253, 0.1);
          border-radius: 20px;
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .dash-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 139, 253, 0.3);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        /* The active blue indicator on the left of cards */
        .dash-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 4px; height: 100%;
          background: linear-gradient(to bottom, #388bfd, #4fd1c5);
          opacity: 0.7;
        }

        .stat-label {
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #8b949e;
          margin-bottom: 0.75rem;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #e6edf3;
        }

        .stat-meta {
          font-size: 12px;
          margin-top: 0.5rem;
        }

        .report-btn {
          background: linear-gradient(135deg, #388bfd, #4fd1c5);
          color: #0a0f1e;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(56, 139, 253, 0.2);
        }

        .report-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="dash-card">
          <div className="stat-label">Total Enrolled Students</div>
          <div className="stat-value">1,240</div>
          <div className="stat-meta text-green-400">↑ 12 new this month</div>
        </div>

        <div className="dash-card">
          <div className="stat-label">Upcoming Events (This Week)</div>
          <div className="stat-value">3</div>
          <div className="stat-meta text-[#388bfd]">Next: Org Assembly (Friday)</div>
        </div>

        <div className="dash-card">
          <div className="stat-label">Pending Clearances</div>
          <div className="stat-value text-[#f85149]">42</div>
          <div className="stat-meta text-[#f85149]">⚠️ Requires Review</div>
        </div>
      </div>

      {/* Large Content Area */}
      <section className="dash-card min-h-[350px]">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Recent System Activity</h2>
            <button className="report-btn">Generate Full Report</button>
        </div>
        
        {/* Placeholder for activity log */}
        <div className="flex flex-col items-center justify-center text-center pt-16 border border-dashed border-[#388bfd]/20 rounded-2xl bg-[#0d1117]/50 p-10">
          <div className="text-5xl mb-6 opacity-20">📊</div>
          <p className="text-muted text-sm italic max-w-sm">
            Detailed logs of student check-ins, fine payments, and clearance approvals will populate here as the system collects data.
          </p>
        </div>
      </section>
    </AdminLayout>
  );
}