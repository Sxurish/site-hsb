'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import styles from './page.module.css';

const portfolioData = [
  {
    id: 'techflow',
    name: 'TechFlow',
    headline: 'Leads dobrados em 3 meses',
    services: ['Automação de Vendas', 'Landing Page', 'Tráfego Pago'],
    testimonial: 'A HSB transformou nossa captação. Dobramos nossos leads em 3 meses com as automações no n8n.',
    author: 'Carlos M. — CEO, TechFlow',
    color: '#4361EE',
  },
  {
    id: 'lumio',
    name: 'Lumio',
    headline: 'E-commerce +180% em conversão',
    services: ['Design Premium', 'E-commerce', 'SEO'],
    testimonial: 'O nível de detalhe e a performance das animações no site superou todas as expectativas.',
    author: 'Ana R. — Fundadora, Lumio',
    color: '#7B2FBE',
  },
  {
    id: 'vertix',
    name: 'Vertix',
    headline: 'Tráfego pago com ROAS 4x',
    services: ['Google Ads', 'Meta Ads', 'Analytics'],
    testimonial: 'Quadruplicamos o ROAS em 60 dias. O time da HSB é extremamente estratégico.',
    author: 'Pedro L. — CMO, Vertix',
    color: '#E8116A',
  },
];

export default function Portfolio() {
  const [active, setActive] = useState(portfolioData[0].id);
  const client = portfolioData.find(c => c.id === active)!;

  return (
    <main className={styles.main}>
      <div className={styles.bgOrb} aria-hidden="true" />

      {/* ── Header ── */}
      <section className={styles.header}>
        <div className={styles.container}>
          <motion.span
            className={styles.tag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            CASOS DE SUCESSO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Nosso <span className="text-gradient">Portfólio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            Resultados reais construídos com estratégia e design impecável.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className={styles.content}>
        <div className={styles.container}>

          {/* Tabs */}
          <div className={styles.tabs}>
            {portfolioData.map((c) => (
              <button
                key={c.id}
                className={`${styles.tabBtn} ${active === c.id ? styles.activeTab : ''}`}
                style={{ '--tab-color': c.color } as React.CSSProperties}
                onClick={() => setActive(c.id)}
              >
                {c.name}
                {active === c.id && (
                  <motion.span
                    className={styles.tabUnderline}
                    layoutId="tab-underline"
                    style={{ background: c.color }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className={`${styles.panel} glass-panel`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.panelLeft}>
                <div
                  className={styles.clientBadge}
                  style={{ background: `${client.color}18`, color: client.color, borderColor: `${client.color}30` }}
                >
                  {client.name}
                </div>
                <h2>{client.headline}</h2>

                <div className={styles.servicesList}>
                  <span className={styles.servicesLabel}>Serviços realizados</span>
                  <div className={styles.serviceTags}>
                    {client.services.map((s, i) => (
                      <span key={i} className={styles.serviceTag}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.testimonialBlock}>
                  <Quote size={24} style={{ color: client.color, marginBottom: '0.8rem' }} />
                  <p>"{client.testimonial}"</p>
                  <span className={styles.author}>{client.author}</span>
                </div>
              </div>

              <div className={styles.panelRight}>
                <div
                  className={styles.mockScreen}
                  style={{ '--screen-color': client.color } as React.CSSProperties}
                >
                  <div className={styles.screenDots}>
                    <span /><span /><span />
                  </div>
                  <div className={styles.screenContent}>
                    <div className={styles.screenLine} style={{ width: '60%', background: client.color }} />
                    <div className={styles.screenLine} style={{ width: '80%' }} />
                    <div className={styles.screenLine} style={{ width: '45%' }} />
                    <div className={styles.screenBlock} style={{ background: `${client.color}20` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaBox}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.ctaGlow} aria-hidden="true" />
          <h2>Seu projeto pode ser o <span className="text-gradient">próximo</span></h2>
          <p>Vamos conversar sobre como a HSB pode acelerar seus resultados.</p>
          <a href="#contato" className={styles.primaryBtn}>
            Falar com a equipe <ArrowRight size={17} />
          </a>
        </motion.div>
      </section>

    </main>
  );
}
