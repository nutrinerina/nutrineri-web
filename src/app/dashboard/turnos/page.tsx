import React from 'react';
import { createClient } from '@/utils/supabase/server';
import TurnosManagerClient from '@/components/TurnosManagerClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Gestión de Turnos | Panel de Administración',
};

export default async function TurnosPage() {
  const supabase = await createClient();
  
  // Fetch upcoming appointments and slots
  // We get from today onwards
  const today = new Date().toISOString().split('T')[0];
  
  const { data: slots, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Gestión de Turnos</h1>
        <p>Administra tu agenda, abre nuevos horarios y revisa tus próximas consultas.</p>
      </header>

      <TurnosManagerClient initialSlots={slots || []} />
    </div>
  );
}
