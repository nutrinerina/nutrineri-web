import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  let parsedIngredients = [];
  try {
    if (typeof recipe.ingredients === 'string') {
      parsedIngredients = JSON.parse(recipe.ingredients);
    } else if (Array.isArray(recipe.ingredients)) {
      parsedIngredients = recipe.ingredients;
    }
  } catch (e) {
    console.error("Failed to parse ingredients", e);
  }

  return (
    <div className={styles.page}>
      <div 
        className={styles.hero} 
        style={{ backgroundImage: `url(${recipe.image_url || ''})` }}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <Link href="/recetas" className={styles.backBtn}>&larr; Volver a recetas</Link>
            <span className={styles.category}>{recipe.category || 'Receta'}</span>
            <h1 className={styles.title}>{recipe.title}</h1>
            <div className={styles.meta}>
              <span><span className={styles.icon}>⏱️</span> {recipe.difficulty}</span>
              <span><span className={styles.icon}>🕒</span> {recipe.prep_time_minutes} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.ingredientsBox}>
            <h2>Ingredientes</h2>
            <ul className={styles.ingredientsList}>
              {parsedIngredients.map((ing: string, i: number) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.instructionsBox}>
            <h2>Preparación</h2>
            {recipe.instructions ? (
              <div className={styles.instructionsContent}>
                {recipe.instructions}
              </div>
            ) : (
              <p className={styles.placeholderText}>
                Las instrucciones detalladas para esta receta estarán disponibles próximamente. 
                ¡Mantente atento!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
