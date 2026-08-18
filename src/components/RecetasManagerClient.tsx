"use client";
import React, { useState } from 'react';
import { createRecipe, deleteRecipe, updateRecipe } from '@/app/dashboard/recetas/actions';
import styles from './RecetasManagerClient.module.css';

export default function RecetasManagerClient({ initialRecipes }: { initialRecipes: any[] }) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    let result;
    
    if (editingRecipe) {
      result = await updateRecipe(editingRecipe.id, formData);
    } else {
      result = await createRecipe(formData);
    }
    
    if (result.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      setEditingRecipe(null);
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar esta receta?')) return;
    setIsSubmitting(true);
    const result = await deleteRecipe(id);
    setIsSubmitting(false);
    if (result?.error) {
      alert(result.error);
    } else {
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  const handleEdit = (recipe: any) => {
    setEditingRecipe(recipe);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecipe(null);
    setError(null);
  };

  const handleSeed = async () => {
    if (!confirm('¿Insertar recetas de prueba?')) return;
    setIsSubmitting(true);
    try {
      const { RECIPES } = await import('@/lib/mockData');
      for (const r of RECIPES) {
        const formData = new FormData();
        formData.append('title', r.title);
        formData.append('category', r.category);
        formData.append('difficulty', r.difficulty);
        formData.append('prep_time_minutes', r.prepTime.toString());
        formData.append('image_url', r.imageUrl);
        formData.append('ingredients', r.ingredients.join(', '));
        formData.append('instructions', 'Instrucciones de ejemplo...');
        await createRecipe(formData);
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
      setError('Error insertando recetas');
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestor de Recetas</h1>
          <p className={styles.subtitle}>Administrá las recetas que se muestran en la web pública.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={styles.addBtn} onClick={handleSeed} style={{ backgroundColor: '#f59e0b' }}>
            {isSubmitting ? 'Insertando...' : 'Sembrar Datos (Temporal)'}
          </button>
          <button className={styles.addBtn} onClick={showForm ? handleCancel : () => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            {showForm ? 'Cancelar' : '+ Nueva Receta'}
          </button>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h2>{editingRecipe ? 'Editar Receta' : 'Agregar Nueva Receta'}</h2>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Título *</label>
              <input type="text" name="title" defaultValue={editingRecipe?.title} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Categoría *</label>
              <input type="text" name="category" defaultValue={editingRecipe?.category} required placeholder="Ej: Almuerzos" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Dificultad *</label>
              <select name="difficulty" defaultValue={editingRecipe?.difficulty || "Fácil"} required className={styles.input}>
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Tiempo de Preparación (minutos) *</label>
              <input type="number" name="prep_time_minutes" defaultValue={editingRecipe?.prep_time_minutes} required className={styles.input} />
            </div>
            <div className={styles.formGroupFull}>
              <label>Imagen de la Receta</label>
              <input type="file" name="image_file" accept="image/*" className={styles.input} style={{padding: '0.5rem'}} />
              <input type="hidden" name="image_url" defaultValue={editingRecipe?.image_url || ''} />
              <small style={{color: 'var(--color-text-muted)', marginTop: '0.25rem'}}>
                Seleccioná una imagen desde tu PC (Tamaño sugerido: 800x600 px o formato cuadrado para que se vea óptima). 
                {editingRecipe?.image_url && ' Ya tiene una imagen subida, seleccioná otra solo si querés reemplazarla.'}
              </small>
            </div>
            <div className={styles.formGroupFull}>
              <label>Ingredientes (Separados por coma) *</label>
              <textarea 
                name="ingredients" 
                defaultValue={(() => {
                  if (!editingRecipe?.ingredients) return '';
                  if (typeof editingRecipe.ingredients === 'string') {
                    try {
                      if (editingRecipe.ingredients.startsWith('[')) {
                        return JSON.parse(editingRecipe.ingredients).join(', ');
                      }
                    } catch(e) {}
                    return editingRecipe.ingredients;
                  }
                  if (Array.isArray(editingRecipe.ingredients)) {
                    return editingRecipe.ingredients.join(', ');
                  }
                  return '';
                })()} 
                required 
                placeholder="Pollo, Huevo, Cebolla..." 
                className={styles.textarea} 
                rows={2}
              ></textarea>
            </div>
            <div className={styles.formGroupFull}>
              <label>Instrucciones de Preparación</label>
              <textarea name="instructions" defaultValue={editingRecipe?.instructions} placeholder="1. Cortar las verduras... 2. Cocinar..." className={styles.textarea} rows={4}></textarea>
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Guardando...' : (editingRecipe ? 'Guardar Cambios' : 'Guardar Receta')}
            </button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {recipes.length === 0 ? (
          <p className={styles.empty}>No hay recetas cargadas.</p>
        ) : (
          <div className={styles.gridList}>
            {recipes.map(recipe => (
              <div key={recipe.id} className={styles.card}>
                <div 
                  className={styles.cardImage} 
                  style={{ backgroundImage: `url(${recipe.image_url || ''})`, backgroundColor: '#eee' }}
                ></div>
                <div className={styles.cardContent}>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.category} • {recipe.difficulty} • {recipe.prep_time_minutes} min</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button onClick={() => handleEdit(recipe)} className={styles.editBtn}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(recipe.id)} className={styles.deleteBtn}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


