import AppThemeProvider from '@/components/theme/AppThemeProvider';
import SiteShell from '@/components/SiteShell';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <SiteShell>{children}</SiteShell>
    </AppThemeProvider>
  );
}
