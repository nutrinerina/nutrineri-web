"use server";
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createRecipe(formData: FormData) {
  const supabase = await createClient();

  const ingredientsStr = formData.get('ingredients') as string;
  let ingredients = [];
  try {
    ingredients = ingredientsStr.split(',').map(i => i.trim()).filter(i => i !== '');
  } catch(e) {}

  let imageUrl = formData.get('image_url') as string | null;
  if (imageUrl === '') imageUrl = null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `recetas/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { error: 'Error al subir la imagen.' };
    }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    imageUrl = publicUrl;
  }

  const recipe = {
    title: formData.get('title'),
    difficulty: formData.get('difficulty'),
    prep_time_minutes: parseInt(formData.get('prep_time_minutes') as string) || 0,
    category: formData.get('category'),
    image_url: imageUrl,
    instructions: formData.get('instructions') || null,
    ingredients: JSON.stringify(ingredients), // Supabase handles JSON or we stringify
  };

  const { error } = await supabase.from('recipes').insert(recipe);

  if (error) {
    console.error("Error creating recipe:", error);
    return { error: 'No se pudo crear la receta.' };
  }

  revalidatePath('/dashboard/recetas');
  revalidatePath('/recetas');
  return { success: true };
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  const supabase = await createClient();

  const ingredientsStr = formData.get('ingredients') as string;
  let ingredients = [];
  try {
    ingredients = ingredientsStr.split(',').map(i => i.trim()).filter(i => i !== '');
  } catch(e) {}

  let imageUrl = formData.get('image_url') as string | null;
  if (imageUrl === '') imageUrl = null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `recetas/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { error: 'Error al subir la imagen.' };
    }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    imageUrl = publicUrl;
  }

  const recipe = {
    title: formData.get('title'),
    difficulty: formData.get('difficulty'),
    prep_time_minutes: parseInt(formData.get('prep_time_minutes') as string) || 0,
    category: formData.get('category'),
    image_url: imageUrl,
    instructions: formData.get('instructions') || null,
    ingredients: JSON.stringify(ingredients),
  };

  const { error } = await supabase.from('recipes').update(recipe).eq('id', recipeId);

  if (error) {
    console.error("Error updating recipe:", error);
    return { error: 'No se pudo actualizar la receta.' };
  }

  revalidatePath('/dashboard/recetas');
  revalidatePath('/recetas');
  revalidatePath(`/recetas/${recipeId}`);
  return { success: true };
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('recipes').delete().eq('id', recipeId);
  
  if (error) {
    console.error("Error deleting recipe:", error);
    return { error: 'No se pudo eliminar la receta.' };
  }

  revalidatePath('/dashboard/recetas');
  revalidatePath('/recetas');
  return { success: true };
}
