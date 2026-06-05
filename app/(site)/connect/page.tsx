'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, MapPin, Clock, Shield, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { submitContactForm } from '@/lib/submissions';

export default function ConnectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await submitContactForm(formData);

    if (error) {
      toast.error('Could not send message', { description: error });
      setIsSubmitting(false);
      return;
    }

    toast.success('Message sent successfully!', {
      description: "I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Good Wi-Fi, Great Vibes
          </h1>
          <p className="text-2xl text-gradient font-display font-semibold mb-2">
            Ping Me!
          </p>
          <p className="text-sm text-muted-foreground">
            Recommended by Professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Availability</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">Open to Work – Global (except Antarctica 😄)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={14} />
                  Surat, India
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={14} />
                  dhruvpanchal.dev@gmail.com
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Response Time</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <span className="text-sm">Typically within 24 hours</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Privacy</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield size={16} />
                <span className="text-sm">Spam's not my thing. Privacy? Always.</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground italic">
                "You know the business – I know the chemistry."
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Let's Connect
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-muted border-border"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-muted border-border"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="bg-muted border-border"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="What's on your mind?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-muted border-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Let's Connect
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Thank you for helping improve this website
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
