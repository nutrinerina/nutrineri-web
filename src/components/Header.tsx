"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from './Button';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/agenda-en-vivo')) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} onClick={() => setIsMenuOpen(false)}>
          <Image 
            src="/01_isotipo_NB.png" 
            alt="Nerina Bruno Nutricionista Logo" 
            width={48} 
            height={48} 
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li><Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
            <li><Link href="/sobre-mi" className={`${styles.navLink} ${pathname === '/sobre-mi' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Sobre mí</Link></li>
            <li><Link href="/servicios" className={`${styles.navLink} ${pathname === '/servicios' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Servicios</Link></li>
            <li><Link href="/alimentos" className={`${styles.navLink} ${pathname === '/alimentos' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Alimentos</Link></li>
            <li><Link href="/recetas" className={`${styles.navLink} ${pathname === '/recetas' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Recetas</Link></li>
            <li><Link href="/tips" className={`${styles.navLink} ${pathname === '/tips' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Tips</Link></li>
            <li><Link href="/contacto" className={`${styles.navLink} ${pathname === '/contacto' ? styles.navLinkActive : ''}`} onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
            {/* Mobile specific links */}
            <li className={styles.mobileOnly}><Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Iniciar sesión</Link></li>
            <li className={styles.mobileOnly}><Link href="/turnos" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Turnos</Link></li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button href="/login" variant="outline" size="sm">Iniciar sesión</Button>
          <Button href="/turnos" variant="primary" size="sm">Turnos</Button>
        </div>

        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ''}`}></span>
        </button>
      </div>
    </header>
  );
}
