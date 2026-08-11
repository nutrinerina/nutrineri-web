import React from 'react';
import { createClient } from '@/utils/supabase/server';
import RecetasClient from '@/components/RecetasClient';

export const metadata = {
  title: "Recetas Saludables | Nerina Bruno",
  description: "Platos fáciles, ricos y nutritivos para incorporar en tu día a día.",
};

export default async function Recetas() {
  const supabase = await createClient();
  
  // Fetch recipes from Supabase
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
  }

  return (
    <RecetasClient initialRecipes={recipes || []} />
  );
}
