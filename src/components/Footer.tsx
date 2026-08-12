"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandInfo}>
            <Image 
              src="/01_isotipo_NB.png" 
              alt="Nerina Bruno Nutricionista Logo" 
              width={60} 
              height={60} 
              style={{ objectFit: 'contain' }}
            />
            <p className={styles.description}>
              Te acompaño a construir una alimentación saludable, realista y adaptada a vos.
            </p>
          </div>
          
          <div className={styles.linksGroup}>
            <h4 className={styles.title}>Navegación</h4>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.link}>Inicio</Link></li>
              <li><Link href="/sobre-mi" className={styles.link}>Sobre mí</Link></li>
              <li><Link href="/servicios" className={styles.link}>Servicios</Link></li>
            </ul>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.title}>Recursos</h4>
            <ul className={styles.linkList}>
              <li><Link href="/recetas" className={styles.link}>Recetas Saludables</Link></li>
              <li><Link href="/tips" className={styles.link}>Tips de Nutrición</Link></li>
              <li><Link href="/login" className={styles.link}>Acceso a Pacientes</Link></li>
            </ul>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.title}>Contacto</h4>
            <ul className={styles.linkList}>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a></li>
              <li><a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className={styles.link}>WhatsApp</a></li>
              <li><a href="mailto:hola@nerinabruno.com" className={styles.link}>hola@nerinabruno.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Nerina Bruno Nutricionista. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
