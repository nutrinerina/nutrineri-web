"use client";
import React, { useState } from 'react';
import { bookAppointment } from '@/app/turnos/actions';
import styles from './TurnosClient.module.css';
import Button from './Button';

type AvailableSlot = {
  id: string;
  date: string;
  time: string;
  duration: number;
};

export default function TurnosClient({ availableSlots }: { availableSlots: AvailableSlot[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  const availableDates = Object.keys(slotsByDate).sort();

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    setIsSubmitting(true);
    setErrorMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await bookAppointment(selectedSlot.id, formData);
    
    if (result.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2>¡Reserva Exitosa!</h2>
        <p>Tu turno para el <strong>{new Date(selectedSlot!.date + 'T00:00:00').toLocaleDateString('es-AR')}</strong> a las <strong>{selectedSlot!.time.substring(0,5)} hs</strong> ha sido confirmado.</p>
        <div style={{ marginTop: '2rem' }}>
          <Button href="/" variant="primary">Volver al Inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!selectedDate && (
        <div className={styles.step}>
          <h2>Paso 1: Seleccioná un día</h2>
          {availableDates.length === 0 ? (
            <p className={styles.empty}>No hay turnos disponibles en este momento. Por favor, vuelve a intentar más tarde o contáctanos.</p>
          ) : (
            <div className={styles.datesGrid}>
              {availableDates.map(date => (
                <button 
                  key={date} 
                  className={styles.dateCard}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className={styles.dayName}>{new Date(date + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long' })}</span>
                  <span className={styles.dayNumber}>{new Date(date + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedDate && !selectedSlot && (
        <div className={styles.step}>
          <button className={styles.backBtn} onClick={() => setSelectedDate(null)}>← Volver a fechas</button>
          <h2>Paso 2: Elegí un horario</h2>
          <p className={styles.subtitle}>Horarios disponibles para el {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR')}</p>
          
          <div className={styles.slotsGrid}>
            {slotsByDate[selectedDate].map(slot => (
              <button 
                key={slot.id} 
                className={styles.timeCard}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.time.substring(0, 5)} hs
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div className={styles.step}>
          <button className={styles.backBtn} onClick={() => setSelectedSlot(null)}>← Volver a horarios</button>
          <h2>Paso 3: Completa tus datos</h2>
          <div className={styles.summaryBox}>
            Reserva para el <strong>{new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString('es-AR')}</strong> a las <strong>{selectedSlot.time.substring(0,5)} hs</strong>
          </div>

          <form onSubmit={handleBooking} className={styles.bookingForm}>
            {errorMsg && <div className={styles.error}>{errorMsg}</div>}
            
            <div className={styles.formGroup}>
              <label>Nombre Completo</label>
              <input type="text" name="client_name" required className={styles.input} />
            </div>
            
            <div className={styles.formGroup}>
              <label>Correo Electrónico</label>
              <input type="email" name="client_email" required className={styles.input} />
            </div>
            
            <div className={styles.formGroup}>
              <label>Teléfono (WhatsApp)</label>
              <input type="tel" name="client_phone" required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label>Modalidad de la Consulta</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="modality" value="online" required defaultChecked />
                  <span>Online (Videollamada)</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="modality" value="presencial" required />
                  <span>Presencial (Consultorio)</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
