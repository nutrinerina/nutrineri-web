"use client";
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { createSlots, deleteSlot, cancelAppointment } from '@/app/dashboard/turnos/actions';
import styles from './TurnosManagerClient.module.css';

type Slot = {
  id: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  modality: string | null;
};

export default function TurnosManagerClient({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  // Sort dates
  const sortedDates = Object.keys(slotsByDate).sort();

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const startTime = formData.get('start_time') as string;
    const endTime = formData.get('end_time') as string;
    const duration = parseInt(formData.get('duration') as string, 10);

    const result = await createSlots(date, startTime, endTime, duration);
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: `¡Se generaron ${result.count} turnos con éxito! Recarga la página para verlos.` });
      // In a real scenario we could append the slots to state, but simple reload hint is fine or router.refresh
      setTimeout(() => window.location.reload(), 2000);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este turno disponible?')) return;
    
    const result = await deleteSlot(id);
    if (result.success) {
      setSlots(slots.filter(s => s.id !== id));
    } else {
      alert(result.error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('¿Seguro que deseas cancelar esta reserva? El turno volverá a estar disponible.')) return;
    
    const result = await cancelAppointment(id);
    if (result.success) {
      setSlots(slots.map(s => s.id === id ? { ...s, status: 'available', client_name: null, client_email: null, client_phone: null, modality: null } : s));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className={styles.container}>
      {message && (
        <div className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.column}>
          <form onSubmit={handleGenerate} className={styles.formCard}>
            <h2>Abrir Agenda</h2>
            <p className={styles.subtitle}>Genera bloques de turnos automáticamente para un día.</p>
            
            <div className={styles.dateSelector}>
              <CalendarIcon size={24} color="var(--color-primary)" style={{ marginRight: '0.5rem' }} />
              <input type="date" name="date" required className={styles.input} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className={styles.timeGroup}>
              <div className={styles.formGroup}>
                <label>Hora Inicio</label>
                <input type="time" name="start_time" required className={styles.input} defaultValue="09:00" />
              </div>
              <div className={styles.formGroup}>
                <label>Hora Fin</label>
                <input type="time" name="end_time" required className={styles.input} defaultValue="13:00" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Duración de la consulta</label>
              <select name="duration" className={styles.select}>
                <option value="15">15 Minutos</option>
                <option value="30" selected>30 Minutos</option>
                <option value="45">45 Minutos</option>
                <option value="60">60 Minutos</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Generando...' : 'Generar Turnos'}
            </button>
          </form>
        </div>

        <div className={styles.column}>
          <h2>Agenda Actual</h2>
          {sortedDates.length === 0 ? (
            <p className={styles.empty}>No hay turnos creados próximamente.</p>
          ) : (
            <div className={styles.datesList}>
              {sortedDates.map(date => (
                <div key={date} className={styles.dateGroup}>
                  <h3 className={styles.dateTitle}>
                    <CalendarIcon size={24} color="var(--color-primary)" />
                    {new Date(date + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className={styles.slotsGrid}>
                    {slotsByDate[date].map(slot => (
                      <div key={slot.id} className={`${styles.slotCard} ${slot.status === 'booked' ? styles.slotBooked : styles.slotAvailable}`}>
                        <div className={styles.timeColumn}>
                          <span className={styles.slotTime}>{slot.time.substring(0, 5)}</span>
                          <span className={styles.slotDuration}>{slot.duration} min</span>
                        </div>
                        
                        <div className={styles.slotDetails}>
                          {slot.status === 'booked' ? (
                            <>
                              <h4 className={styles.clientName}>{slot.client_name}</h4>
                              <div className={styles.clientInfo}>
                                <span>{slot.client_phone}</span>
                              </div>
                              <span className={`${styles.modalityBadge} ${slot.modality === 'online' ? styles.online : ''}`}>
                                {slot.modality === 'online' ? 'Online' : 'Presencial'}
                              </span>
                              <div className={styles.actionButtons}>
                                <button onClick={() => handleCancel(slot.id)} className={styles.cancelBtn} title="Cancelar Reserva">✕ Cancelar</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className={styles.availableText}>Disponible</span>
                              <div className={styles.actionButtons}>
                                <button onClick={() => handleDelete(slot.id)} className={styles.deleteBtn} title="Eliminar Horario">Eliminar</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
