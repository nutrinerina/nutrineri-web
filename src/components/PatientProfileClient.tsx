"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClinicalHistory, updatePatient } from '@/app/dashboard/pacientes/actions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './PatientProfileClient.module.css';

export default function PatientProfileClient({ patient, initialHistories }: { patient: any, initialHistories: any[] }) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'evolucion' | 'consultas' | 'nueva'>('resumen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit Patient State
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isUpdatingPatient, setIsUpdatingPatient] = useState(false);

  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    initialHistories.length > 0 ? initialHistories[0].id : null
  );

  const [activeFormTab, setActiveFormTab] = useState(0);

  React.useEffect(() => {
    if (initialHistories.length > 0 && !selectedHistoryId) {
      setSelectedHistoryId(initialHistories[0].id);
    }
  }, [initialHistories, selectedHistoryId]);

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

  // Helper para parsear la fecha de la DB (YYYY-MM-DD) y evitar el desfase de zona horaria
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // dateString viene como "2026-08-12", lo partimos para formatearlo
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return new Date(dateString).toLocaleDateString();
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
                    <h3>Motivo de Consulta</h3>
                    <p><strong>Objetivo Principal:</strong> {patient.objective || 'No especificado'}</p>
                    <p><strong>Expectativas:</strong> {patient.expectations || 'No especificado'}</p>
                    <p><strong>Derivado por:</strong> {patient.referred_by || 'No especificado'}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Datos Personales</h3>
                    <ul>
                      <li><strong>Ocupación:</strong> {patient.occupation || '-'}</li>
                      <li><strong>Fecha de nacimiento:</strong> {formatDate(patient.birth_date)}</li>
                      <li><strong>Género:</strong> {patient.gender || '-'}</li>
                    </ul>
                  </div>
                </div>
                <div className={styles.card}>
                  <h3>Historia Médica Base</h3>
                  <div className={styles.medicalGrid}>
                    <div>
                      <h4>Enfermedades y Antecedentes</h4>
                      <p>{patient.medical_background || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Antecedentes Familiares</h4>
                      <p>{patient.family_background || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Cirugías previas</h4>
                      <p>{patient.past_surgeries || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Alergias / Intolerancias</h4>
                      <p>{patient.allergies_intolerances || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Medicamentos Actuales</h4>
                      <p>{patient.medication || 'Sin registro'}</p>
                    </div>
                    <div>
                      <h4>Suplementos</h4>
                      <p>{patient.supplements || 'Sin registro'}</p>
                    </div>
                  </div>
                  <div className={styles.formGroupFull} style={{marginTop: '1rem'}}>
                    <h4>Preferencias y rechazos alimentarios</h4>
                    <p>{patient.food_preferences || 'Sin registro'}</p>
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

                  <h4 className={styles.sectionTitle}>Motivo de Consulta</h4>
                  <div className={styles.formGroupFull}>
                    <label>Objetivo principal</label>
                    <input type="text" name="objective" defaultValue={patient.objective} className={styles.input} />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Expectativas del paciente (qué espera lograr y en cuánto tiempo)</label>
                    <textarea name="expectations" defaultValue={patient.expectations} className={styles.textarea} rows={2}></textarea>
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Derivado por (profesional / motivo)</label>
                    <input type="text" name="referred_by" defaultValue={patient.referred_by} className={styles.input} />
                  </div>

                  <h4 className={styles.sectionTitle} style={{marginTop: '1rem'}}>Antecedentes y Hábitos</h4>
                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label>Enfermedades actuales y pasadas</label>
                      <textarea name="medical_background" defaultValue={patient.medical_background} className={styles.textarea} rows={3}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Antecedentes familiares</label>
                      <textarea name="family_background" defaultValue={patient.family_background} className={styles.textarea} rows={3}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Cirugías previas</label>
                      <textarea name="past_surgeries" defaultValue={patient.past_surgeries} className={styles.textarea} rows={2}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Alergias o Intolerancias</label>
                      <textarea name="allergies_intolerances" defaultValue={patient.allergies_intolerances} className={styles.textarea} rows={2}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Medicamentos Actuales</label>
                      <textarea name="medication" defaultValue={patient.medication} className={styles.textarea} rows={2}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Suplementos</label>
                      <textarea name="supplements" defaultValue={patient.supplements} className={styles.textarea} rows={2}></textarea>
                    </div>
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Preferencias y rechazos alimentarios</label>
                    <textarea name="food_preferences" defaultValue={patient.food_preferences} className={styles.textarea} rows={2}></textarea>
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
              <div className={styles.historiesLayout}>
                <div className={styles.historiesSidebar}>
                  {initialHistories.map((h) => {
                    const titleType = h.consultation_type || 'Consulta';
                    return (
                      <button 
                        key={h.id}
                        type="button"
                        className={`${styles.historyTab} ${selectedHistoryId === h.id ? styles.historyTabActive : ''}`}
                        onClick={() => setSelectedHistoryId(h.id)}
                      >
                        <div className={styles.historyTabDate}>{formatDate(h.consultation_date)}</div>
                        <div className={styles.historyTabType}>{titleType}</div>
                      </button>
                    );
                  })}
                </div>
                
                <div className={styles.historyDetail}>
                  {(() => {
                    const h = initialHistories.find(h => h.id === selectedHistoryId) || initialHistories[0];
                    if (!h) return null;
                    const titleType = h.consultation_type || 'Consulta';
                    const titleReason = h.reason_for_consultation ? ` - ${h.reason_for_consultation}` : '';
                    const displayTitle = `${titleType}${titleReason}`;
                    
                    return (
                      <div className={styles.historyCard}>
                        <div className={styles.historyHeader}>
                          <h3>{displayTitle}</h3>
                          <span className={styles.date}>{formatDate(h.consultation_date)}</span>
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

                        <div className={styles.historyFullDetails}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailsColumn}>
                              <h4>1. Información y Antropometría</h4>
                              <p><strong>Tipo y Motivo:</strong> {h.consultation_type || '-'} - {h.reason_for_consultation || '-'}</p>
                              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginTop: '0.5rem'}}>
                                <p><strong>Peso:</strong> {h.weight ? `${h.weight} kg` : '-'}</p>
                                <p><strong>Altura:</strong> {h.height ? `${h.height} cm` : '-'}</p>
                                <p><strong>IMC:</strong> {h.bmi || '-'}</p>
                                <p><strong>Masa Musc.:</strong> {h.muscle_mass ? `${h.muscle_mass} kg` : '-'}</p>
                                <p><strong>% Grasa:</strong> {h.fat_percentage ? `${h.fat_percentage}%` : '-'}</p>
                                <p><strong>Agua Corp.:</strong> {h.body_water ? `${h.body_water}%` : '-'}</p>
                                <p><strong>Cintura:</strong> {h.waist_circumference ? `${h.waist_circumference} cm` : '-'}</p>
                                <p><strong>Cadera:</strong> {h.hip_circumference ? `${h.hip_circumference} cm` : '-'}</p>
                              </div>
                              <p style={{marginTop: '0.25rem'}}><strong>Otros perímetros:</strong> {h.other_perimeters || '-'}</p>
                            </div>
                            
                            <div className={styles.detailsColumn}>
                              <h4>2. Evaluación Alimentaria</h4>
                              <p><strong>Cambios reportados:</strong> {h.dietary_changes || '-'}</p>
                              <p><strong>Dificultades:</strong> {h.difficulties || '-'}</p>
                              <p><strong>Dónde/Quién:</strong> {h.where_eats || '-'}</p>
                              <p><strong>Horarios:</strong> {h.meal_times || '-'}</p>
                              <p><strong>Hidratación:</strong> {h.hydration || '-'}</p>
                              <p><strong>Alcohol/Tabaco/Café:</strong> {h.alcohol_tobacco || '-'}</p>
                              <p><strong>Frecuencia:</strong> {h.food_frequency || '-'}</p>
                              <p><strong>Rec. 24h:</strong> {h.dietary_recall_24h || '-'}</p>
                            </div>
                          </div>

                          <div className={styles.detailsGrid} style={{marginTop: '1.5rem'}}>
                            <div className={styles.detailsColumn}>
                              <h4>3. Estilo de Vida y Clínica</h4>
                              <p><strong>Actividad física:</strong> {h.physical_activity || '-'} ({h.exercise_frequency_duration || '-'})</p>
                              <p><strong>Nivel act. diaria:</strong> {h.daily_activity_level || '-'}</p>
                              <p><strong>Sueño:</strong> {h.sleep_hours || '-'}</p>
                              <p><strong>Estrés:</strong> {h.stress_level || '-'}</p>
                              <p><strong>Presión arterial:</strong> {h.blood_pressure || '-'}</p>
                              <p><strong>Energía:</strong> {h.energy_level || '-'}</p>
                              <p><strong>Percepción/Ánimo:</strong> {h.patient_perception || '-'} {h.mood_relationship_with_food ? `(${h.mood_relationship_with_food})` : ''}</p>
                              <p><strong>Síntomas digestivos:</strong> {h.symptoms || '-'}</p>
                            </div>
                            
                            <div className={styles.detailsColumn}>
                              <h4>4. Laboratorio</h4>
                              <p><strong>Notas de Lab:</strong> {h.lab_notes || '-'}</p>
                              {h.biochemical_indicators && h.biochemical_indicators.length > 0 ? (
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginTop: '0.5rem'}}>
                                  <p><strong>Glucosa:</strong> {h.biochemical_indicators[0].glucose || '-'}</p>
                                  <p><strong>Colesterol:</strong> {h.biochemical_indicators[0].total_cholesterol || '-'}</p>
                                  <p><strong>HDL:</strong> {h.biochemical_indicators[0].hdl_cholesterol || '-'}</p>
                                  <p><strong>LDL:</strong> {h.biochemical_indicators[0].ldl_cholesterol || '-'}</p>
                                  <p><strong>Triglicéridos:</strong> {h.biochemical_indicators[0].triglycerides || '-'}</p>
                                  <p><strong>Hierro:</strong> {h.biochemical_indicators[0].iron || '-'}</p>
                                  <p><strong>Hemoglobina:</strong> {h.biochemical_indicators[0].hemoglobin || '-'}</p>
                                  <p><strong>Ferritina:</strong> {h.biochemical_indicators[0].ferritin || '-'}</p>
                                  <p><strong>Vit D:</strong> {h.biochemical_indicators[0].vitamin_d || '-'}</p>
                                  <p><strong>Vit B12:</strong> {h.biochemical_indicators[0].vitamin_b12 || '-'}</p>
                                  <p><strong>TSH:</strong> {h.biochemical_indicators[0].tsh || '-'}</p>
                                  <p><strong>T4:</strong> {h.biochemical_indicators[0].t4 || '-'}</p>
                                </div>
                              ) : (
                                <p style={{marginTop: '0.5rem', color: 'var(--color-text-muted)'}}>Sin datos de laboratorio en esta consulta.</p>
                              )}
                            </div>
                          </div>

                          <div className={styles.detailsGrid} style={{marginTop: '1.5rem'}}>
                            <div className={styles.detailsColumn} style={{gridColumn: '1 / -1'}}>
                              <h4>5. Seguimiento y Plan de Acción</h4>
                              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                <div>
                                  <p><strong>Adherencia:</strong> {h.adherence || '-'}</p>
                                  <p><strong>Ajustes dieta:</strong> {h.dietary_adjustments || '-'}</p>
                                  <p><strong>Recomendaciones:</strong> {h.specific_recommendations || '-'}</p>
                                  <p><strong>Metas a corto plazo:</strong> {h.short_term_goals || '-'}</p>
                                </div>
                                <div>
                                  <p><strong>Próximo Control:</strong> {h.next_appointment_date ? new Date(h.next_appointment_date).toLocaleDateString() : '-'}</p>
                                  <p><strong>Material entregado:</strong> {h.delivered_material || '-'}</p>
                                  {h.diet_plan_url && (
                                    <p style={{marginTop: '0.5rem'}}>
                                      <strong>Plan:</strong> <a href={h.diet_plan_url} target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 'bold'}}>Abrir Plan de Alimentación ↗</a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {h.notes && (
                            <div className={styles.historyNotes} style={{marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fffbe5', border: '1px solid #fef08a', borderRadius: 'var(--radius-md)'}}>
                              <strong>📝 Notas internas (Privadas):</strong> {h.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: EVOLUCIÓN */}
        {activeTab === 'evolucion' && (
          <div className={styles.tabContent}>
            <div className={styles.card}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Evolución de Peso y Composición Corporal</h3>
                {initialHistories.length >= 2 && (
                  <button onClick={handleExportPDF} className={styles.exportBtn}>
                    📥 Exportar PDF
                  </button>
                )}
              </div>
              
              {initialHistories.length < 2 ? (
                <div className={styles.emptyState}>
                  <p>Se necesitan al menos 2 consultas registradas para ver la evolución gráfica.</p>
                </div>
              ) : (
                <div id="evolution-chart-container" style={{ width: '100%', height: 400, marginTop: '2rem', background: 'white', padding: '1rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[...initialHistories].reverse().map(h => ({
                        date: new Date(h.consultation_date).toLocaleDateString(),
                        weight: h.weight ? Number(h.weight) : null,
                        muscle: h.muscle_mass ? Number(h.muscle_mass) : null,
                        fat: h.fat_percentage ? Number(h.fat_percentage) : null,
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#d1d5db'}} />
                      <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#d1d5db'}} />
                      <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#d1d5db'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                        itemStyle={{fontWeight: 600}}
                      />
                      <Legend wrapperStyle={{paddingTop: '20px'}} />
                      
                      <Line yAxisId="left" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#059669" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                      <Line yAxisId="left" type="monotone" dataKey="muscle" name="Masa Muscular (kg)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                      <Line yAxisId="right" type="monotone" dataKey="fat" name="% Grasa" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: NUEVA CONSULTA */}
        {activeTab === 'nueva' && (
          <form onSubmit={handleConsultationSubmit} className={styles.formContainer}>
            {error && <div className={styles.errorBanner}>{error}</div>}
            
            <div className={styles.formTabsContainer}>
              {['Básica', 'Antropometría', 'Alimentación', 'Estilo', 'Clínica', 'Laboratorio', 'Plan'].map((tab, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.formTabBtn} ${activeFormTab === idx ? styles.formTabBtnActive : ''}`}
                  onClick={() => setActiveFormTab(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className={styles.formSections}>
              {/* Información Básica */}
              <div className={activeFormTab === 0 ? styles.formSection : styles.hiddenSection}>
                <h4>Información Básica de la Consulta</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Tipo de consulta</label>
                    <select name="consultation_type" className={styles.input}>
                      <option value="">Seleccionar...</option>
                      <option value="Primera visita">Primera visita</option>
                      <option value="Control">Control</option>
                      <option value="Seguimiento">Seguimiento</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Motivo Específico</label>
                    <input type="text" name="reason_for_consultation" className={styles.input} placeholder="Revisión de peso, ajuste de plan..." />
                  </div>
                </div>
              </div>

              {/* Sección 1: Antropometría */}
              <div className={activeFormTab === 1 ? styles.formSection : styles.hiddenSection}>
                <h4>1. Antropometría y Composición</h4>
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
                <div className={styles.formGroupFull} style={{marginTop: '1rem'}}>
                  <label>Otros perímetros (brazo, muslo, pantorrilla)</label>
                  <input type="text" name="other_perimeters" className={styles.input} />
                </div>
              </div>

              {/* Sección 2: Hábitos Alimentarios */}
              <div className={activeFormTab === 2 ? styles.formSection : styles.hiddenSection}>
                <h4>2. Evaluación Alimentaria</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Cambios en el patrón de comidas</label>
                    <textarea name="dietary_changes" className={styles.textarea} rows={2} placeholder="Más desayunos, menos picoteos..."></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Dificultades reportadas</label>
                    <textarea name="difficulties" className={styles.textarea} rows={2} placeholder="No tengo tiempo para cocinar..."></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Dónde come / Quién prepara</label>
                    <input type="text" name="where_eats" className={styles.input} placeholder="Casa, trabajo, delivery..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Horarios habituales</label>
                    <input type="text" name="meal_times" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Hidratación y cambios</label>
                    <input type="text" name="hydration" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Consumo Alcohol/Tabaco/Café</label>
                    <input type="text" name="alcohol_tobacco" className={styles.input} />
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label>Frecuencia de consumo (Frutas, verduras, carnes, etc.)</label>
                  <textarea name="food_frequency" className={styles.textarea} rows={2}></textarea>
                </div>
                <div className={styles.formGroupFull}>
                  <label>Recordatorio 24h</label>
                  <textarea name="dietary_recall_24h" className={styles.textarea} rows={3}></textarea>
                </div>
              </div>

              {/* Sección 3: Actividad Física y Estilo de Vida */}
              <div className={activeFormTab === 3 ? styles.formSection : styles.hiddenSection}>
                <h4>3. Actividad Física y Estilo de Vida</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Tipo de actividad</label>
                    <input type="text" name="physical_activity" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Frecuencia y duración</label>
                    <input type="text" name="exercise_frequency_duration" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nivel actividad diaria</label>
                    <select name="daily_activity_level" className={styles.input}>
                      <option value="">Seleccionar...</option>
                      <option value="Sedentario">Sedentario</option>
                      <option value="Moderadamente activo">Moderadamente activo</option>
                      <option value="Muy activo">Muy activo</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Horas de Sueño y calidad</label>
                    <input type="text" name="sleep_hours" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nivel de estrés (1-10)</label>
                    <input type="text" name="stress_level" className={styles.input} />
                  </div>
                </div>
              </div>

              {/* Sección 4: Clínica, Digestivo y Ánimo */}
              <div className={activeFormTab === 4 ? styles.formSection : styles.hiddenSection}>
                <h4>4. Clínica, Digestivo y Percepción</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Presión Arterial</label>
                    <input type="text" name="blood_pressure" placeholder="120/80" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nivel de energía</label>
                    <input type="text" name="energy_level" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cómo percibe el progreso (satisfacción, dudas)</label>
                    <input type="text" name="patient_perception" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Ánimo y alimentación (ansiedad, atracón)</label>
                    <input type="text" name="mood_relationship_with_food" className={styles.input} />
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label>Síntomas digestivos (evolución)</label>
                  <textarea name="symptoms" className={styles.textarea} rows={2}></textarea>
                </div>
              </div>

              {/* Sección 5: Laboratorio */}
              <div className={activeFormTab === 5 ? styles.formSection : styles.hiddenSection}>
                <h4>5. Análisis de Laboratorio</h4>
                <div className={styles.formGroupFull} style={{marginBottom: '1rem'}}>
                  <label>Notas sobre cambios en laboratorio</label>
                  <input type="text" name="lab_notes" className={styles.input} placeholder="Mejora en glucosa, bajó colesterol..." />
                </div>
                <div className={styles.grid4}>
                  <div className={styles.formGroup}>
                    <label>Glucosa</label>
                    <input type="number" step="0.1" name="glucose" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Colesterol Tot.</label>
                    <input type="number" step="0.1" name="total_cholesterol" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>HDL</label>
                    <input type="number" step="0.1" name="hdl_cholesterol" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>LDL</label>
                    <input type="number" step="0.1" name="ldl_cholesterol" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Triglicéridos</label>
                    <input type="number" step="0.1" name="triglycerides" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Hierro</label>
                    <input type="number" step="0.1" name="iron" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Hemoglobina</label>
                    <input type="number" step="0.1" name="hemoglobin" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Ferritina</label>
                    <input type="number" step="0.1" name="ferritin" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Vit. D</label>
                    <input type="number" step="0.1" name="vitamin_d" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Vit. B12</label>
                    <input type="number" step="0.1" name="vitamin_b12" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>TSH</label>
                    <input type="number" step="0.1" name="tsh" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>T4</label>
                    <input type="number" step="0.1" name="t4" className={styles.input} />
                  </div>
                </div>
              </div>

              {/* Sección 6: Seguimiento y Plan */}
              <div className={activeFormTab === 6 ? styles.formSection : styles.hiddenSection}>
                <h4>6. Objetivos, Ajustes y Plan de Acción</h4>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Ajustes realizados en la dieta</label>
                    <textarea name="dietary_adjustments" className={styles.textarea} rows={2}></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Recomendaciones específicas</label>
                    <textarea name="specific_recommendations" className={styles.textarea} rows={2}></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Adherencia al plan anterior</label>
                    <select name="adherence" className={styles.input}>
                      <option value="">Seleccionar...</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Fecha del próximo control</label>
                    <input type="date" name="next_appointment_date" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Metas a Corto Plazo (hasta la próxima)</label>
                    <textarea name="short_term_goals" className={styles.textarea} rows={2}></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Material entregado al paciente</label>
                    <textarea name="delivered_material" className={styles.textarea} rows={2}></textarea>
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Enlace / URL al Plan de Alimentación Actualizado</label>
                    <input type="url" name="diet_plan_url" className={styles.input} placeholder="https://drive.google.com/..." />
                  </div>
                </div>
                <div className={styles.formGroupFull} style={{marginTop: '1rem'}}>
                  <label>Notas Internas (observaciones para futuras consultas)</label>
                  <textarea name="notes" className={styles.textarea} rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className={styles.formNavigation}>
              <div style={{ visibility: activeFormTab > 0 ? 'visible' : 'hidden' }}>
                <button type="button" className={styles.navBtn} onClick={() => setActiveFormTab(prev => prev - 1)}>
                  &larr; Anterior
                </button>
              </div>
              <div style={{ visibility: activeFormTab < 6 ? 'visible' : 'hidden' }}>
                <button type="button" className={styles.navBtn} onClick={() => setActiveFormTab(prev => prev + 1)}>
                  Siguiente &rarr;
                </button>
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
