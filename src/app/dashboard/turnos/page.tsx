import React from 'react';
import Link from 'next/link';
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
        <h1 style={{ margin: 0 }}>Gestión de Turnos</h1>
        <Link href="https://nutrineri-web.vercel.app/agenda-en-vivo" target="_blank" rel="noopener noreferrer" className={styles.publicLink}>
          Ver Agenda Pública ↗
        </Link>
      </header>

      <TurnosManagerClient initialSlots={slots || []} />
    </div>
  );
}
