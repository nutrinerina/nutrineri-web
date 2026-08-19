'use client'

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClient } from '@/utils/supabase/client';
import styles from '@/components/PatientProfileClient.module.css';

export default function PortalDashboard() {
  const [patient, setPatient] = useState<any>(null);
  const [histories, setHistories] = useState<any[]>([]);
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
          // Fetch histories
          const { data: h } = await supabase
            .from('clinical_histories')
            .select('*')
            .eq('patient_id', p.id)
            .order('consultation_date', { ascending: false });
          
          if (h) setHistories(h);
        }
      }
      setLoading(false);
    };

    fetchPatientData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando tus datos...</div>;
  if (!patient) return <div style={{ padding: '2rem' }}>No se encontraron tus datos. Comunicate con tu nutricionista.</div>;

  const nextAppointment = histories.find(h => h.next_appointment_date)?.next_appointment_date;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
        ¡Hola, {patient.first_name}!
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Bienvenido a tu espacio personal de bienestar.
      </p>

      <div className={styles.grid2} style={{ marginBottom: '2rem' }}>
        <div className={styles.card} style={{ backgroundColor: 'var(--color-quaternary)', border: 'none' }}>
          <h3 style={{ color: 'var(--color-primary)' }}>Próximo Turno</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.5rem' }}>
            {nextAppointment ? new Date(nextAppointment).toLocaleDateString('es-AR') : 'Sin turno agendado'}
          </p>
        </div>
        <div className={styles.card} style={{ backgroundColor: '#fff', border: '1px solid #eaeaea' }}>
          <h3 style={{ color: 'var(--color-primary)' }}>Tu Objetivo</h3>
          <p style={{ marginTop: '0.5rem' }}>
            {patient.objective || 'Avanzar paso a paso hacia una vida más saludable.'}
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-tertiary)' }}>Tu Evolución</h3>
        {histories.length < 2 ? (
          <div className={styles.emptyState}>
            Se necesitan al menos 2 consultas registradas para ver la evolución gráfica. ¡Seguí así!
          </div>
        ) : (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...histories].reverse().map(h => ({
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
                
                <Line yAxisId="left" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#7d967b" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                <Line yAxisId="left" type="monotone" dataKey="muscle" name="Masa Muscular (kg)" stroke="#d4a373" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                <Line yAxisId="right" type="monotone" dataKey="fat" name="% Grasa" stroke="#2e3532" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
