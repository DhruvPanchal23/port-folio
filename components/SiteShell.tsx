'use client';

import { useEffect } from 'react';
import { applyAccent, readStoredAccent } from '@/lib/theme-accent';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SiteBackground from '@/components/SiteBackground';
import PageTransition from '@/components/PageTransition';
import SiteCommandMenu from '@/components/SiteCommandMenu';
import { CommandMenuProvider } from '@/components/CommandMenuProvider';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyAccent(readStoredAccent());
  }, []);

  return (
    <CommandMenuProvider>
      <LoadingScreen />
      <SiteBackground />
      <CustomCursor />
      <SiteCommandMenu />
      <Navigation />
      <main className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </CommandMenuProvider>
  );
}
