'use server'

import { createClient } from '@/utils/supabase/server'

export async function saveLead(
  name: string, 
  email: string, 
  resultData: any
) {
  const supabase = await createClient()

  const newLead = {
    name,
    email,
    result_data: resultData
  }

  const { error } = await supabase
    .from('leads')
    .insert([newLead])

  if (error) {
    console.error("Error saving lead:", error)
    return { success: false, error: error.message || 'Ocurrió un error al guardar los datos.' }
  }

  return { success: true }
}
