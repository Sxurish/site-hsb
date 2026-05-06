import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2 className="text-gradient">HSB</h2>
          <p className={styles.tagline}>CREATE • CONNECT • GROW</p>
        </div>
        
        <div className={styles.links}>
          <h3>Navegação</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/sobre">Sobre a Agência</Link></li>
            <li><Link href="/portfolio">Portfólio</Link></li>
          </ul>
        </div>
        
        <div className={styles.contact}>
          <h3>Contato</h3>
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
