'use client';

import { Navbar } from '@/components/layout';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

const features = [
  {
    title: 'Centralized announcements',
    description: 'Deliver timely student notices with a polished, easy-to-scan feed.',
  },
  {
    title: 'Attendance & QR check-in',
    description: 'Scan student IDs, review attendance, and export attendance history.',
  },
  {
    title: 'Financial & clearance tracking',
    description: 'Monitor fines, payments, and clearance status in one premium dashboard.',
  },
];

const steps = [
  { label: 'Create Account', detail: 'Sign up with your student ID and start tracking your activities.' },
  { label: 'Attend Events', detail: 'Join campus events and have attendance recorded instantly.' },
  { label: 'Stay Cleared', detail: 'Manage fines, payments, and clearance with a single panel.' },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(user?.role === 'admin' || user?.role === 'officer' ? '/admin/dashboard' : '/student/dashboard');
    } else {
      loadPublicData();
    }
  }, [isAuthenticated, router, user?.role]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const loadPublicData = async () => {
    try {
      const ann = await api.getLatestAnnouncements();
      setAnnouncements((ann as any).slice(0, 3));
      const evt = await api.getUpcomingEvents();
      setEvents((evt as any).slice(0, 3));
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const announcementsPreview = useMemo(() => announcements.slice(0, 3), [announcements]);
  const eventsPreview = useMemo(() => events.slice(0, 3), [events]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-navy text-cream">
        <section className="relative min-h-screen pt-28">
          <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(201,168,76,0.16),_transparent_24%),radial-gradient(circle_at_right,_rgba(72,36,113,0.18),_transparent_22%)] opacity-80 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.05),_transparent_35%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-10 sm:px-8 lg:flex-row lg:items-center lg:py-24">
            <div className="space-y-8 lg:w-1/2">
              <span className="badge reveal animate-fade-up-1">College of Engineering & Computer Science</span>
              <div className="space-y-6">
                <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight text-cream sm:text-6xl md:text-7xl reveal animate-fade-up-2">
                  Student Activity<br />
                  <span className="bg-gradient-to-r from-gold to-gold2 bg-clip-text text-transparent">Management</span> System
                </h1>
                <div className="gold-line w-20 reveal animate-fade-up-3"></div>
                <p className="max-w-2xl text-lg leading-8 text-muted reveal animate-fade-up-4">
                  A unified platform for tracking attendance, managing fines, and streamlining communication for COECS-LGU.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 reveal animate-fade-up-5">
                <Button
                  className="btn-gold rounded-3xl px-8 py-3 text-base"
                  onClick={() => router.push('/register')}
                >
                  Create Account
                </Button>
                <Button
                  className="btn-outline rounded-3xl px-8 py-3 text-base"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Features
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="glass-card relative overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
                <div className="absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10 bg-white/5 blur-2xl" />
                <div className="relative space-y-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-gold">Student Dashboard</p>
                      <p className="mt-2 text-2xl font-semibold text-cream">Attendance preview</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-gold to-gold2 text-navy shadow-[0_15px_35px_rgba(201,168,76,0.3)]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                      <div className="flex items-center justify-between text-sm text-muted">
                        <span>Attendance Rate</span>
                        <span className="font-semibold text-gold">92%</span>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-gold to-gold2" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                        <p className="text-sm text-muted">Fines Due</p>
                        <p className="mt-3 text-xl font-semibold text-cream">CLEARED</p>
                      </div>
                      <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                        <p className="text-sm text-muted">Clearance Status</p>
                        <p className="mt-3 text-xl font-semibold text-cream">Approved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-bounce absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sm text-muted">
            <span className="font-mono tracking-[0.3em] uppercase">Scroll</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        <section id="features" className="relative mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <h2 className="font-display text-4xl font-semibold text-cream sm:text-5xl reveal animate-fade-up-1">Premium campus operations, built for COECS-LGU.</h2>
            <p className="mt-6 text-lg leading-8 text-muted reveal animate-fade-up-2">
              Manage student attendance, events, payments, and clearance with a unified, elegant dashboard that feels as premium as your institution.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={feature.title} className="glass-card rounded-[1.75rem] border border-white/10 p-6 reveal animate-fade-up-3" style={{ animationDelay: `${0.12 * (index + 1)}s` }}>
                <div className="mb-4 h-12 w-12 rounded-3xl bg-white/10 border border-white/10 text-gold flex items-center justify-center">
                  <span className="text-xl font-semibold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-cream mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.label} className="glass-card rounded-[1.75rem] border border-white/10 p-6 reveal animate-fade-up-3" style={{ animationDelay: `${0.16 * (index + 1)}s` }}>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold2 text-navy text-lg font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-cream mb-2">{step.label}</h3>
                <p className="text-muted leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="events" className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold">Upcoming events</p>
              <h2 className="font-display text-4xl font-semibold text-cream mt-4">Stay ahead of campus activities.</h2>
            </div>
            <Button
              className="btn-outline rounded-3xl px-6 py-3 text-sm"
              onClick={() => router.push('/register')}
            >
              Join the network
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {eventsPreview.map((evt: any) => (
              <div key={evt.id} className="glass-card rounded-[1.75rem] border border-white/10 p-6 reveal animate-fade-up-4">
                <p className="text-sm uppercase tracking-[0.2em] text-gold">Event</p>
                <h3 className="mt-4 text-2xl font-semibold text-cream">{evt.title}</h3>
                <p className="mt-4 text-muted leading-relaxed line-clamp-3">{evt.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-muted">
                  <span>{new Date(evt.start_date).toLocaleDateString()}</span>
                  <span>{new Date(evt.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
