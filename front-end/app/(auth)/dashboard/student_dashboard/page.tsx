'use client';

import StudentLayout from '@/components/layout/StudentLayout';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');

  return (
    <StudentLayout>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {activeTab === 'overview' ? `Hello, ${user?.name?.split(' ')[0] || 'Student'}! 👋` : 'Account Settings'}
          </h1>
          <p className="text-[#8b949e]">
            {activeTab === 'overview' 
              ? 'Here is your academic activity summary for this semester.' 
              : 'Manage your personal information and security settings.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#161b22] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-[#388bfd] text-white shadow-lg shadow-blue-500/20' : 'text-[#8b949e] hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'profile' ? 'bg-[#388bfd] text-white shadow-lg shadow-blue-500/20' : 'text-[#8b949e] hover:text-white'}`}
          >
            My Profile
          </button>
        </div>
      </header>

      {activeTab === 'overview' ? (
        <>
          {/* Your Existing Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#4fd1c5] opacity-50" />
              <div className="text-[11px] font-mono text-[#8b949e] uppercase mb-4">Event Attendance</div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[#4fd1c5]">92%</span>
                <span className="text-[#8b949e] text-sm mb-1">/ 100%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#4fd1c5] h-full w-[92%] shadow-[0_0_8px_#4fd1c5]" />
              </div>
            </div>

            <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-50" />
              <div className="text-[11px] font-mono text-[#8b949e] uppercase mb-4">Clearance Status</div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-bold uppercase">
                  Pending
                </div>
                <span className="text-sm text-[#8b949e]">2 items remaining</span>
              </div>
            </div>

            <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#388bfd] opacity-50" />
              <div className="text-[11px] font-mono text-[#8b949e] uppercase mb-4">Outstanding Fines</div>
              <div className="text-4xl font-bold text-white">₱ 0.00</div>
              <p className="text-[11px] mt-4 text-[#4fd1c5] font-medium">✨ All settled</p>
            </div>
          </div>

          {/* Announcements */}
          <section className="bg-[#161b22]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <span className="text-[#388bfd]">📢</span> Recent Announcements
            </h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#388bfd]/30 hover:bg-white/[0.04] transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium group-hover:text-[#388bfd] transition-colors">General Assembly - Attendance Required</h3>
                    <span className="text-[10px] font-mono text-[#484f58]">OCT 24, 2023</span>
                  </div>
                  <p className="text-sm text-[#8b949e] line-clamp-2">All COECS students are required to attend the upcoming assembly at the University Gym...</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Profile Management Section */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Profile Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#161b22] border border-white/5 p-8 rounded-3xl text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#388bfd] to-[#4fd1c5] mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-[#0a0f1e]">
                {user?.name?.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white">{user?.name}</h3>
              <p className="text-[#388bfd] font-mono text-xs uppercase tracking-widest mt-1">Student ID: {user?.id || '2023-0000'}</p>
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-[#484f58]">Department</span>
                    <span className="text-[#8b949e]">Engineering</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-[#484f58]">Year Level</span>
                    <span className="text-[#8b949e]">3rd Year</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="lg:col-span-2 bg-[#161b22] border border-white/5 rounded-3xl p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-[#8b949e] uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#388bfd] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-[#8b949e] uppercase tracking-widest">Phone Number</label>
                  <input type="text" placeholder="+63 900 000 0000" className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#388bfd] outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono text-[#8b949e] uppercase tracking-widest">Change Password</label>
                <input type="password" placeholder="Enter new password" className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#388bfd] outline-none" />
              </div>

              <div className="pt-4">
                <button type="button" className="bg-[#388bfd] hover:bg-[#388bfd]/90 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}