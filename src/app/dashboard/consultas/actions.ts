'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleConsultaRead(id: string, currentReadStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('consultations')
    .update({ read: !currentReadStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating consultation read status:', error)
    return { error: 'Hubo un error al actualizar el estado de la consulta.' }
  }

  revalidatePath('/dashboard/consultas')
  revalidatePath('/dashboard', 'layout') 
  return { success: true }
}
