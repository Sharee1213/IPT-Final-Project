'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Connection Logic: Ensure only students access this area
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted || !user) return <div className="min-h-screen bg-[#0a0f1e]" />;

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: '📊' },
    { name: 'My Attendance', href: '/student/attendance', icon: '📝' },
    { name: 'My Fines', href: '/student/fines', icon: '💸' },
    { name: 'Clearance', href: '/student/clearance', icon: '✅' },
  ];

  return (
    <div className="student-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .student-root {
          min-height: 100vh;
          background-color: #0a0f1e;
          font-family: 'Sora', sans-serif;
          color: #e6edf3;
          display: flex;
        }

        .sidebar {
          width: 280px;
          background: rgba(13, 17, 23, 0.8);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.25rem;
          position: fixed;
          height: 100vh;
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

        .nav-item.active {
          font-weight: 600;
          border: 1px solid rgba(56, 139, 253, 0.1);
        }

        .main-container {
          flex: 1;
          margin-left: 280px; /* Offset for fixed sidebar */
          padding: 3rem 4rem;
          position: relative;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(248, 81, 73, 0.05);
          border: 1px solid rgba(248, 81, 73, 0.1);
          color: #f85149;
          font-weight: 600;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(248, 81, 73, 0.1);
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#388bfd] to-[#4fd1c5] flex items-center justify-center text-xl shadow-lg">
            🎓
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">COECS-LGU</div>
            <div className="text-[10px] text-[#4fd1c5] font-mono font-bold uppercase">Student Portal</div>
          </div>
        </div>

        {/* Mini Profile Info */}
        <div className="user-card">
          <div className="text-[10px] text-[#8b949e] font-mono uppercase tracking-widest mb-1">Authenticated As</div>
          <div className="text-sm font-bold text-white truncate">{user.name}</div>
          <div className="text-[11px] text-[#388bfd] font-mono mt-1">{user.student_id || 'ID: 2024-XXXX'}</div>
        </div>

        <nav className="flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          {/* New Profile Link */}
          <Link 
            href="/student/profile" 
            className={`nav-item mt-4 border-t border-white/5 pt-4 ${pathname === '/student/profile' ? 'active' : ''}`}
          >
            <span className="text-lg">⚙️</span>
            Account Settings
          </Link>
        </nav>

        <button onClick={() => router.push('/logout')} className="nav-item logout-btn">
          🚪 Sign Out Session
        </button>
      </aside>

      {/* Main UI View Area */}
      <main className="main-container">
        {/* Glow Effects from Login UI */}
        <div className="absolute top-[-100px] right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        {children}
      </main>
    </div>
  );
}