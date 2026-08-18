'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitConsultation(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const reason = formData.get('reason') as string
  const rawMessage = formData.get('message') as string
  const phone = formData.get('phone') as string

  if (!name || !email || !reason || !rawMessage) {
    return { error: 'Todos los campos son obligatorios' }
  }

  const message = phone ? `[Celular: ${phone}]\n\n${rawMessage}` : rawMessage;

  const supabase = await createClient()

  const { error } = await supabase
    .from('consultations')
    .insert([
      { name, email, reason, message }
    ])

  if (error) {
    console.error('Error inserting consultation:', error)
    return { error: 'Hubo un error al enviar la consulta. Intenta nuevamente.' }
  }

  revalidatePath('/dashboard/consultas')
  return { success: true }
}
