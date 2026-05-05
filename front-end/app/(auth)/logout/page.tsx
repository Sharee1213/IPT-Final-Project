'use client';

import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const { logout, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isLoggingOut]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login'); // Redirect to login after clearing session
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0f1e] text-[#e6edf3] flex items-center justify-center font-['Sora']">
      {/* Background Grid - Matching Login/Register */}
      <style>{`
        .logout-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(56, 139, 253, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 139, 253, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
      `}</style>
      <div className="logout-grid" />

      {/* Glow Blobs - Matching Login */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#388bfd]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 bg-[#4fd1c5]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-6 text-center">
        <div className="space-y-8">
          {/* Badge matching your COECS-LGU style */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#388bfd]/10 border border-[#388bfd]/25 text-[11px] uppercase tracking-widest text-[#388bfd] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#388bfd] shadow-[0_0_8px_#388bfd] animate-pulse" />
            Security Session
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Sign <span className="bg-gradient-to-r from-[#388bfd] to-[#4fd1c5] bg-clip-text text-fill-transparent">Out</span>
            </h1>
            <p className="text-[#8b949e] text-lg">
              Are you sure you want to end your session, <br />
              <span className="text-white font-medium">{user?.name || 'Student'}</span>?
            </p>
          </div>

          {/* Glass Card - Same blur as Login Right Panel */}
          <div className="bg-[#161b2a]/60 backdrop-blur-2xl rounded-[2rem] border border-white/5 p-10 shadow-2xl">
            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-gradient-to-r from-[#388bfd] to-[#4fd1c5] hover:opacity-90 text-[#0a0f1e] rounded-xl py-4 text-base font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Ending Session...' : 'Confirm Logout'}
              </button>
              
              <button
                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-[#8b949e] hover:text-white rounded-xl py-4 text-base font-medium transition-all disabled:opacity-50"
                onClick={() => router.back()}
                disabled={isLoggingOut}
              >
                Cancel & Return
              </button>
            </div>
            
            <p className="mt-8 text-[10px] text-[#484f58] uppercase tracking-[0.2em] font-mono">
              COECS-LGU Student Portal
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}