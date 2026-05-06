import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} glass-panel`}>
      <div className={styles.logo}>
        <Link href="/">
          <span className="text-gradient">HSB</span>
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/sobre">Sobre</Link></li>
        <li><Link href="/portfolio">Portfólio</Link></li>
      </ul>
      <div className={styles.cta}>
        <a href="#contato" className={styles.button}>Fale Conosco</a>
      </div>
    </nav>
  );
}
