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

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!mounted || !user) return <div className="min-h-screen bg-[#0a0f1e]" />;

  const navItems = [
    { name: 'My Dashboard', href: '/student/dashboard', icon: '🏠' },
    { name: 'Attendance History', href: '/student/attendance', icon: '📝' },
    { name: 'Fines & Payments', href: '/student/fines', icon: '💳' },
    { name: 'My Clearance', href: '/student/clearance', icon: '✅' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-[#e6edf3] font-['Sora']">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0d1117]/60 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col z-20">
        <div className="mb-12">
          <div className="text-[#388bfd] font-bold text-xl tracking-tighter">COECS-LGU</div>
          <div className="text-[10px] text-[#8b949e] font-mono uppercase tracking-widest">Student Portal</div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.href 
                ? 'bg-[#388bfd]/10 text-[#388bfd] border border-[#388bfd]/20' 
                : 'text-[#8b949e] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <Link href="/logout" className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-[#f85149] hover:bg-[#f85149]/10 transition-all">
          <span>🚪</span>
          <span className="text-sm font-semibold">Sign Out</span>
        </Link>
      </aside>

      <main className="flex-1 p-10 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#388bfd]/5 blur-[120px] rounded-full -z-10" />
        {children}
      </main>
    </div>
  );
}