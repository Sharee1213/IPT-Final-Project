'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Mock data for the refined directory
  const [students, setStudents] = useState([
    { id: '2023-0001', name: 'Juan Dela Cruz', dept: 'Engineering', status: 'Active', email: 'juan.dc@coecs.edu' },
    { id: '2024-0412', name: 'Maria Clara', dept: 'IT', status: 'Active', email: 'm.clara@coecs.edu' },
    { id: '2022-0988', name: 'Crisostomo Ibarra', dept: 'Engineering', status: 'Inactive', email: 'ibarra.c@coecs.edu' },
  ]);

  const toggleStatus = (id: string) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ));
  };

  return (
    <AdminLayout>
      {/* Internal CSS Refinement */}
      <style>{`
        .dash-card {
          background: rgba(22, 27, 42, 0.6);
          border: 1px solid rgba(56, 139, 253, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .dash-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 4px; height: 100%;
          background: linear-gradient(to bottom, #388bfd, #4fd1c5);
          opacity: 0.6;
        }
        .status-pill {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }
        .action-icon-btn {
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .action-icon-btn:hover {
          background: rgba(56, 139, 253, 0.1);
          border-color: rgba(56, 139, 253, 0.2);
        }
      `}</style>

      <header className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-4xl font-bold tracking-tight">System <span className="text-[#388bfd]">Portal</span></h1>
             <span className="px-3 py-1 rounded-full bg-[#388bfd]/10 border border-[#388bfd]/20 text-[#388bfd] text-[10px] font-bold uppercase tracking-widest">v1.0.4</span>
          </div>
          <p className="text-[#8b949e]">Managing 1,240 students across 4 departments.</p>
        </div>
        
        <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all">
                Export Data
            </button>
            <button 
                onClick={() => setIsAddingStudent(true)}
                className="bg-gradient-to-r from-[#388bfd] to-[#4fd1c5] text-[#0a0f1e] px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
            >
                + New Student Profile
            </button>
        </div>
      </header>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
            { label: 'Total Students', val: '1,240', color: '#388bfd' },
            { label: 'Active Now', val: '856', color: '#4fd1c5' },
            { label: 'Pending Fines', val: '₱12.4k', color: '#f85149' },
            { label: 'System Health', val: '99.9%', color: '#388bfd' }
        ].map((stat, i) => (
            <div key={i} className="dash-card">
                <div className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.val}</div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Student Management Table */}
        <div className="lg:col-span-2 dash-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h2 className="font-semibold text-lg">Student Directory</h2>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Search UID..." 
                    className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:border-[#388bfd] outline-none transition-all"
                />
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-[10px] text-[#484f58] uppercase font-mono tracking-tighter">
              <tr>
                <th className="p-4">Student Detail</th>
                <th className="p-4">Department</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.map((s) => (
                <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4">
                    <div className="font-semibold text-[#e6edf3]">{s.name}</div>
                    <div className="text-[11px] font-mono text-[#388bfd]">{s.id}</div>
                  </td>
                  <td className="p-4 text-[#8b949e]">{s.dept}</td>
                  <td className="p-4">
                    <span className={`status-pill ${s.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="action-icon-btn text-[#8b949e] hover:text-white">Edit</button>
                    <button 
                        onClick={() => toggleStatus(s.id)}
                        className={`action-icon-btn ${s.status === 'Active' ? 'text-[#f85149]' : 'text-[#4fd1c5]'}`}
                    >
                        {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center bg-white/[0.01] border-t border-white/5">
                <button className="text-[11px] text-[#388bfd] font-bold uppercase tracking-widest hover:underline">View All 1,240 Profiles</button>
          </div>
        </div>

        {/* Right: Quick Settings & Recent Logs */}
        <div className="space-y-6">
            <div className="dash-card">
                <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4fd1c5]" /> Essential Controls
                </h3>
                <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#388bfd]/40 transition-all group">
                        <div className="text-xs font-bold group-hover:text-[#388bfd]">Batch Enrollment</div>
                        <div className="text-[10px] text-[#8b949e]">Upload CSV/Excel student lists</div>
                    </button>
                    <button className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#388bfd]/40 transition-all group">
                        <div className="text-xs font-bold group-hover:text-[#388bfd]">Generate Clearances</div>
                        <div className="text-[10px] text-[#8b949e]">Bulk sign current semester items</div>
                    </button>
                </div>
            </div>

            <div className="dash-card min-h-[200px]">
                <h3 className="font-semibold mb-4 text-sm">Security Logs</h3>
                <div className="space-y-4">
                    <div className="flex gap-3 items-start border-l-2 border-[#388bfd]/30 pl-3 py-1">
                        <div className="text-[10px] text-[#8b949e] font-mono leading-none pt-1">12:04</div>
                        <div className="text-[11px] text-[#e6edf3]">
                            <span className="text-[#388bfd] font-bold">Admin</span> deactivated student <span className="font-mono">2022-0988</span>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start border-l-2 border-[#4fd1c5]/30 pl-3 py-1">
                        <div className="text-[10px] text-[#8b949e] font-mono leading-none pt-1">11:50</div>
                        <div className="text-[11px] text-[#e6edf3]">
                            New student profile created: <span className="text-[#4fd1c5]">Maria Clara</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}