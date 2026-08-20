"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
  }
  return new Date(dateString).toLocaleDateString();
};

export default function PatientsListClient({ initialPatients }: { initialPatients: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = initialPatients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || 
           (patient.email && patient.email.toLowerCase().includes(search)) ||
           (patient.phone && patient.phone.toLowerCase().includes(search));
  });

  return (
    <>
      <div className={styles.searchWrapper}>
        <input 
          type="text" 
          placeholder="Buscar paciente por nombre, email o teléfono..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>

      <div className={styles.tableContainer}>
        {filteredPatients.length > 0 ? (
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
              {filteredPatients.map(patient => {
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
            {searchTerm ? (
              <p>No se encontraron pacientes con la búsqueda "{searchTerm}".</p>
            ) : (
              <>
                <p>Todavía no tenés pacientes registrados.</p>
                <Link href="/dashboard/pacientes/nuevo" className={styles.newBtn}>
                  Registrar el primer paciente
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
