"use client";
import React, { useState, useMemo } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { INGREDIENTS } from '@/lib/mockData';
import styles from '@/app/recetas/page.module.css';

// Type matching our Supabase schema
export interface Recipe {
  id: string;
  title: string;
  difficulty: string;
  prep_time_minutes: number;
  image_url: string;
  ingredients: string[];
  category: string;
}

interface RecetasClientProps {
  initialRecipes: Recipe[];
}

export default function RecetasClient({ initialRecipes }: RecetasClientProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleIngredient = (ing: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ing) 
        ? prev.filter(i => i !== ing)
        : [...prev, ing]
    );
  };

  const filteredRecipes = useMemo(() => {
    return initialRecipes.filter(recipe => {
      // Filter by search query
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by ingredients ("¿Qué tenés en casa?")
      // Changed from 'every' to 'some' so selecting more ingredients shows MORE recipes (OR logic)
      const matchesIngredients = selectedIngredients.length === 0 || 
        selectedIngredients.some(ing => recipe.ingredients?.includes(ing));

      return matchesSearch && matchesIngredients;
    });
  }, [initialRecipes, selectedIngredients, searchQuery]);

  const INGREDIENT_ICONS: Record<string, string> = {
    "Pollo": "🍗", "Huevo": "🥚", "Tomate": "🍅", "Zanahoria": "🥕", 
    "Zapallito": "🥒", "Arroz": "🍚", "Lentejas": "🍲", "Avena": "🌾", 
    "Cebolla": "🧅", "Morrón": "🫑", "Quinoa": "🥣", "Palta": "🥑", 
    "Espinaca": "🥬", "Cacao": "🍫", "Almendras": "🥜", "Banana": "🍌"
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Recetas saludables</h1>
          <p className={styles.subtitle}>
            Platos fáciles, ricos y nutritivos para incorporar en tu día a día.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.filterBox}>
            <h2 className={styles.filterTitle}>¿Qué tenés en casa?</h2>
            <p className={styles.filterSubtitle}>Seleccioná los ingredientes que tenés disponibles:</p>
            
            <div className={styles.ingredientsGrid}>
              {INGREDIENTS.map(ing => (
                <button 
                  key={ing}
                  className={`${styles.ingredientTag} ${selectedIngredients.includes(ing) ? styles.tagActive : ''}`}
                  onClick={() => toggleIngredient(ing)}
                >
                  <span className={styles.ingredientIcon}>{INGREDIENT_ICONS[ing] || "🥗"}</span>
                  <span className={styles.ingredientName}>{ing}</span>
                </button>
              ))}
            </div>
            {selectedIngredients.length > 0 && (
              <button 
                className={styles.clearBtn} 
                onClick={() => setSelectedIngredients([])}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Buscar recetas..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.resultsHeader}>
            <p>Mostrando {filteredRecipes.length} receta{filteredRecipes.length !== 1 ? 's' : ''}</p>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className={styles.grid}>
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  difficulty={recipe.difficulty}
                  prepTime={recipe.prep_time_minutes}
                  imageUrl={recipe.image_url}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🍽️</span>
              <h3>No encontramos recetas</h3>
              <p>Probá quitando algunos filtros o buscando otros ingredientes.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
