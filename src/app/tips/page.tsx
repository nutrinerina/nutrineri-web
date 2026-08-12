import React from 'react';
import { createClient } from '@/utils/supabase/server';
import TipCard from '@/components/TipCard';
import styles from './page.module.css';

export const metadata = {
  title: 'Tips y Artículos | Nerina Bruno',
  description: 'Consejos, artículos y recursos gratuitos sobre nutrición y bienestar.',
};

export default async function TipsPage() {
  const supabase = await createClient();
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Tips y Artículos</h1>
          <p className={styles.subtitle}>
            Consejos prácticos, información con base científica y herramientas para aplicar en tu día a día.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {tips?.map(tip => (
              <TipCard 
                key={tip.id}
                id={tip.id}
                title={tip.title}
                summary={tip.summary}
                imageUrl={tip.image_url}
                category={tip.category}
                date={tip.date}
              />
            ))}
          </div>
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
