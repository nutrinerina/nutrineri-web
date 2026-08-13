"use server";
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function bookAppointment(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const client_name = formData.get('client_name') as string;
  const client_email = formData.get('client_email') as string;
  const client_phone = formData.get('client_phone') as string;
  const modality = formData.get('modality') as string;

  if (!client_name || !client_email || !client_phone || !modality) {
    return { error: 'Por favor, completa todos los campos.' };
  }

  // Double check if slot is still available
  const { data: slot } = await supabase.from('appointments').select('status').eq('id', id).single();
  if (slot?.status !== 'available') {
    return { error: 'Lo sentimos, este turno ya fue reservado o no está disponible.' };
  }

  const { error } = await supabase
    .from('appointments')
    .update({ 
      status: 'booked',
      client_name,
      client_email,
      client_phone,
      modality
    })
    .eq('id', id);

  if (error) {
    console.error("Error booking appointment:", error);
    return { error: 'Ocurrió un error al procesar la reserva. Inténtalo de nuevo.' };
  }

  revalidatePath('/turnos');
  revalidatePath('/dashboard/turnos');
  return { success: true };
}
