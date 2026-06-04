'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase, type GuestbookEntry } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Github, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

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
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (data) setEntries(data);
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/guestbook`,
      },
    });
    if (error) toast.error('Failed to sign in');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/guestbook`,
      },
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
      toast.success('Message posted successfully!');
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
    <div className="min-h-screen py-24">
      <div className="container-max max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Leave a Message
          </h1>
          <p className="text-xl text-muted-foreground">
            I'd love to hear from you!
          </p>
        </motion.div>

        {/* Sign in / Message form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          {!user ? (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Sign in to leave a message
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={signInWithGithub}
                  className="flex-1 min-w-[200px] bg-foreground text-background hover:bg-foreground/90"
                >
                  <Github size={18} className="mr-2" />
                  Continue with GitHub
                </Button>
                <Button
                  onClick={signInWithGoogle}
                  className="flex-1 min-w-[200px]"
                >
                  <Mail size={18} className="mr-2" />
                  Continue with Google
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <button
                      onClick={signOut}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="mb-4 bg-muted border-border resize-none"
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Posting...' : 'Leave a Message'}
                </Button>
              </form>
            </div>
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Recent Messages
          </h2>
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No messages yet. Be the first to sign!</p>
              </div>
            ) : (
              entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{entry.name[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{entry.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{entry.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
