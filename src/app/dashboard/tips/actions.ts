"use server";
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTip(formData: FormData) {
  const supabase = await createClient();

  let imageUrl = formData.get('image_url') as string | null;
  if (imageUrl === '') imageUrl = null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `tips/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { error: 'Error al subir la imagen.' };
    }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    imageUrl = publicUrl;
  }

  const tip = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content') || null,
    category: formData.get('category'),
    image_url: imageUrl,
    date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  const { error } = await supabase.from('tips').insert(tip);

  if (error) {
    console.error("Error creating tip:", error);
    return { error: 'No se pudo crear el tip.' };
  }

  revalidatePath('/dashboard/tips');
  revalidatePath('/tips');
  return { success: true };
}

export async function updateTip(tipId: string, formData: FormData) {
  const supabase = await createClient();

  let imageUrl = formData.get('image_url') as string | null;
  if (imageUrl === '') imageUrl = null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `tips/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { error: 'Error al subir la imagen.' };
    }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    imageUrl = publicUrl;
  }

  const tip = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content') || null,
    category: formData.get('category'),
    image_url: imageUrl,
  };

  const { error } = await supabase.from('tips').update(tip).eq('id', tipId);

  if (error) {
    console.error("Error updating tip:", error);
    return { error: 'No se pudo actualizar el tip.' };
  }

  revalidatePath('/dashboard/tips');
  revalidatePath('/tips');
  revalidatePath(`/tips/${tipId}`);
  return { success: true };
}

export async function deleteTip(tipId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('tips').delete().eq('id', tipId);
  
  if (error) {
    console.error("Error deleting tip:", error);
    return { error: 'No se pudo eliminar el tip.' };
  }

  revalidatePath('/dashboard/tips');
  revalidatePath('/tips');
  return { success: true };
}
