'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MapPin } from 'lucide-react';
import { usePortfolioSettingsContext } from '@/components/providers/PortfolioSettingsProvider';
import ResumeDownloadLink from '@/components/ResumeDownloadLink';
import { getMailtoUrl } from '@/lib/portfolio-settings';

export default function ResumePage() {
  const { settings } = usePortfolioSettingsContext();
  const { profile, social, site } = settings;

  return (
    <div className="min-h-screen py-24">
      <div className="container-max max-w-5xl">
        {/* Header with Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-2">Resume</h1>
            <p className="text-base md:text-lg text-muted-foreground">A snapshot of what I&apos;ve built, broken & shipped.</p>
          </div>
          <ResumeDownloadLink
            asButton
            showIcon
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            Download PDF
          </ResumeDownloadLink>
        </motion.div>

        <div className="space-y-12">
          {/* Contact Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{profile.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {site.current_location}
              </span>
              {social.email && (
                <a href={getMailtoUrl(social.email)} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Mail size={14} />
                  {social.email}
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Github size={14} />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>

          {/* Technical Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Technical Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3">Frontend</h4>
                <p className="text-muted-foreground text-sm">
                  React | Next.js | TypeScript | Tailwind CSS | HTML5 | CSS3 | JavaScript
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3">Backend</h4>
                <p className="text-muted-foreground text-sm">
                  Node.js | Express.js | MongoDB | MySQL | REST APIs | GraphQL
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3">Tools</h4>
                <p className="text-muted-foreground text-sm">
                  Git | GitHub | Figma | Adobe Creative Suite | VS Code | Docker
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3">Other</h4>
                <p className="text-muted-foreground text-sm">
                  Graphics Design | Responsive Design | Cybersecurity | Network Security | Python
                </p>
              </div>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Experience</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">Freelance Full Stack Developer</h4>
                    <p className="text-sm text-muted-foreground">Self-Employed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Jan 2023 - Present</p>
                    <p className="text-xs text-muted-foreground">Remote</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Developed 10+ responsive web applications using React and Node.js</li>
                  <li>Collaborated with clients to deliver custom solutions on time and within budget</li>
                  <li>Implemented modern UI/UX practices resulting in 40% improved user engagement</li>
                  <li>Maintained 100% client satisfaction rate through effective communication</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">UI/UX Design Intern</h4>
                    <p className="text-sm text-muted-foreground">TechCorp Solutions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Jun 2023 - Aug 2023</p>
                    <p className="text-xs text-muted-foreground">Surat, India</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Designed user interfaces for 3 mobile applications using Figma</li>
                  <li>Conducted user research and usability testing with 50+ participants</li>
                  <li>Created design systems and component libraries for consistent branding</li>
                  <li>Collaborated with development team to ensure pixel-perfect implementation</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Education</h3>
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">Bachelor of Technology in Computer Science</h4>
                  <p className="text-sm text-muted-foreground">Sardar Vallabhbhai National Institute of Technology</p>
                  <p className="text-sm text-primary">GPA: 8.5/10</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">2022 - 2026</p>
                  <p className="text-xs text-muted-foreground">Surat, India</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Data Structures & Algorithms | Database Management | Software Engineering | Computer Networks
              </p>
            </div>
          </motion.div>

          {/* Key Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Key Projects</h3>
            <div className="space-y-6">
              {[
                {
                  title: 'Personal Portfolio Website',
                  description: 'Modern dark glassmorphism portfolio with smooth animations and responsive design',
                  tech: 'React | TypeScript | Tailwind CSS',
                },
                {
                  title: 'Hospital Management System',
                  description: 'Complete hospital management solution with patient records and appointment scheduling',
                  tech: 'HTML | JavaScript | MySQL | PHP',
                },
                {
                  title: 'ARP Spoofing Detector',
                  description: 'Network security tool to detect and prevent ARP spoofing attacks in real-time',
                  tech: 'Python | Scapy | Tkinter',
                },
              ].map((project, i) => (
                <div key={i} className="border-l-2 border-primary pl-4">
                  <h4 className="font-semibold text-foreground mb-1">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <p className="text-xs text-primary">{project.tech}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Achievements</h3>
            <ul className="space-y-2">
              {[
                '100% client satisfaction rate in freelance projects',
                'Led team of 4 developers in college hackathon',
                'Contributed to 5+ open source projects on GitHub',
                "Speaker at college tech symposium on 'Web Security'",
              ].map((achievement, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
