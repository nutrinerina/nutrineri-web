import React from 'react';
import { createClient } from '@/utils/supabase/server';
import LeadsManagerClient from '@/components/LeadsManagerClient';

export const metadata = {
  title: "Contactos (Leads) | Dashboard",
};

export default async function LeadsPage() {
  const supabase = await createClient();

  // Fetch leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
        Contactos Captados (Leads)
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Acá podés ver todos los contactos que dejaron su email en la Calculadora Nutricional de tu página principal.
      </p>
      
      <LeadsManagerClient initialLeads={leads || []} />
    </div>
  );
}
