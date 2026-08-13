import React from 'react';
import { createClient } from '@/utils/supabase/server';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { count: patientsCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true });

  const { count: recipesCount } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true });

  const { count: historiesCount } = await supabase
    .from('clinical_histories')
    .select('*', { count: 'exact', head: true });
  const { data: recentPatients } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Hola Nerina</h1>
        <p>Bienvenido a tu panel de gestión privada.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.statsCard}>
          <h3>Pacientes Activos</h3>
          <p className={styles.statsNumber}>{patientsCount || 0}</p>
        </div>
        
        <div className={styles.statsCard}>
          <h3>Recetas en el sistema</h3>
          <p className={styles.statsNumber}>{recipesCount || 0}</p>
        </div>
        
        <div className={styles.statsCard}>
          <h3>Total Consultas (H. Clínicas)</h3>
          <p className={styles.statsNumber}>{historiesCount || 0}</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Últimos Pacientes</h2>
      <div className={styles.patientsList}>
        {recentPatients && recentPatients.length > 0 ? (
          recentPatients.map(patient => (
            <div key={patient.id} className={styles.patientItem}>
              <span className={styles.patientName}>{patient.first_name} {patient.last_name}</span>
              <span className={styles.patientDate}>
                {new Date(patient.created_at).toLocaleDateString('es-AR')}
              </span>
            </div>
          ))
        ) : (
          <p>No hay pacientes registrados aún.</p>
        )}
      </div>
    </div>
  );
}
