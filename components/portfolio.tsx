'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const projects = [
  {
    title: 'Fintech Launch Campaign',
    type: 'Landing Page + Paid Media',
    result: '+420% leads in 90 days',
    bg: '#100818',
    accent: '#a78bfa',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Fashion Brand Film',
    type: 'Video Production',
    result: '6.8× ROAS on Meta',
    bg: '#0c1a0e',
    accent: '#4ade80',
    span: '',
  },
  {
    title: 'Food Franchise Growth',
    type: 'SEO + Local Domination',
    result: '#1 local SEO ranking',
    bg: '#160f00',
    accent: '#fb923c',
    span: '',
  },
  {
    title: 'Automotive Social Ads',
    type: 'Photography + Reels',
    result: '3.2× engagement rate',
    bg: '#080e1a',
    accent: '#60a5fa',
    span: 'md:col-span-2',
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-14"
        >
          <p className="section-kicker mb-4">Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-2xl">
            Campaigns engineered to stop scrolls and start conversations.
          </h2>
        </motion.div>

        <div className="grid auto-rows-[200px] gap-3 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: index * 0.07, ease }}
              className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer ${project.span}`}
              style={{ background: project.bg }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 65% 50%, ${project.accent}12, transparent 65%)`,
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <p
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: `${project.accent}88` }}
                  >
                    {project.type}
                  </p>
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full p-1.5 translate-y-1 group-hover:translate-y-0"
                    style={{ border: `1px solid ${project.accent}35`, color: project.accent }}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-2">{project.result}</p>
                  <h3 className="text-2xl font-black leading-tight text-white">{project.title}</h3>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
