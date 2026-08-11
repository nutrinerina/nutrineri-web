import React from 'react';
import styles from './page.module.css';
import TipCard from '@/components/TipCard';
import { TIPS } from '@/lib/mockData';

export const metadata = {
  title: "Tips de Nutrición | Nerina Bruno",
  description: "Artículos y recursos sobre hábitos saludables, organización y nutrición.",
};

export default function Tips() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>Blog & Recursos</span>
          <h1 className={styles.title}>Tips de Nutrición</h1>
          <p className={styles.subtitle}>
            Información basada en ciencia, bajada a la realidad. 
            Estrategias simples para transformar tu día a día sin extremismos.
          </p>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.grid}>
          {TIPS.map(tip => (
            <TipCard 
              key={tip.id}
              id={tip.id}
              title={tip.title}
              summary={tip.summary}
              imageUrl={tip.imageUrl}
              category={tip.category}
              date={tip.date}
            />
          ))}
        </div>
      </section>

      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>¿Querés recibir recursos gratuitos?</h2>
          <p>Dejame tu mail y te envío mi guía de organización semanal para empezar a comer mejor hoy mismo.</p>
          <form className={styles.form}>
            <input type="email" placeholder="Tu correo electrónico" className={styles.input} />
            <button type="button" className={styles.button}>Suscribirme</button>
          </form>
        </div>
      </section>
    </div>
  );
}
