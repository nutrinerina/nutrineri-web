import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function TipDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: tip } = await supabase
    .from('tips')
    .select('*')
    .eq('id', id)
    .single();

  if (!tip) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div 
        className={styles.hero} 
        style={{ backgroundImage: `url(${tip.image_url})` }}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <Link href="/tips" className={styles.backBtn}>&larr; Volver a Tips</Link>
            <span className={styles.category}>{tip.category}</span>
            <h1 className={styles.title}>{tip.title}</h1>
            <div className={styles.meta}>
              <span className={styles.date}>{tip.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <article className={styles.article}>
          <p className={styles.lead}>{tip.summary}</p>
          
          <div className={styles.content}>
            {tip.content ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{tip.content}</div>
            ) : (
              <>
                <p>
                  El contenido completo de este artículo está en redacción. 
                  Pronto podrás leer todo el detalle sobre <strong>{tip.title}</strong> y descubrir 
                  los mejores consejos de la Lic. Nerina Bruno para aplicar en tu día a día.
                </p>
                <p>
                  Mientras tanto, recordá que los pequeños cambios sostenibles en el tiempo son los 
                  que marcan la verdadera diferencia en tu salud.
                </p>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
