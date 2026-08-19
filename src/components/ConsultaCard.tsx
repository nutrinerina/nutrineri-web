'use client'

import React, { useTransition } from 'react';
import styles from './ConsultaCard.module.css';
import { toggleConsultaRead } from '@/app/dashboard/consultas/actions';

export default function ConsultaCard({ consulta }: { consulta: any }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleRead = () => {
    startTransition(() => {
      toggleConsultaRead(consulta.id, consulta.read);
    });
  };

  return (
    <div className={`${styles.consultaCard} ${!consulta.read ? styles.unread : ''}`}>
      <div className={styles.consultaHeader}>
        <div className={styles.consultaInfo}>
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{consulta.name}</h3>
            {!consulta.read && <span className={styles.newBadge}>Nuevo</span>}
          </div>
          <div className={styles.contactInfo}>
            <a href={`mailto:${consulta.email}`} className={styles.email}>
              {consulta.email}
            </a>
            {consulta.phone && (
              <span className={styles.phone}>📱 {consulta.phone}</span>
            )}
          </div>
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
        <button 
          onClick={handleToggleRead} 
          disabled={isPending}
          className={`${styles.readBtn} ${consulta.read ? styles.markUnread : styles.markRead}`}
        >
          {isPending ? 'Actualizando...' : (consulta.read ? 'Marcar como No Leído' : 'Marcar como Leído')}
        </button>
      </div>
    </div>
  );
}
