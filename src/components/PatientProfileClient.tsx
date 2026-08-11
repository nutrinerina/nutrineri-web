"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { createClinicalHistory, updatePatient } from '@/app/dashboard/pacientes/actions';
import styles from './PatientProfileClient.module.css';

export default function PatientProfileClient({ patient, initialHistories }: { patient: any, initialHistories: any[] }) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'evolucion' | 'consultas' | 'nueva'>('resumen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit Patient State
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isUpdatingPatient, setIsUpdatingPatient] = useState(false);

  const handleConsultationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await createClinicalHistory(formData, patient.id);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setActiveTab('consultas');
    }
    setIsLoading(false);
  };

  const handlePatientUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingPatient(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await updatePatient(formData, patient.id);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsEditingPatient(false);
    }
    setIsUpdatingPatient(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <Link href="/dashboard/pacientes" className={styles.backBtn}>&larr; Volver</Link>
          <h1 className={styles.name}>{patient.last_name}, {patient.first_name}</h1>
          <p className={styles.meta}>
            {patient.email} | {patient.phone} | {patient.age ? `${patient.age} años` : ''}
          </p>
        </div>
        <button 
          className={styles.newConsultationBtn}
          onClick={() => setActiveTab('nueva')}
        >
          + Nueva Consulta
        </button>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'resumen' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('resumen')}
        >
          Resumen General
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'evolucion' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('evolucion')}
        >
          Evolución
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'consultas' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('consultas')}
        >
          Historial de Consultas ({initialHistories.length})
        </button>
        {activeTab === 'nueva' && (
          <button className={`${styles.tab} ${styles.activeTab}`}>
            Registrar Consulta
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* TAB: RESUMEN */}
        {activeTab === 'resumen' && (
          <div className={styles.tabContent}>
            {!isEditingPatient ? (
              <>
                <div className={styles.editActionHeader}>
                  <button onClick={() => setIsEditingPatient(true)} className={styles.editBtn}>
                    ✏️ Editar Datos del Paciente
                  </button>
                </div>
                <div className={styles.grid2}>
                  <div className={styles.card}>
                    <h3>Objetivo Principal</h3>
                    <p>{patient.objective || 'No especificado'}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Datos Personales</h3>
                    <ul>
                      <li><strong>Ocupación:</strong> {patient.occupation || '-'}</li>
                      <li><strong>Fecha de nacimiento:</strong> {patient.birth_date || '-'}</li>
                      <li><strong>Género:</strong> {patient.gender || '-'}</li>
                    </ul>
                  </div>
                </div>
                <div className={styles.card}>
                  <h3>Historia Médica Base</h3>
                  <div className={styles.medicalGrid}>
                    <div>
                      <h4>Antecedentes</h4>
                      <p>{patient.medical_background || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Medicamentos</h4>
                      <p>{patient.medication || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Alergias / Intolerancias</h4>
                      <p>{patient.allergies_intolerances || 'Sin registro'}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.card}>
                <h3>Editar Datos del Paciente</h3>
                <form onSubmit={handlePatientUpdateSubmit} className={styles.formContainer}>
                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label>Nombre *</label>
                      <input type="text" name="first_name" defaultValue={patient.first_name} required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Apellido *</label>
                      <input type="text" name="last_name" defaultValue={patient.last_name} required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input type="email" name="email" defaultValue={patient.email} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Teléfono</label>
                      <input type="tel" name="phone" defaultValue={patient.phone} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Fecha de Nacimiento</label>
                      <input type="date" name="birth_date" defaultValue={patient.birth_date} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Género</label>
                      <select name="gender" defaultValue={patient.gender} className={styles.input}>
                        <option value="">Seleccionar...</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Ocupación</label>
                      <input type="text" name="occupation" defaultValue={patient.occupation} className={styles.input} />
                    </div>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Objetivo de la consulta</label>
                    <input type="text" name="objective" defaultValue={patient.objective} className={styles.input} />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Antecedentes Médicos</label>
                    <textarea name="medical_background" defaultValue={patient.medical_background} className={styles.textarea} rows={3}></textarea>
                  </div>
                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label>Medicamentos Actuales</label>
                      <textarea name="medication" defaultValue={patient.medication} className={styles.textarea} rows={2}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Alergias o Intolerancias</label>
                      <textarea name="allergies_intolerances" defaultValue={patient.allergies_intolerances} className={styles.textarea} rows={2}></textarea>
                    </div>
                  </div>

                  <div className={styles.footer}>
                    <button type="button" onClick={() => setIsEditingPatient(false)} className={styles.cancelBtn}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={isUpdatingPatient} className={styles.submitBtn}>
                      {isUpdatingPatient ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB: HISTORIAL DE CONSULTAS */}
        {activeTab === 'consultas' && (
          <div className={styles.tabContent}>
            {initialHistories.length === 0 ? (
              <div className={styles.emptyState}>No hay consultas registradas aún.</div>
            ) : (
              <div className={styles.historyList}>
                {initialHistories.map((h, i) => (
                  <div key={h.id} className={styles.historyCard}>
                    <div className={styles.historyHeader}>
                      <h3>Consulta {initialHistories.length - i}</h3>
                      <span className={styles.date}>{new Date(h.consultation_date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.historyMetrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Peso</span>
                        <span className={styles.metricValue}>{h.weight ? `${h.weight} kg` : '-'}</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>% Grasa</span>
                        <span className={styles.metricValue}>{h.fat_percentage ? `${h.fat_percentage}%` : '-'}</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Masa Muscular</span>
                        <span className={styles.metricValue}>{h.muscle_mass ? `${h.muscle_mass} kg` : '-'}</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>IMC</span>
                        <span className={styles.metricValue}>{h.bmi || '-'}</span>
                      </div>
                    </div>
                    {h.notes && (
                      <div className={styles.historyNotes}>
                        <strong>Notas:</strong> {h.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: EVOLUCIÓN (Placeholder for charts) */}
        {activeTab === 'evolucion' && (
          <div className={styles.tabContent}>
            <div className={styles.card}>
              <h3>Gráficos de Evolución</h3>
              <p className={styles.textMuted}>Acá se visualizarán los gráficos de peso, masa muscular y porcentaje de grasa a lo largo del tiempo. (Requiere integración con librería de gráficos como Recharts).</p>
            </div>
          </div>
        )}

        {/* TAB: NUEVA CONSULTA */}
        {activeTab === 'nueva' && (
          <form onSubmit={handleConsultationSubmit} className={styles.formContainer}>
            {error && <div className={styles.errorBanner}>{error}</div>}
            
            <div className={styles.formSections}>
              {/* Sección 1: Antropometría */}
              <div className={styles.formSection}>
                <h4>1. Antropometría</h4>
                <div className={styles.grid4}>
                  <div className={styles.formGroup}>
                    <label>Peso (kg)</label>
                    <input type="number" step="0.1" name="weight" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Altura (cm)</label>
                    <input type="number" step="1" name="height" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Masa Musc. (kg)</label>
                    <input type="number" step="0.1" name="muscle_mass" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>% Grasa</label>
                    <input type="number" step="0.1" name="fat_percentage" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Agua Corp. (%)</label>
                    <input type="number" step="0.1" name="body_water" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cintura (cm)</label>
                    <input type="number" step="0.1" name="waist_circumference" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cadera (cm)</label>
                    <input type="number" step="0.1" name="hip_circumference" className={styles.input} />
                  </div>
                </div>
              </div>

              {/* Sección 2: Hábitos y Clínica */}
              <div className={styles.formSection}>
                <h4>2. Evaluación y Hábitos</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Presión Arterial</label>
                    <input type="text" name="blood_pressure" placeholder="120/80" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Actividad Física</label>
                    <input type="text" name="physical_activity" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Horas de Sueño</label>
                    <input type="text" name="sleep_hours" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Hidratación</label>
                    <input type="text" name="hydration" className={styles.input} />
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label>Recordatorio 24h</label>
                  <textarea name="dietary_recall_24h" className={styles.textarea} rows={3}></textarea>
                </div>
              </div>

              {/* Sección 3: Seguimiento y Notas */}
              <div className={styles.formSection}>
                <h4>3. Seguimiento</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Metas a Corto Plazo</label>
                    <textarea name="short_term_goals" className={styles.textarea} rows={2}></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Adherencia al plan anterior</label>
                    <textarea name="adherence" className={styles.textarea} rows={2}></textarea>
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label>Notas Privadas / Observaciones</label>
                  <textarea name="notes" className={styles.textarea} rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button 
                type="button" 
                className={styles.cancelBtn} 
                onClick={() => setActiveTab('consultas')}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Consulta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
