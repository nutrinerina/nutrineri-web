import React from 'react';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export const metadata = {
  title: "Consultas | Panel de Control",
};

export default async function ConsultasPage() {
  const supabase = await createClient();
  
  // Obtener las consultas ordenadas por fecha de creación (más recientes primero)
  const { data: consultations, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching consultations:', error);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Consultas Recibidas</h1>
          <p className={styles.subtitle}>Mensajes enviados desde el formulario de contacto</p>
        </div>
      </header>

      <div className={styles.mainContent}>
        {!consultations || consultations.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📬</span>
            <h3>No hay consultas todavía</h3>
            <p>Las consultas que recibas por la página aparecerán aquí.</p>
          </div>
        ) : (
          <div className={styles.consultasList}>
            {consultations.map((consulta) => (
              <div key={consulta.id} className={styles.consultaCard}>
                <div className={styles.consultaHeader}>
                  <div className={styles.consultaInfo}>
                    <h3 className={styles.name}>{consulta.name}</h3>
                    <a href={`mailto:${consulta.email}`} className={styles.email}>
                      {consulta.email}
                    </a>
                  </div>
                  <div className={styles.consultaMeta}>
                    <span className={styles.date}>
                      {new Date(consulta.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className={styles.reasonBadge}>
                      {consulta.reason}
                    </span>
                  </div>
                </div>
                <div className={styles.consultaBody}>
                  <p className={styles.message}>{consulta.message}</p>
                </div>
                <div className={styles.consultaActions}>
                  <a href={`mailto:${consulta.email}?subject=Respuesta a tu consulta: ${consulta.reason}`} className={styles.replyBtn}>
                    Responder por Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
