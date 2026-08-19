import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AgendaEnVivo from '@/components/AgendaEnVivo';

export const metadata = {
  title: 'Agenda en Vivo | Acceso Rápido',
};

// Force dynamic rendering so we always fetch fresh data on load
export const dynamic = 'force-dynamic';

export default async function PublicAgendaPage() {
  const supabase = await createClient();
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Fetch only today and tomorrow's appointments
  const { data: slots, error } = await supabase
    .from('appointments')
    .select('*')
    .in('date', [todayStr, tomorrowStr])
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.error("Error fetching appointments for mobile agenda:", error);
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>📱 Agenda en Vivo</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Dejá esta pantalla abierta en tu celular o tablet.
        </p>
      </header>

      <AgendaEnVivo 
        initialSlots={slots || []} 
        todayStr={todayStr} 
        tomorrowStr={tomorrowStr} 
      />
    </div>
  );
}
