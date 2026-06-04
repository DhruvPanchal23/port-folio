'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Shravan Goswami',
    role: 'Research Associate',
    company: 'Cambridge University',
    location: 'Cambridge, UK',
    content: 'Dhruv is a skilled developer with a strong foundation in both frontend and backend technologies. His ability to handle pressure and deliver quality work under tight deadlines is impressive. He brings creativity and technical expertise to every project.',
    skills: ['Full Stack Development', 'Problem Solving', 'Team Collaboration'],
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Senior UI/UX Designer',
    company: 'TechCorp India',
    location: 'Mumbai, India',
    content: 'Working with Dhruv on our design system was a pleasure. He has an eye for detail and understands the balance between aesthetics and functionality. His designs are not just beautiful but also highly user-centric.',
    skills: ['UI/UX Design', 'Design Systems', 'User Research'],
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    company: 'StartupXYZ',
    location: 'San Francisco, USA',
    content: 'Dhruv delivered our MVP ahead of schedule with clean, maintainable code. His communication skills are excellent, and he proactively suggests improvements. Highly recommend for any web development project.',
    skills: ['React', 'Node.js', 'Architecture'],
    rating: 5,
  },
  {
    name: 'Dr. Rajesh Patel',
    role: 'Professor',
    company: 'IIT Bombay',
    location: 'Mumbai, India',
    content: 'Dhruv\'s work on cybersecurity projects shows deep understanding of network security principles. His ARP spoofing detection tool demonstrated both technical competence and practical application of security concepts.',
    skills: ['Cybersecurity', 'Network Security', 'Python'],
    rating: 5,
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Testimonials
          </h1>
          <p className="text-xl text-muted-foreground">
            What people say about working with me
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-foreground mb-1">100%</div>
            <p className="text-sm text-muted-foreground">Client Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-foreground mb-1">15+</div>
            <p className="text-sm text-muted-foreground">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-3xl font-display font-bold text-foreground">5</span>
              <Star size={24} className="text-primary fill-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12 mb-12"
        >
          <div className="flex items-center gap-1 mb-4">
            {[...Array(testimonials[0].rating)].map((_, i) => (
              <Star key={i} size={20} className="text-primary fill-primary" />
            ))}
          </div>
          <p className="text-xl md:text-2xl text-foreground mb-6 leading-relaxed italic">
            "{testimonials[0].content}"
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {testimonials[0].skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
          <div>
            <p className="font-display font-bold text-foreground">{testimonials[0].name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonials[0].role} • {testimonials[0].company}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{testimonials[0].location}</p>
          </div>
        </motion.div>

        {/* All Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.slice(1).map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} size={16} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {testimonial.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} • {testimonial.company}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center glass rounded-2xl p-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Want to work together?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join these amazing people and let's create something extraordinary
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Start a Project
            </a>
            <a
              href="/connect"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
