import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import PatientsListClient from './PatientsListClient';
import styles from './page.module.css';

export default async function PacientesPage() {
  const supabase = await createClient();
  
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*, clinical_histories(consultation_date)')
    .order('last_name', { ascending: true });

  if (error) {
    console.error("Error fetching patients:", error);
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Pacientes</h1>
          <p className={styles.subtitle}>Gestioná los perfiles y el historial de tus consultas.</p>
        </div>
        <Link href="/dashboard/pacientes/nuevo" className={styles.newBtn}>
          + Nuevo Paciente
        </Link>
      </header>

      <PatientsListClient initialPatients={patients || []} />
    </div>
  );
}
