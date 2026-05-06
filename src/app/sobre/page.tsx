import styles from './page.module.css';

export default function Sobre() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="text-gradient">Nossa História</h1>
          <p className={styles.subtitle}>
            Nascemos para conectar marcas ao seu verdadeiro potencial de crescimento.
          </p>
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={`${styles.card} glass-panel`}>
              <h3 className="text-gradient">Missão</h3>
              <p>Elevar o patamar digital das empresas através de estratégias inovadoras e execução impecável.</p>
            </div>
            <div className={`${styles.card} glass-panel`}>
              <h3 className="text-gradient">Visão</h3>
              <p>Ser a agência de referência global em marketing orientado a resultados e experiências premium.</p>
            </div>
            <div className={`${styles.card} glass-panel`}>
              <h3 className="text-gradient">Valores</h3>
              <p>Inovação constante, transparência absoluta, excelência estética e foco incansável em métricas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <div className={styles.container}>
          <h2>Nosso Time</h2>
          <div className={styles.teamGrid}>
            {/* Espaço para as fotos da equipe */}
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className={styles.teamMember}>
                <div className={`${styles.photoPlaceholder} glass-panel`}>
                  <span>Foto {member}</span>
                </div>
                <h3>Especialista {member}</h3>
                <p>Cargo / Função</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.ctaBox} glass-panel`}>
          <h2>Faça parte dessa história</h2>
          <p>Junte-se às empresas que já revolucionaram seus resultados com a HSB.</p>
          <a href="#contato" className={styles.primaryBtn}>Começar Agora</a>
        </div>
      </section>
    </main>
  );
}
