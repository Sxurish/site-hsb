'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const links = [
  { href: '/',          label: 'Home' },
  { href: '/sobre',     label: 'Sobre' },
  { href: '/portfolio', label: 'Portfólio' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        <Link href="/" className={styles.logo}>
          <span className="text-gradient">HSB</span>
          <span className={styles.logoWord}>Company</span>
        </Link>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
              >
                {label}
                {pathname === href && <span className={styles.activeDot} />}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.right}>
          <a href="#contato" className={styles.ctaBtn}>
            Fale Conosco
          </a>
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span /><span /><span />
          </button>
        </div>

      </div>
    </nav>
  );
}
