'use client';

import StudentLayout from '@/components/layout/StudentLayout';
import { useAuth } from '@/lib/auth-context';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <StudentLayout>
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
        <p className="text-[#8b949e]">Here is your academic activity summary for this semester.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Attendance Card */}
        <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl">
          <div className="text-[11px] font-mono text-[#8b949e] uppercase mb-4">Event Attendance</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#4fd1c5]">92%</span>
            <span className="text-[#8b949e] text-sm mb-1">/ 100%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#4fd1c5] h-full w-[92%]" />
          </div>
        </div>

        {/* Clearance Card */}
        <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl">
          <div className="text-[11px] font-mono text-[#8b949e] uppercase mb-4">Clearance Status</div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-bold uppercase">
              Pending
            </div>
            <span className="text-sm text-[#8b949e]">2 items remaining</span>
          </div>
          <p className="text-[11px] mt-4 text-[#8b949e]">Check "My Clearance" for details.</p>
        </div>

        {/* Fines Card */}
        <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl">
          <div className="text-[11px] font-mono text-[#8b949e] uppercase mb-4">Outstanding Fines</div>
          <div className="text-4xl font-bold text-[#f85149]">₱ 0.00</div>
          <p className="text-[11px] mt-4 text-green-500">You are all caught up!</p>
        </div>
      </div>

      {/* Recent Announcements Section */}
      <section className="bg-[#161b22] border border-white/5 rounded-3xl p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          📢 Recent Announcements
        </h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#388bfd]/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[#388bfd]">General Assembly - Attendance Required</h3>
                <span className="text-[10px] font-mono text-[#484f58]">OCT 24, 2023</span>
              </div>
              <p className="text-sm text-[#8b949e] line-clamp-2">
                All COECS students are required to attend the upcoming assembly at the University Gym...
              </p>
            </div>
          ))}
        </div>
      </section>
    </StudentLayout>
  );
}