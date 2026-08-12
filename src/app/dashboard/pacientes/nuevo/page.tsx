"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { createPatient } from '../actions';
import styles from './page.module.css';

export default function NuevoPaciente() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await createPatient(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard/pacientes" className={styles.backBtn}>
          &larr; Volver
        </Link>
        <h1 className={styles.title}>Nuevo Paciente</h1>
        <p className={styles.subtitle}>Completá los datos básicos para abrir la historia clínica.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Datos Personales</h2>
          
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Nombre *</label>
              <input type="text" name="first_name" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Apellido *</label>
              <input type="text" name="last_name" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Teléfono</label>
              <input type="tel" name="phone" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de Nacimiento</label>
              <input type="date" name="birth_date" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Género</label>
              <select name="gender" className={styles.input}>
                <option value="">Seleccionar...</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ocupación</label>
              <input type="text" name="occupation" className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Motivo de Consulta</h2>
          <div className={styles.formGroupFull}>
            <label>Objetivo principal</label>
            <input type="text" name="objective" className={styles.input} placeholder="Ej: Descenso de grasa, educación alimentaria..." />
          </div>
          <div className={styles.formGroupFull}>
            <label>Expectativas del paciente (qué espera lograr y en cuánto tiempo)</label>
            <textarea name="expectations" className={styles.textarea} rows={2}></textarea>
          </div>
          <div className={styles.formGroupFull}>
            <label>Derivado por (profesional / motivo)</label>
            <input type="text" name="referred_by" className={styles.input} />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Antecedentes y Hábitos</h2>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Enfermedades actuales y pasadas</label>
              <textarea name="medical_background" className={styles.textarea} rows={3}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Antecedentes familiares</label>
              <textarea name="family_background" className={styles.textarea} rows={3}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Cirugías previas</label>
              <textarea name="past_surgeries" className={styles.textarea} rows={2}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Alergias o Intolerancias</label>
              <textarea name="allergies_intolerances" className={styles.textarea} rows={2}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Medicamentos Actuales</label>
              <textarea name="medication" className={styles.textarea} rows={2}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Suplementos</label>
              <textarea name="supplements" className={styles.textarea} rows={2}></textarea>
            </div>
          </div>
          <div className={styles.formGroupFull}>
            <label>Preferencias y rechazos alimentarios</label>
            <textarea name="food_preferences" className={styles.textarea} rows={2}></textarea>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Crear Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}
