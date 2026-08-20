'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ConsultaCard.module.css';
import { toggleConsultaRead } from '@/app/dashboard/consultas/actions';

export default function ConsultaCard({ consulta }: { consulta: any }) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(consulta.read);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsRead(consulta.read);
  }, [consulta.read]);

  const handleToggleRead = async () => {
    setIsUpdating(true);
    const previousState = isRead;
    
    // Optimistic update
    setIsRead(!previousState);
    
    const result = await toggleConsultaRead(consulta.id, previousState);
    
    if (result?.error) {
      // Revert on error
      setIsRead(previousState);
      alert(result.error);
    } else {
      // Force Next.js to re-fetch the layout to update the unread counter
      router.refresh();
    }
    setIsUpdating(false);
  };

  return (
    <div className={`${styles.consultaCard} ${!isRead ? styles.unread : ''}`}>
      <div className={styles.consultaHeader}>
        <div className={styles.consultaInfo}>
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{consulta.name}</h3>
            {!isRead && <span className={styles.newBadge}>Nuevo</span>}
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
          disabled={isUpdating}
          className={`${styles.readBtn} ${isRead ? styles.markUnread : styles.markRead}`}
        >
          {isUpdating ? 'Actualizando...' : (isRead ? 'Marcar como No Leído' : 'Marcar como Leído')}
        </button>
      </div>
    </div>
  );
}
