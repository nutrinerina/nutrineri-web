import React from 'react';
import { createClient } from '@/utils/supabase/server';
import RecetasManagerClient from '@/components/RecetasManagerClient';

export default async function RecetasManagerPage() {
  const supabase = await createClient();
  
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <RecetasManagerClient initialRecipes={recipes || []} />
    </div>
  );
}
