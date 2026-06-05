'use client';

import type { ReactNode } from 'react';

export function SettingsFormCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function SettingsField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SettingsInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${props.className || ''}`}
    />
  );
}

export function SettingsTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y min-h-[80px] ${props.className || ''}`}
    />
  );
}

export function SaveButton({
  onClick,
  loading,
  label = 'Save changes',
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {loading ? 'Saving…' : label}
    </button>
  );
}
