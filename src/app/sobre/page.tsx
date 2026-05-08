'use client';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const pillars = [
  {
    icon: Target,
    title: 'Missão',
    text: 'Elevar o patamar digital das empresas através de estratégias inovadoras e execução impecável.',
    color: '#4361EE',
  },
  {
    icon: Eye,
    title: 'Visão',
    text: 'Ser a agência de referência global em marketing orientado a resultados e experiências premium.',
    color: '#7B2FBE',
  },
  {
    icon: Heart,
    title: 'Valores',
    text: 'Inovação constante, transparência absoluta, excelência estética e foco incansável em métricas.',
    color: '#E8116A',
  },
];

const team = [
  { name: 'CEO & Estrategista',   role: 'Visão de Negócios'  },
  { name: 'Head de Design',       role: 'UX & Conversão'     },
  { name: 'Lead de Automação',    role: 'n8n & IA'           },
  { name: 'Gestor de Tráfego',    role: 'Google & Meta Ads'  },
];

export default function Sobre() {
  return (
    <main className={styles.main}>

      {/* ── Orb ── */}
      <div className={styles.bgOrb} aria-hidden="true" />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.span className={styles.tag} {...fadeUp(0)}>
            NOSSA HISTÓRIA
          </motion.span>
          <motion.h1 {...fadeUp(0.08)}>
            Construídos para{' '}
            <span className="text-gradient">resultados</span>
          </motion.h1>
          <motion.p className={styles.subtitle} {...fadeUp(0.16)}>
            Nascemos para conectar marcas ao seu verdadeiro potencial de crescimento —
            com estratégia, tecnologia e design que convertem.
          </motion.p>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className={styles.pillars}>
        <div className={styles.container}>
          <div className={styles.pillarGrid}>
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                className={`${styles.pillarCard} glass-panel`}
                style={{ '--card-accent': p.color } as React.CSSProperties}
                {...fadeUp(i * 0.1)}
              >
                <div className={styles.pillarIcon} style={{ background: `${p.color}1A`, color: p.color }}>
                  <p.icon size={22} strokeWidth={2} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story strip ── */}
      <section className={styles.story}>
        <div className={styles.container}>
          <motion.div className={styles.storyInner} {...fadeUp()}>
            <div className={styles.storyText}>
              <span className={styles.tag}>QUEM SOMOS</span>
              <h2>Uma agência que <span className="text-gradient">pensa</span> como empresa</h2>
              <p>
                Não somos uma agência que apenas executa. Somos parceiros estratégicos que mergulham
                no negócio de cada cliente para construir soluções que fazem sentido comercialmente,
                tecnicamente e visualmente.
              </p>
              <p>
                Com um time especializado em automação, design premium e tráfego pago, unimos três
                pilares que normalmente vivem separados — e é nessa interseção que a mágica acontece.
              </p>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.storyCard}>
                <span className="text-gradient">HSB</span>
                <p>Desde 2020 acelerando negócios</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.team}>
        <div className={styles.container}>
          <motion.div className={styles.sectionHead} {...fadeUp()}>
            <span className={styles.tag}>TIME</span>
            <h2>As mentes por trás da <span className="text-gradient">HSB</span></h2>
          </motion.div>

          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <motion.div key={i} className={styles.memberCard} {...fadeUp(i * 0.08)}>
                <div className={`${styles.photoBox} glass-panel`}>
                  <div className={styles.photoInitial}>
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <motion.div className={styles.ctaBox} {...fadeUp()}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <span className={styles.tag}>PRÓXIMO PASSO</span>
          <h2>Faça parte dessa <span className="text-gradient">história</span></h2>
          <p>Junte-se às empresas que já revolucionaram seus resultados com a HSB.</p>
          <a href="#contato" className={styles.primaryBtn}>
            Começar Agora <ArrowRight size={17} />
          </a>
        </motion.div>
      </section>

    </main>
  );
}
