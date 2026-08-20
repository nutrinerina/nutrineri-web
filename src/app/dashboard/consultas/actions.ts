'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleConsultaRead(id: string, currentReadStatus: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('consultations')
    .update({ read: !currentReadStatus })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating consultation read status:', error)
    return { error: 'Hubo un error al actualizar el estado de la consulta.' }
  }

  if (!data || data.length === 0) {
    console.error('No se actualizó ninguna fila (posible problema de permisos RLS). ID:', id)
    return { error: 'No se pudo guardar el cambio. Verifica los permisos de la base de datos (RLS).' }
  }

  revalidatePath('/dashboard/consultas')
  revalidatePath('/dashboard', 'layout') 
  return { success: true }
}
