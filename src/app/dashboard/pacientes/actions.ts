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
    objective: formData.get('objective') || null,
    expectations: formData.get('expectations') || null,
    referred_by: formData.get('referred_by') || null,
    medical_background: formData.get('medical_background') || null,
    family_background: formData.get('family_background') || null,
    past_surgeries: formData.get('past_surgeries') || null,
    medication: formData.get('medication') || null,
    supplements: formData.get('supplements') || null,
    allergies_intolerances: formData.get('allergies_intolerances') || null,
    food_preferences: formData.get('food_preferences') || null,
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
    objective: formData.get('objective') || null,
    expectations: formData.get('expectations') || null,
    referred_by: formData.get('referred_by') || null,
    medical_background: formData.get('medical_background') || null,
    family_background: formData.get('family_background') || null,
    past_surgeries: formData.get('past_surgeries') || null,
    medication: formData.get('medication') || null,
    supplements: formData.get('supplements') || null,
    allergies_intolerances: formData.get('allergies_intolerances') || null,
    food_preferences: formData.get('food_preferences') || null,
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

  let diet_plan_url = formData.get('diet_plan_url_link') as string || null;
  const dietPlanFile = formData.get('diet_plan_file') as File | null;
  
  if (dietPlanFile && dietPlanFile.size > 0) {
    const fileExt = dietPlanFile.name.split('.').pop();
    const fileName = `${patientId}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('diet_plans')
      .upload(fileName, dietPlanFile);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { error: 'Ocurrió un error al subir el archivo del plan. Asegurate de que el bucket "diet_plans" exista en Supabase.' };
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('diet_plans')
      .getPublicUrl(fileName);
      
    diet_plan_url = publicUrl;
  }

  const newHistory = {
    patient_id: patientId,
    consultation_date: formData.get('consultation_date') || new Date().toISOString().split('T')[0],
    consultation_type: formData.get('consultation_type') || null,
    reason_for_consultation: formData.get('reason_for_consultation') || null,
    
    // Anthropometry
    weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
    height: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
    muscle_mass: formData.get('muscle_mass') ? parseFloat(formData.get('muscle_mass') as string) : null,
    fat_percentage: formData.get('fat_percentage') ? parseFloat(formData.get('fat_percentage') as string) : null,
    body_water: formData.get('body_water') ? parseFloat(formData.get('body_water') as string) : null,
    waist_circumference: formData.get('waist_circumference') ? parseFloat(formData.get('waist_circumference') as string) : null,
    hip_circumference: formData.get('hip_circumference') ? parseFloat(formData.get('hip_circumference') as string) : null,
    arm_circumference: formData.get('arm_circumference') ? parseFloat(formData.get('arm_circumference') as string) : null,
    other_perimeters: formData.get('other_perimeters') || null,
    
    // Hábitos alimentarios
    dietary_recall_24h: formData.get('dietary_recall_24h') || null,
    dietary_changes: formData.get('dietary_changes') || null,
    meal_times: formData.get('meal_times') || null,
    where_eats: formData.get('where_eats') || null,
    who_cooks: formData.get('who_cooks') || null,
    food_frequency: formData.get('food_frequency') || null,
    hydration: formData.get('hydration') || null,
    alcohol_tobacco: formData.get('alcohol_tobacco') || null,
    
    // Actividad física y estilo de vida
    physical_activity: formData.get('physical_activity') || null,
    exercise_frequency_duration: formData.get('exercise_frequency_duration') || null,
    daily_activity_level: formData.get('daily_activity_level') || null,
    sleep_hours: formData.get('sleep_hours') || null,
    stress_level: formData.get('stress_level') || null,
    
    // Clínico, Digestivo y Ánimo
    blood_pressure: formData.get('blood_pressure') || null,
    lab_notes: formData.get('lab_notes') || null,
    energy_level: formData.get('energy_level') || null,
    recent_weight_changes: formData.get('recent_weight_changes') || null,
    mood_relationship_with_food: formData.get('mood_relationship_with_food') || null,
    symptoms: formData.get('symptoms') || null,
    patient_perception: formData.get('patient_perception') || null,
    
    // Seguimiento, Ajustes y Plan
    difficulties: formData.get('difficulties') || null,
    adherence: formData.get('adherence') || null,
    short_term_goals: formData.get('short_term_goals') || null,
    long_term_goals: formData.get('long_term_goals') || null,
    dietary_adjustments: formData.get('dietary_adjustments') || null,
    specific_recommendations: formData.get('specific_recommendations') || null,
    delivered_material: formData.get('delivered_material') || null,
    next_appointment_date: formData.get('next_appointment_date') || null,
    
    // Documentos y Notas
    diet_plan_url: diet_plan_url,
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
  const hasBiochemicals = formData.get('glucose') || formData.get('total_cholesterol') || formData.get('hemoglobin') || formData.get('vitamin_d') || formData.get('tsh');
  if (hasBiochemicals) {
    const biochemicals = {
      clinical_history_id: data.id,
      glucose: formData.get('glucose') ? parseFloat(formData.get('glucose') as string) : null,
      total_cholesterol: formData.get('total_cholesterol') ? parseFloat(formData.get('total_cholesterol') as string) : null,
      hdl_cholesterol: formData.get('hdl_cholesterol') ? parseFloat(formData.get('hdl_cholesterol') as string) : null,
      ldl_cholesterol: formData.get('ldl_cholesterol') ? parseFloat(formData.get('ldl_cholesterol') as string) : null,
      triglycerides: formData.get('triglycerides') ? parseFloat(formData.get('triglycerides') as string) : null,
      iron: formData.get('iron') ? parseFloat(formData.get('iron') as string) : null,
      hemoglobin: formData.get('hemoglobin') ? parseFloat(formData.get('hemoglobin') as string) : null,
      ferritin: formData.get('ferritin') ? parseFloat(formData.get('ferritin') as string) : null,
      vitamin_d: formData.get('vitamin_d') ? parseFloat(formData.get('vitamin_d') as string) : null,
      vitamin_b12: formData.get('vitamin_b12') ? parseFloat(formData.get('vitamin_b12') as string) : null,
      tsh: formData.get('tsh') ? parseFloat(formData.get('tsh') as string) : null,
      t4: formData.get('t4') ? parseFloat(formData.get('t4') as string) : null,
    }
    
    await supabase.from('biochemical_indicators').insert([biochemicals]);
  }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  return { success: true }
}
