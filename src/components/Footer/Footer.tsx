import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={`${styles.brandName} text-gradient`}>HSB</span>
          <p className={styles.tagline}>CREATE • CONNECT • GROW</p>
          <p className={styles.brandDesc}>
            Agência premium de marketing digital que transforma negócios através de
            automação inteligente, design de alta conversão e estratégias de tráfego.
          </p>
        </div>

        <div className={styles.links}>
          <h4>Navegação</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/sobre">Sobre a Agência</Link></li>
            <li><Link href="/portfolio">Portfólio</Link></li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h4>Contato</h4>
          <p>contato@hsbcompany.com</p>
          <p>WhatsApp: +55 (11) 99999-9999</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} HSB Company. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
