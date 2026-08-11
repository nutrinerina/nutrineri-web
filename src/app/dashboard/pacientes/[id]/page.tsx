import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PatientProfileClient from '@/components/PatientProfileClient';

export default async function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Fetch Patient Data
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (patientError || !patient) {
    notFound();
  }

  // 2. Fetch Clinical Histories
  const { data: histories, error: historiesError } = await supabase
    .from('clinical_histories')
    .select('*, biochemical_indicators(*)')
    .eq('patient_id', id)
    .order('consultation_date', { ascending: false });

  if (historiesError) {
    console.error("Error fetching histories:", historiesError);
  }

  return (
    <PatientProfileClient patient={patient} initialHistories={histories || []} />
  );
}
