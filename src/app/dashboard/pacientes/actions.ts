'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createPatient(formData: FormData) {
  const supabase = await createClient()

  const newPatient = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email') || null,
    phone: formData.get('phone') || null,
    birth_date: formData.get('birth_date') || null,
    gender: formData.get('gender') || null,
    occupation: formData.get('occupation') || null,
    medical_background: formData.get('medical_background') || null,
    medication: formData.get('medication') || null,
    allergies_intolerances: formData.get('allergies_intolerances') || null,
    objective: formData.get('objective') || null,
  }

  const { data, error } = await supabase
    .from('patients')
    .insert([newPatient])
    .select()
    .single()

  if (error) {
    console.error("Error creating patient:", error)
    return { error: 'Ocurrió un error al guardar el paciente. Por favor, intentá de nuevo.' }
  }

  revalidatePath('/dashboard/pacientes')
  // Redirect to the new patient's profile
  redirect(`/dashboard/pacientes/${data.id}`)
}

export async function updatePatient(formData: FormData, patientId: string) {
  const supabase = await createClient()

  const updatedPatient = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email') || null,
    phone: formData.get('phone') || null,
    birth_date: formData.get('birth_date') || null,
    gender: formData.get('gender') || null,
    occupation: formData.get('occupation') || null,
    medical_background: formData.get('medical_background') || null,
    medication: formData.get('medication') || null,
    allergies_intolerances: formData.get('allergies_intolerances') || null,
    objective: formData.get('objective') || null,
  }

  const { error } = await supabase
    .from('patients')
    .update(updatedPatient)
    .eq('id', patientId)

  if (error) {
    console.error("Error updating patient:", error)
    return { error: 'Ocurrió un error al actualizar los datos.' }
  }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  return { success: true }
}

export async function createClinicalHistory(formData: FormData, patientId: string) {
  const supabase = await createClient()

  const newHistory = {
    patient_id: patientId,
    consultation_date: formData.get('consultation_date') || new Date().toISOString().split('T')[0],
    
    // Anthropometry
    weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
    height: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
    muscle_mass: formData.get('muscle_mass') ? parseFloat(formData.get('muscle_mass') as string) : null,
    fat_percentage: formData.get('fat_percentage') ? parseFloat(formData.get('fat_percentage') as string) : null,
    body_water: formData.get('body_water') ? parseFloat(formData.get('body_water') as string) : null,
    waist_circumference: formData.get('waist_circumference') ? parseFloat(formData.get('waist_circumference') as string) : null,
    hip_circumference: formData.get('hip_circumference') ? parseFloat(formData.get('hip_circumference') as string) : null,
    arm_circumference: formData.get('arm_circumference') ? parseFloat(formData.get('arm_circumference') as string) : null,
    
    // Clinical & Dietary
    blood_pressure: formData.get('blood_pressure') || null,
    reason_for_consultation: formData.get('reason_for_consultation') || null,
    dietary_recall_24h: formData.get('dietary_recall_24h') || null,
    meal_times: formData.get('meal_times') || null,
    hydration: formData.get('hydration') || null,
    alcohol_tobacco: formData.get('alcohol_tobacco') || null,
    
    // Lifestyle & Follow-up
    physical_activity: formData.get('physical_activity') || null,
    sleep_hours: formData.get('sleep_hours') || null,
    stress_level: formData.get('stress_level') || null,
    short_term_goals: formData.get('short_term_goals') || null,
    long_term_goals: formData.get('long_term_goals') || null,
    adherence: formData.get('adherence') || null,
    symptoms: formData.get('symptoms') || null,
    notes: formData.get('notes') || null,
  }

  // Calculate BMI if weight and height are present
  if (newHistory.weight && newHistory.height) {
    const heightInMeters = newHistory.height / 100;
    // @ts-ignore - dynamic key assignment
    newHistory.bmi = parseFloat((newHistory.weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  const { data, error } = await supabase
    .from('clinical_histories')
    .insert([newHistory])
    .select()
    .single()

  if (error) {
    console.error("Error creating clinical history:", error)
    return { error: 'Ocurrió un error al guardar la historia clínica.' }
  }

  // Optional: Also save biochemical indicators if any field is filled
  const hasBiochemicals = formData.get('glucose') || formData.get('total_cholesterol');
  if (hasBiochemicals) {
    const biochemicals = {
      clinical_history_id: data.id,
      glucose: formData.get('glucose') ? parseFloat(formData.get('glucose') as string) : null,
      total_cholesterol: formData.get('total_cholesterol') ? parseFloat(formData.get('total_cholesterol') as string) : null,
      hdl_cholesterol: formData.get('hdl_cholesterol') ? parseFloat(formData.get('hdl_cholesterol') as string) : null,
      ldl_cholesterol: formData.get('ldl_cholesterol') ? parseFloat(formData.get('ldl_cholesterol') as string) : null,
      triglycerides: formData.get('triglycerides') ? parseFloat(formData.get('triglycerides') as string) : null,
      iron: formData.get('iron') ? parseFloat(formData.get('iron') as string) : null,
      vitamin_d: formData.get('vitamin_d') ? parseFloat(formData.get('vitamin_d') as string) : null,
    }
    
    await supabase.from('biochemical_indicators').insert([biochemicals]);
  }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  return { success: true }
}
