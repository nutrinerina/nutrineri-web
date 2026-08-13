import React from 'react';
import { createClient } from '@/utils/supabase/server';
import TurnosClient from '@/components/TurnosClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Solicitar Turno | Nerina Bruno',
  description: 'Reserva tu turno de manera online para tu consulta nutricional.',
};

export const revalidate = 0; // Disable static caching so slots are always fresh

export default async function TurnosPublicPage() {
  const supabase = await createClient();
  
  // Fetch available upcoming appointments
  const today = new Date().toISOString().split('T')[0];
  
  const { data: availableSlots, error } = await supabase
    .from('appointments')
    .select('id, date, time, duration')
    .eq('status', 'available')
    .gte('date', today)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.error("Error fetching available appointments:", error);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Solicitar Turno</h1>
          <p>Elegí el día y horario que mejor se adapte a vos para nuestra consulta. Podrás optar por modalidad online o presencial al completar tus datos.</p>
        </header>

        <TurnosClient availableSlots={availableSlots || []} />
      </div>
    </div>
  );
}
