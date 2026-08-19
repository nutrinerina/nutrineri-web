'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '@/components/PatientProfileClient.module.css';
import Link from 'next/link';

export default function MiPlan() {
  const [patient, setPatient] = useState<any>(null);
  const [latestHistory, setLatestHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch patient
        const { data: p } = await supabase
          .from('patients')
          .select('*')
          .eq('email', user.email)
          .single();

        if (p) {
          setPatient(p);
          // Fetch latest history
          const { data: h } = await supabase
            .from('clinical_histories')
            .select('*')
            .eq('patient_id', p.id)
            .order('consultation_date', { ascending: false })
            .limit(1)
            .single();
          
          if (h) setLatestHistory(h);
        }
      }
      setLoading(false);
    };

    fetchPatientData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando tu plan...</div>;
  if (!patient || !latestHistory) return <div style={{ padding: '2rem' }}>Todavía no tenés un plan asignado. Comunicate con tu nutricionista.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
        Mi Plan Nutricional
      </h1>
      
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--color-tertiary)', marginBottom: '1rem', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem' }}>
          Recomendaciones de tu última consulta
        </h3>
        
        {latestHistory.specific_recommendations ? (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--color-text-main)' }}>
            {latestHistory.specific_recommendations}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No hay recomendaciones adicionales registradas.</p>
        )}
        
        {latestHistory.short_term_goals && (
          <div style={{ marginTop: '1.5rem' }}>
            <strong style={{ color: 'var(--color-primary)' }}>Metas a corto plazo:</strong>
            <p style={{ marginTop: '0.5rem' }}>{latestHistory.short_term_goals}</p>
          </div>
        )}
      </div>

      <div className={styles.card} style={{ backgroundColor: 'var(--color-quaternary)', border: 'none', textAlign: 'center', padding: '3rem 2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Descargá tu Plan Completo
        </h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          Hacé clic en el botón para ver o descargar el plan de alimentación y materiales que preparamos para vos.
        </p>
        
        {latestHistory.diet_plan_url ? (
          <a 
            href={latestHistory.diet_plan_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📥 Descargar Plan Actual
          </a>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
            <p>Todavía no hay un archivo adjunto para esta consulta.</p>
          </div>
        )}
      </div>
    </div>
  );
}
