'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Connection Logic: Ensure only Admins can access this layout
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      // If a student tries to access /admin, kick them to their dashboard
      router.push('/student/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted || !user) return <div className="min-h-screen bg-[#0a0f1e]" />;

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: '📊' },
    { name: 'Student Management', href: '/admin/students', icon: '👥' },
    { name: 'Event Coordination', href: '/admin/events', icon: '📅' },
    { name: 'Financial Records', href: '/admin/financials', icon: '💰' },
    { name: 'System Announcements', href: '/admin/announcements', icon: '📢' },
  ];

  return (
    <div className="admin-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .admin-root {
          min-height: 100vh;
          background-color: #0a0f1e;
          font-family: 'Sora', sans-serif;
          color: #e6edf3;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        /* Sidebar - Matching Login Right Panel style */
        .sidebar {
          width: 280px;
          background: rgba(13, 17, 23, 0.7);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(56, 139, 253, 0.08);
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          z-index: 10;
          position: relative;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 12px;
          color: #8b949e;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.25s;
          margin-bottom: 6px;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(56, 139, 253, 0.08);
          color: #388bfd;
          box-shadow: inset 0 0 10px rgba(56, 139, 253, 0.03);
        }

        .nav-item.active {
          font-weight: 600;
          border: 1px solid rgba(56, 139, 253, 0.1);
        }

        /* Main Content */
        .main-view {
          flex: 1;
          padding: 3rem 4rem;
          position: relative;
          overflow-y: auto;
          z-index: 1;
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(248, 81, 73, 0.05);
          border: 1px solid rgba(248, 81, 73, 0.2);
          color: #f85149;
          font-weight: 600;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(248, 81, 73, 0.12);
          color: #ff6b6b;
          border-color: rgba(248, 81, 73, 0.4);
        }
      `}</style>

      {/* Glow Blobs in background */}
      <div className="absolute top-[-150px] left-[100px] w-96 h-96 bg-[#388bfd]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[200px] w-80 h-80 bg-[#4fd1c5]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#388bfd] to-[#4fd1c5] flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            🎓
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">COECS-LGU</div>
            <div className="text-[10px] text-[#8b949e] font-mono tracking-wider uppercase">Admin Portal</div>
          </div>
        </div>

        <nav className="flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <button onClick={() => router.push('/logout')} className="nav-item logout-btn">
          🚪 Log Out Session
        </button>
      </aside>

      {/* Main UI Area */}
      <main className="main-view">
        {children}
      </main>
    </div>
  );
}