'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isLanding = pathname === '/';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(10,22,40,0.82)] backdrop-blur-xl text-cream">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-cream transition hover:text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold2 text-navy shadow-[0_18px_40px_rgba(201,168,76,0.25)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <div>
            <div className="text-sm font-semibold">COECS-LGU</div>
            <div className="text-xs text-muted">SAMS v1.0</div>
          </div>
        </Link>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream transition hover:bg-white/10 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className={`w-full md:flex md:w-auto md:items-center ${mobileOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 backdrop-blur-xl md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0">
            {isLanding && (
              <>
                <Link href="#features" className="text-sm text-cream transition hover:text-white">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm text-cream transition hover:text-white">
                  How It Works
                </Link>
                <Link href="#events" className="text-sm text-cream transition hover:text-white">
                  Events
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-cream hidden md:inline">{user?.name}</span>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-cream transition hover:bg-white/10"
                  >
                    Menu
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-52 rounded-3xl border border-white/10 bg-[rgba(10,22,40,0.96)] p-2 shadow-2xl backdrop-blur-xl">
                      <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="block rounded-2xl px-4 py-2 text-sm text-cream transition hover:bg-white/10">
                        Dashboard
                      </Link>
                      <Link href={user?.role === 'admin' ? '/admin/students' : '/student/profile'} className="block rounded-2xl px-4 py-2 text-sm text-cream transition hover:bg-white/10">
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-2xl px-4 py-2 text-left text-sm text-cream transition hover:bg-white/10"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Link href="/login" className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.08)] px-5 py-2 text-sm text-cream transition hover:bg-white/15">
                  Sign In
                </Link>
                <Link href="/register" className="btn-gold rounded-3xl px-5 py-2 text-sm">
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Sidebar({ role }: { role?: 'student' | 'admin' }) {
  const links = {
    student: [
      { label: 'Dashboard', href: '/student/dashboard' },
      { label: 'Profile', href: '/student/profile' },
      { label: 'Events', href: '/student/events' },
      { label: 'Attendance', href: '/student/attendance' },
      { label: 'Fines & Payments', href: '/student/fines' },
      { label: 'Clearance', href: '/student/clearance' },
      { label: 'Feedback', href: '/student/feedback' },
    ],
    admin: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Students', href: '/admin/students' },
      { label: 'Events', href: '/admin/events' },
      { label: 'Attendance', href: '/admin/attendance' },
      { label: 'Fines', href: '/admin/fines' },
      { label: 'Payments', href: '/admin/payments' },
      { label: 'Clearance', href: '/admin/clearance' },
      { label: 'Messages', href: '/admin/messages' },
      { label: 'Announcements', href: '/admin/announcements' },
    ],
  };

  const currentLinks = role === 'admin' ? links.admin : links.student;

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen">
      <div className="mb-8">
        <h2 className="text-xl font-bold">COECS-LGU</h2>
      </div>
      <nav className="space-y-2">
        {currentLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: 'student' | 'admin';
}) {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
