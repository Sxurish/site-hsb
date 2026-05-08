'use client';
import { motion } from 'framer-motion';
import { Zap, Palette, TrendingUp, ArrowRight, ChevronDown } from 'lucide-react';
import styles from './page.module.css';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.13 } },
};

const services = [
  {
    icon: Zap,
    title: 'Automação & IA',
    desc: 'Workflows inteligentes com n8n e assistentes de IA para escalar seu atendimento sem aumentar o time.',
    color: '#4361EE',
  },
  {
    icon: Palette,
    title: 'Design de Alta Conversão',
    desc: 'Landing pages e interfaces premium construídas para transformar visitantes em clientes.',
    color: '#7B2FBE',
  },
  {
    icon: TrendingUp,
    title: 'Tráfego Pago',
    desc: 'Gestão estratégica de anúncios no Google Ads e Meta Ads com foco em ROAS máximo.',
    color: '#E8116A',
  },
];

const stats = [
  { num: '+150', label: 'Projetos Entregues' },
  { num: 'R$ 5M+', label: 'Gerados em Vendas' },
  { num: '98%',   label: 'Clientes Satisfeitos' },
];

export default function Home() {
  return (
    <main className={styles.main}>

      {/* ── Ambient background orbs ── */}
      <div className={styles.bgOrbs} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.span
            className={styles.badge}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Agência Premium de Marketing Digital
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gradient">CREATE</span>
            <span className={styles.sep}> • </span>
            <span className="text-gradient">CONNECT</span>
            <span className={styles.sep}> • </span>
            <span className="text-gradient">GROW</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Transformamos ideias em resultados exponenciais usando estratégias
            de ponta, automação inteligente e design premium.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#services" className={styles.primaryBtn}>
              Conheça nossas soluções <ArrowRight size={17} />
            </a>
            <a href="/portfolio" className={styles.secondaryBtn}>
              Ver Portfólio
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ── Services ── */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.sectionTag}>O QUE FAZEMOS</span>
            <h2>Nossos <span className="text-gradient">Serviços</span></h2>
          </motion.div>

          <div className={styles.grid}>
            {services.map((svc, i) => (
              <motion.div
                key={i}
                className={`${styles.serviceCard} glass-panel`}
                style={{ '--card-accent': svc.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className={styles.cardIcon}
                  style={{ background: `${svc.color}1A`, color: svc.color }}
                >
                  <svc.icon size={22} strokeWidth={2} />
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <span className={styles.cardArrow}>
                  <ArrowRight size={15} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.numbers}>
        <div className={styles.container}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className={styles.statBox}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-gradient">{s.num}</h2>
              <p>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaBox}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.ctaGlow} aria-hidden="true" />
          <span className={styles.sectionTag}>PRÓXIMO PASSO</span>
          <h2>Pronto para <span className="text-gradient">escalar</span> seu negócio?</h2>
          <p>Fale com nossos especialistas e descubra o que a HSB Company pode fazer por você.</p>
          <a href="#contato" className={styles.primaryBtn}>
            Falar com Especialista <ArrowRight size={17} />
          </a>
        </motion.div>
      </section>

    </main>
  );
}
