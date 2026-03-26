'use client';

import { motion } from 'framer-motion';
import { ImageIcon, PlayCircle } from 'lucide-react';
import { SectionShell } from './section-shell';

const projects = [
  { title: 'Fintech Launch Campaign', type: 'Landing Page + Paid Media', format: 'Video', span: 'md:col-span-2 md:row-span-2' },
  { title: 'Fashion Brand Film', type: 'Video Production', format: 'Video', span: 'md:col-span-1' },
  { title: 'Food Franchise Growth', type: 'SEO + Local Domination', format: 'Image', span: 'md:col-span-1' },
  { title: 'Automotive Social Ads', type: 'Photography + Reels', format: 'Image', span: 'md:col-span-2' }
];

export function Portfolio() {
  return (
    <SectionShell
      id="portfolio"
      kicker="Portfolio"
      title="Campaigns engineered to stop scrolls and start conversations."
      description="A snapshot of high-impact projects blending conversion architecture, visual storytelling, and performance media."
    >
      <div className="grid auto-rows-[190px] gap-4 md:grid-cols-3">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08 }}
            className={`group relative overflow-hidden rounded-3xl border border-white/15 p-6 ${project.span}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neonPurple/25 via-transparent to-brightCyan/25 opacity-80 transition group-hover:scale-110" />
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/25" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-acidGreen">{project.type}</p>
                <div className="rounded-full border border-white/30 p-2 text-white/80">
                  {project.format === 'Video' ? <PlayCircle className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black leading-tight">{project.title}</h3>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/85">View Case</div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
