import ScrollVideoPlayer from '@/components/ScrollVideoPlayer/ScrollVideoPlayer';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="text-gradient">CREATE • CONNECT • GROW</h1>
          <p>Transformamos ideias em resultados exponenciais usando estratégias de ponta, automação inteligente e design premium.</p>
          <a href="#services" className={styles.primaryBtn}>Conheça nossas soluções</a>
        </div>
      </section>

      {/* Scroll Storytelling Section */}
      <section className={styles.storytelling}>
        <ScrollVideoPlayer />
      </section>

      {/* Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <h2>Nossos Serviços</h2>
          <div className={styles.grid}>
            {[
              { title: 'Automação & IA', desc: 'Workflows inteligentes com n8n e assistentes de IA para escalar seu atendimento.' },
              { title: 'Design de Alta Conversão', desc: 'Landing pages e interfaces premium focadas em maximizar resultados.' },
              { title: 'Tráfego Pago', desc: 'Gestão de anúncios estratégica no Google Ads e Meta Ads.' }
            ].map((service, i) => (
              <div key={i} className={`${styles.serviceCard} glass-panel`}>
                <h3 className="text-gradient">{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers / Results */}
      <section className={styles.numbers}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {[
              { num: '+150', label: 'Projetos Entregues' },
              { num: 'R$ 5M+', label: 'Gerados em Vendas' },
              { num: '98%', label: 'Clientes Satisfeitos' }
            ].map((stat, i) => (
              <div key={i} className={styles.statBox}>
                <h2 className="text-gradient">{stat.num}</h2>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`${styles.ctaBox} glass-panel`}>
          <h2>Pronto para escalar seu negócio?</h2>
          <p>Fale com nossos especialistas e descubra o que a HSB Company pode fazer por você.</p>
          <a href="#contato" className={styles.primaryBtn}>Falar com Especialista</a>
        </div>
      </section>
    </main>
  );
}
