'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Security & Connection Logic
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      router.push('/student/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted || !user) return <div className="min-h-screen bg-[#0a0f1e]" />;

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: '📊' },
    { name: 'Student Management', href: '/admin/students', icon: '👥' },
    { name: 'Event Coordination', href: '/admin/events', icon: '📅' },
    { name: 'Financial Records', href: '/admin/financials', icon: '💰' },
    { name: 'Announcements', href: '/admin/announcements', icon: '📢' },
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

        /* Refined Sidebar */
        .sidebar {
          width: 280px;
          background: rgba(13, 17, 23, 0.8);
          backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.25rem;
          z-index: 50;
          position: relative;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #8b949e;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 4px;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          color: #e6edf3;
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          background: rgba(56, 139, 253, 0.1);
          color: #388bfd;
          border: 1px solid rgba(56, 139, 253, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        /* Top Navigation Header inside Main View */
        .top-header {
          height: 70px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(10, 15, 30, 0.4);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 3rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .main-view {
          flex: 1;
          height: 100vh;
          overflow-y: auto;
          position: relative;
          background: radial-gradient(circle at 50% 0%, rgba(56, 139, 253, 0.05) 0%, transparent 50%);
        }

        .content-container {
          padding: 2.5rem 3.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .user-profile-mini {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 16px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(248, 81, 73, 0.05);
          border: 1px solid rgba(248, 81, 73, 0.1);
          color: #f85149;
          font-weight: 600;
          cursor: pointer;
          justify-content: center;
        }

        .logout-btn:hover {
          background: #f85149;
          color: white;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Decorative Blobs */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#388bfd]/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#388bfd] to-[#4fd1c5] flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            🎓
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">COECS-LGU</div>
            <div className="text-[9px] text-[#4fd1c5] font-mono tracking-[0.2em] uppercase font-bold">Administrator</div>
          </div>
        </div>

        {/* User Quick Info */}
        <div className="user-profile-mini">
           <div className="w-8 h-8 rounded-full bg-[#161b2a] border border-[#388bfd]/30 flex items-center justify-center text-xs font-bold text-[#388bfd]">
             {user?.name?.charAt(0) || 'A'}
           </div>
           <div className="overflow-hidden">
             <div className="text-[11px] font-bold text-white truncate">{user?.name}</div>
             <div className="text-[9px] text-[#8b949e] font-mono uppercase tracking-tighter">System Manager</div>
           </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1">
          <div className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest mb-4 px-4">Main Menu</div>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <button 
          onClick={() => router.push('/logout')} 
          className="nav-item logout-btn"
        >
          Sign Out Session
        </button>
      </aside>

      {/* Main UI Area */}
      <div className="main-view">
        {/* Top Glass Header */}
        <div className="top-header">
           <div className="flex items-center gap-6">
              <div className="text-[10px] font-mono text-[#8b949e]">
                SYSTEM STATUS: <span className="text-[#4fd1c5] font-bold">OPERATIONAL</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="text-[10px] font-mono text-[#8b949e]">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
           </div>
        </div>

        {/* Content Render Area */}
        <main className="content-container">
          {children}
        </main>
      </div>
    </div>
  );
}