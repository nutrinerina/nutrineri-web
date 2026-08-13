import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AgendaEnVivo from '@/components/AgendaEnVivo';

export const metadata = {
  title: 'Agenda en Vivo | Panel de Administración',
};

// Force dynamic rendering so we always fetch fresh data on load
export const dynamic = 'force-dynamic';

export default async function AgendaMovilPage() {
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
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>📱 Agenda en Vivo</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Dejá esta pantalla abierta en tu celular. Los nuevos turnos aparecerán automáticamente con un sonido de notificación.
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
