'use client';

import { useEffect } from 'react';
import { applyAccent, readStoredAccent } from '@/lib/theme-accent';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SiteBackground from '@/components/SiteBackground';
import PageTransition from '@/components/PageTransition';
import SiteCommandMenu from '@/components/SiteCommandMenu';
import ScrollProgress from '@/components/ScrollProgress';
import SkipToContent from '@/components/SkipToContent';
import { CommandMenuProvider } from '@/components/CommandMenuProvider';
import { PortfolioSettingsProvider } from '@/components/providers/PortfolioSettingsProvider';
import { Toaster } from '@/components/ui/sonner';
import LoadingScreen from '@/components/LoadingScreen';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyAccent(readStoredAccent());
  }, []);

  return (
    <PortfolioSettingsProvider>
      <CommandMenuProvider>
        <LoadingScreen />
        <Toaster position="bottom-right" richColors closeButton />
        <SkipToContent />
        <SiteBackground />
        <CustomCursor />
        <SiteCommandMenu />
        <ScrollProgress />
        <Navigation />
        <main id="main-content" className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </CommandMenuProvider>
    </PortfolioSettingsProvider>
  );
}
