'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function loginPatient(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  // 1. Check if patient exists in the patients table
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('email', email)
    .single()

  if (patientError || !patient) {
    // If not found in patients table, they shouldn't log in
    // Note: in a real app you might want to return an error to the UI
    redirect('/portal/login?error=No_encontramos_tu_usuario')
  }

  // 2. Attempt Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/portal/login?error=No_se_pudo_iniciar_sesion')
  }

  redirect('/portal')
}
