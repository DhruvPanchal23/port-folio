'use client';

import { Download } from 'lucide-react';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import { getResumeDownloadUrl } from '@/lib/portfolio-settings';
import { cn } from '@/lib/utils';

type ResumeDownloadLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: React.ReactNode;
  showIcon?: boolean;
  asButton?: boolean;
};

export default function ResumeDownloadLink({
  className,
  children,
  showIcon = false,
  asButton = false,
  ...rest
}: ResumeDownloadLinkProps) {
  const { settings } = usePortfolioSettingsContext();
  const url = getResumeDownloadUrl(settings.resume);

  if (!url) {
    if (asButton) {
      return (
        <button
          type="button"
          disabled
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl font-medium opacity-60 cursor-not-allowed',
            className
          )}
          title="Resume PDF not uploaded yet"
        >
          {showIcon && <Download size={16} />}
          {children || 'Download PDF'}
        </button>
      );
    }
    return null;
  }

  return (
    <a
      href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-testid="resume-download-link"
      {...rest}
    >
      {showIcon && <Download size={16} />}
      {children}
    </a>
  );
}
