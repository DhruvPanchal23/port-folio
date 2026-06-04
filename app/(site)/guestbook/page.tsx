'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase, type GuestbookEntry } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Mail, Quote, Sparkles, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const AVATAR_TINTS = [
  'from-cyan-500/40 to-blue-600/30',
  'from-violet-500/40 to-fuchsia-600/30',
  'from-emerald-500/40 to-teal-600/30',
  'from-amber-500/40 to-orange-600/30',
  'from-rose-500/40 to-pink-600/30',
  'from-indigo-500/40 to-blue-600/30',
];
function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEntries();
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadEntries = async () => {
    const { data } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (data) setEntries(data);
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/guestbook` },
    });
    if (error) toast.error('Failed to sign in');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/guestbook` },
    });
    if (error) toast.error('Failed to sign in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a message');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from('guestbook_entries').insert([
      {
        user_id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
        email: user.email || '',
        message: message.trim(),
        avatar_url: user.user_metadata?.avatar_url || '',
      },
    ]);

    setIsLoading(false);
    if (error) {
      toast.error('Failed to post message');
    } else {
      toast.success('Posted! Once approved it will appear on the wall.');
      setMessage('');
      loadEntries();
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Signed out');
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-max max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-primary">
              Guestbook · {entries.length} signed
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-5">
            Sign the <span className="text-gradient">wall.</span>
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-xl leading-relaxed">
            A little gallery of folks who&apos;ve stopped by. Leave a note — it sticks around for
            the next visitor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8">
          {/* LEFT — sign panel (sticky) */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24 self-start"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 md:p-8">
              {/* Accent corner */}
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
              <Quote
                size={48}
                className="absolute -top-2 right-4 text-primary/15"
                strokeWidth={1}
              />

              {!user ? (
                <div className="relative">
                  <Sparkles size={18} className="mb-3 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    First time here?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Sign in with your favorite identity provider — I don&apos;t store passwords or
                    spammy data. Just your handle and avatar.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={signInWithGithub}
                      data-testid="guestbook-signin-github"
                      className="w-full justify-start gap-3 rounded-xl bg-foreground text-background hover:bg-foreground/90 h-11"
                    >
                      <Github size={16} />
                      Continue with GitHub
                    </Button>
                    <Button
                      onClick={signInWithGoogle}
                      data-testid="guestbook-signin-google"
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-xl border-border bg-background/40 hover:bg-muted/40 h-11"
                    >
                      <Mail size={16} />
                      Continue with Google
                    </Button>
                  </div>
                  <p className="mt-5 text-[11px] font-mono-custom text-muted-foreground/60">
                    Messages are reviewed before they appear.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                        {user.user_metadata?.avatar_url && (
                          <AvatarImage src={user.user_metadata.avatar_url} alt="" />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {(user.user_metadata?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.user_metadata?.name || user.email}
                        </p>
                        <p className="text-[11px] font-mono-custom text-muted-foreground/70">
                          signed in
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-[11px] font-mono-custom text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="guestbook-signout"
                    >
                      <LogOut size={11} /> sign out
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <label className="mb-2 block font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground">
                      Your message
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Drop a hello, a hot take, or a song rec…"
                      rows={5}
                      maxLength={500}
                      data-testid="guestbook-message-input"
                      className="mb-2 bg-background/40 border-border resize-none rounded-xl"
                    />
                    <div className="mb-4 flex items-center justify-between text-[11px] font-mono-custom text-muted-foreground/70">
                      <span>Markdown not supported</span>
                      <span>{message.length}/500</span>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !message.trim()}
                      data-testid="guestbook-submit"
                      className="w-full rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      {isLoading ? 'Posting…' : 'Sign the wall →'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </motion.aside>

          {/* RIGHT — Wall of messages */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">The Wall</h2>
              <span className="font-mono-custom text-[10px] uppercase tracking-wider text-muted-foreground">
                {entries.length} signature{entries.length === 1 ? '' : 's'}
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-border p-12 text-center">
                <Sparkles size={28} className="mx-auto mb-3 text-primary/60" />
                <p className="font-display text-lg font-bold text-foreground">
                  Empty wall, fresh paint.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first one to leave a mark.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -3 }}
                    data-testid={`guestbook-entry-${entry.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-5 md:p-6 transition-colors hover:border-primary/30"
                  >
                    {/* Subtle hover accent */}
                    <span className="absolute left-0 top-6 bottom-6 w-0.5 rounded-r-full bg-gradient-to-b from-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-start gap-4">
                      <Avatar className={`h-11 w-11 ring-1 ring-border bg-gradient-to-br ${tintFor(entry.name)}`}>
                        {(entry as any).avatar_url && (
                          <AvatarImage src={(entry as any).avatar_url} alt="" />
                        )}
                        <AvatarFallback className="bg-transparent text-foreground font-display font-bold">
                          {entry.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <h3 className="font-display text-base font-bold text-foreground leading-tight">
                            {entry.name}
                          </h3>
                          <span className="font-mono-custom text-[11px] text-muted-foreground/70">
                            · {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
