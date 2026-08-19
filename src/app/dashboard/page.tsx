import React from 'react';
import { createClient } from '@/utils/supabase/server';
import DashboardCharts from '@/components/DashboardCharts';
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

  // --- ANALYTICS CALCULATIONS ---

  // 1. Monthly Patients (Last 6 months)
  const { data: allPatients } = await supabase.from('patients').select('created_at');
  
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const last6Months = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { 
      month: `${months[d.getMonth()]} '${d.getFullYear().toString().substring(2)}`, 
      count: 0,
      year: d.getFullYear(),
      monthNum: d.getMonth()
    };
  });

  if (allPatients) {
    allPatients.forEach(p => {
      const d = new Date(p.created_at);
      const targetMonth = last6Months.find(m => m.year === d.getFullYear() && m.monthNum === d.getMonth());
      if (targetMonth) {
        targetMonth.count++;
      }
    });
  }

  // 2. Modality Ratio
  const { data: allAppointments } = await supabase.from('appointments').select('modality');
  
  let onlineCount = 0;
  let presencialCount = 0;

  if (allAppointments) {
    allAppointments.forEach(a => {
      if (a.modality === 'online') onlineCount++;
      else if (a.modality === 'presencial') presencialCount++;
    });
  }

  const modalityData = [
    { name: 'Online', value: onlineCount },
    { name: 'Presencial', value: presencialCount }
  ].filter(d => d.value > 0);

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

      <h2 className={styles.sectionTitle} style={{marginTop: '2rem'}}>Métricas del Consultorio</h2>
      <DashboardCharts monthlyPatients={last6Months} modalityData={modalityData} />

      <h2 className={styles.sectionTitle} style={{marginTop: '2rem'}}>Últimos Pacientes</h2>
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
