"use client";
import React, { useState } from 'react';
import { createTip, deleteTip, updateTip } from '@/app/dashboard/tips/actions';
import styles from './TipsManagerClient.module.css';

export default function TipsManagerClient({ initialTips }: { initialTips: any[] }) {
  const [tips, setTips] = useState(initialTips);
  const [showForm, setShowForm] = useState(false);
  const [editingTip, setEditingTip] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    let result;
    
    if (editingTip) {
      result = await updateTip(editingTip.id, formData);
    } else {
      result = await createTip(formData);
    }
    
    if (result.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      setEditingTip(null);
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar este Tip?')) return;
    const result = await deleteTip(id);
    if (!result.error) {
      setTips(tips.filter(t => t.id !== id));
    }
  };

  const handleEdit = (tip: any) => {
    setEditingTip(tip);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTip(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestor de Tips (Blog)</h1>
          <p className={styles.subtitle}>Administrá los artículos educativos de la web pública.</p>
        </div>
        <button className={styles.addBtn} onClick={showForm ? handleCancel : () => setShowForm(true)}>
          {showForm ? 'Cancelar' : '+ Nuevo Tip'}
        </button>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h2>{editingTip ? 'Editar Tip' : 'Agregar Nuevo Tip'}</h2>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Título *</label>
              <input type="text" name="title" defaultValue={editingTip?.title} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Categoría *</label>
              <input type="text" name="category" defaultValue={editingTip?.category} required placeholder="Ej: Hábitos, Bienestar" className={styles.input} />
            </div>
            <div className={styles.formGroupFull}>
              <label>Imagen del Tip</label>
              <input type="file" name="image_file" accept="image/*" className={styles.input} style={{padding: '0.5rem'}} />
              <input type="hidden" name="image_url" defaultValue={editingTip?.image_url || ''} />
              <small style={{color: 'var(--color-text-muted)', marginTop: '0.25rem'}}>
                Seleccioná una imagen desde tu PC (Tamaño sugerido: 800x600 px o formato horizontal). 
                {editingTip?.image_url && ' Ya tiene una imagen subida, seleccioná otra solo si querés reemplazarla.'}
              </small>
            </div>
            <div className={styles.formGroupFull}>
              <label>Resumen Corto (Para la tarjeta) *</label>
              <textarea name="summary" defaultValue={editingTip?.summary} required maxLength={150} className={styles.textarea} rows={2}></textarea>
            </div>
            <div className={styles.formGroupFull}>
              <label>Contenido Detallado (Artículo)</label>
              <textarea name="content" defaultValue={editingTip?.content} className={styles.textarea} rows={6}></textarea>
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Guardando...' : (editingTip ? 'Guardar Cambios' : 'Publicar Tip')}
            </button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {tips.length === 0 ? (
          <p className={styles.empty}>No hay tips cargados.</p>
        ) : (
          <div className={styles.gridList}>
            {tips.map(tip => (
              <div key={tip.id} className={styles.card}>
                <div 
                  className={styles.cardImage} 
                  style={{ backgroundImage: `url(${tip.image_url || ''})`, backgroundColor: '#eee' }}
                ></div>
                <div className={styles.cardContent}>
                  <span className={styles.date}>{tip.date}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.summary}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button onClick={() => handleEdit(tip)} className={styles.editBtn}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(tip.id)} className={styles.deleteBtn}>
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
