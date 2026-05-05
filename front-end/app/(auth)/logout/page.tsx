'use client';

import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const { logout, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-redirect if user is not logged in
  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isLoggingOut]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0f1e] text-[#f8f9fa] flex items-center justify-center">
      {/* Background Gradients - Replicating your Landing Page design */}
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(201,168,76,0.16),_transparent_24%),radial-gradient(circle_at_right,_rgba(72,36,113,0.18),_transparent_22%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.05),_transparent_35%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-6 text-center">
        <div className="space-y-8">
          {/* Badge mimicking your "College of Engineering" tag */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] animate-fade-up">
            Security Session
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Sign <span className="text-[#c9a84c]">Out</span>
            </h1>
            {/* The Gold Line from your design */}
            <div className="w-16 h-[1px] bg-[#c9a84c] mx-auto opacity-50"></div>
            <p className="text-[#8b949e] text-lg">
              Are you sure you want to end your session, <br />
              <span className="text-white font-medium">{user?.name || 'User'}</span>?
            </p>
          </div>

          {/* Glass Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-2xl">
            <div className="flex flex-col gap-4">
              <Button
                className="bg-[#c9a84c] hover:bg-[#b89740] text-[#0a0f1e] rounded-full py-6 text-base font-bold transition-all shadow-lg shadow-[#c9a84c]/20"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Confirm Logout'}
              </Button>
              
              <Button
                className="bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-full py-6 text-base font-medium transition-all"
                onClick={() => router.back()}
                disabled={isLoggingOut}
              >
                Cancel & Stay
              </Button>
            </div>
            
            <p className="mt-6 text-[11px] text-[#484f58] uppercase tracking-widest">
              COECS-LGU Management System
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#c9a84c]/10 rounded-full blur-[120px] pointer-events-none" />
    </main>
  );
}