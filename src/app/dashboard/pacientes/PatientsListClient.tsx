"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, User, Calendar, Mail, Phone, ChevronRight, Activity } from 'lucide-react';
import styles from './page.module.css';

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
  }
  return new Date(dateString).toLocaleDateString('es-AR');
};

export default function PatientsListClient({ initialPatients }: { initialPatients: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const patientsWithLastConsultation = useMemo(() => {
    return initialPatients.map(patient => {
      let lastConsultationDate = new Date(0);
      let lastConsultationString = '-';
      
      if (patient.clinical_histories && patient.clinical_histories.length > 0) {
        const dates = patient.clinical_histories
          .map((h: any) => h.consultation_date)
          .filter(Boolean)
          .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
        
        if (dates.length > 0) {
          lastConsultationDate = new Date(dates[0]);
          lastConsultationString = formatDate(dates[0]);
        }
      }

      return {
        ...patient,
        lastConsultationDate,
        lastConsultationString
      };
    }).sort((a, b) => b.lastConsultationDate.getTime() - a.lastConsultationDate.getTime());
  }, [initialPatients]);

  const filteredPatients = patientsWithLastConsultation.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || 
           (patient.email && patient.email.toLowerCase().includes(search)) ||
           (patient.phone && patient.phone.toLowerCase().includes(search));
  });

  return (
    <>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder="Buscar paciente por nombre, email o teléfono..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.listContainer}>
        {filteredPatients.length > 0 ? (
          <div className={styles.patientListGrid}>
            {filteredPatients.map(patient => (
              <Link href={`/dashboard/pacientes/${patient.id}`} key={patient.id} className={styles.patientCard}>
                <div className={styles.patientCardHeader}>
                  <div className={styles.patientAvatar}>
                    <User size={24} />
                  </div>
                  <div className={styles.patientInfo}>
                    <h3>{patient.last_name}, {patient.first_name}</h3>
                    <div className={styles.patientContact}>
                      {patient.email && <span><Mail size={14}/> {patient.email}</span>}
                      {patient.phone && <span><Phone size={14}/> {patient.phone}</span>}
                    </div>
                  </div>
                </div>
                
                <div className={styles.patientCardBody}>
                  <div className={styles.patientMetaInfo}>
                    <span className={styles.metaLabel}>Objetivo</span>
                    <span className={styles.metaValue}><Activity size={14}/> {patient.objective || 'No especificado'}</span>
                  </div>
                  <div className={styles.patientMetaInfo}>
                    <span className={styles.metaLabel}>Última Consulta</span>
                    <span className={styles.metaValue}><Calendar size={14}/> {patient.lastConsultationString}</span>
                  </div>
                </div>
                
                <div className={styles.patientCardAction}>
                  <span>Ver Perfil</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
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
