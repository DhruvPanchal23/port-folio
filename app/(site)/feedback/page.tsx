'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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
import { Send, Lightbulb, Bug, Heart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast.success('Feedback submitted! Thank you for helping improve this website.');
      setFormData({ name: '', email: '', category: 'general', message: '' });
      setIsSubmitting(false);
    }, 1500);
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
            Refining the experience
          </h1>
          <p className="text-xl text-muted-foreground">
            Your feedback matters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Why Your Feedback Matters
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every piece of feedback helps me create a better experience. Whether it's a bug you found, 
                a feature suggestion, or just your thoughts on the design – I value your input.
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Other Contact Options
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Prefer email? You can also reach me directly at:
              </p>
              <a
                href="mailto:dhruvpanchal.dev@gmail.com"
                className="text-sm font-medium text-primary hover:underline"
              >
                dhruvpanchal.dev@gmail.com
              </a>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Thank You!
              </h3>
              <p className="text-xs text-muted-foreground">
                For taking the time to help improve this website
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Send Feedback
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name (Optional)
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="appreciation">Appreciation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Your Feedback *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Share your thoughts, suggestions, or report any issues..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={8}
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
                      Send Feedback
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your feedback helps make this website better for everyone
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
