"use server";
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteContent(pageId: string, contentData: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('site_content')
    .update({ content: contentData, updated_at: new Date().toISOString() })
    .eq('page_id', pageId);

  if (error) {
    console.error("Error updating site content:", error);
    return { error: 'No se pudo actualizar la configuración.' };
  }

  // Revalidate the page that was updated
  if (pageId === 'home') revalidatePath('/');
  if (pageId === 'about') revalidatePath('/sobre-mi');
  if (pageId === 'services') revalidatePath('/servicios');
  
  return { success: true };
}
