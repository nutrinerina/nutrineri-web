import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
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

      <div className={styles.tableContainer}>
        {patients && patients.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Contacto</th>
                <th>Objetivo</th>
                <th>Última Consulta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => {
                // Find the latest consultation date
                let lastConsultation = '-';
                if (patient.clinical_histories && patient.clinical_histories.length > 0) {
                  const dates = patient.clinical_histories
                    .map((h: any) => h.consultation_date)
                    .filter(Boolean)
                    .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
                  
                  if (dates.length > 0) {
                    lastConsultation = formatDate(dates[0]);
                  }
                }

                return (
                  <tr key={patient.id}>
                    <td>
                      <div className={styles.patientName}>
                        {patient.last_name}, {patient.first_name}
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        {patient.email && <span>{patient.email}</span>}
                        {patient.phone && <span>{patient.phone}</span>}
                      </div>
                    </td>
                    <td>
                      <span className={styles.objective}>{patient.objective || '-'}</span>
                    </td>
                    <td>
                      <span className={styles.date}>{lastConsultation}</span>
                    </td>
                    <td>
                      <Link href={`/dashboard/pacientes/${patient.id}`} className={styles.viewBtn}>
                        Ver Perfil
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>Todavía no tenés pacientes registrados.</p>
            <Link href="/dashboard/pacientes/nuevo" className={styles.newBtn}>
              Registrar el primer paciente
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
