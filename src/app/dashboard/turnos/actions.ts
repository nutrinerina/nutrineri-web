"use server";
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSlots(date: string, startTime: string, endTime: string, duration: number) {
  const supabase = await createClient();
  
  // Create Date objects for start and end
  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  
  if (start >= end) {
    return { error: 'La hora de inicio debe ser anterior a la hora de fin.' };
  }

  const slotsToInsert = [];
  let current = start;

  while (current < end) {
    const timeString = current.toTimeString().split(' ')[0]; // HH:MM:SS
    slotsToInsert.push({
      date: date,
      time: timeString,
      duration: duration,
      status: 'available'
    });
    // Add duration
    current = new Date(current.getTime() + duration * 60000);
  }

  if (slotsToInsert.length === 0) {
    return { error: 'No se generaron turnos con ese rango.' };
  }

  const { error } = await supabase
    .from('appointments')
    .insert(slotsToInsert);

  if (error) {
    console.error("Error creating slots:", error);
    return { error: 'Error al generar los turnos en la base de datos.' };
  }

  revalidatePath('/dashboard/turnos');
  revalidatePath('/turnos');
  return { success: true, count: slotsToInsert.length };
}

export async function deleteSlot(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) return { error: 'Error al eliminar el turno.' };
  
  revalidatePath('/dashboard/turnos');
  revalidatePath('/turnos');
  return { success: true };
}

export async function cancelAppointment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('appointments')
    .update({ 
      status: 'available',
      client_name: null,
      client_email: null,
      client_phone: null,
      modality: null
    })
    .eq('id', id);
    
  if (error) return { error: 'Error al cancelar la reserva.' };
  
  revalidatePath('/dashboard/turnos');
  revalidatePath('/turnos');
  return { success: true };
}
