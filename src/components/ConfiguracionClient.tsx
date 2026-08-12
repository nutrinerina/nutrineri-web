"use client";
import React, { useState } from 'react';
import { updateSiteContent } from '@/app/dashboard/configuracion/actions';
import styles from './ConfiguracionClient.module.css';

export default function ConfiguracionClient({ 
  initialHome, 
  initialAbout, 
  initialServices 
}: { 
  initialHome: any, 
  initialAbout: any, 
  initialServices: any 
}) {
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>, pageId: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const contentData: any = {};
    formData.forEach((value, key) => {
      contentData[key] = value;
    });

    const result = await updateSiteContent(pageId, contentData);
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: '¡Configuración guardada con éxito!' });
      setTimeout(() => setMessage(null), 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Configuración Web</h1>
        <p className={styles.subtitle}>Editá los textos principales de las páginas estáticas de tu sitio.</p>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'home' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Inicio
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Sobre Mí
        </button>
      </div>

      {message && (
        <div className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </div>
      )}

      <div className={styles.tabContent}>
        {activeTab === 'home' && (
          <form onSubmit={(e) => handleSave(e, 'home')} className={styles.formCard}>
            <h2>Página de Inicio</h2>
            
            <div className={styles.section}>
              <h3>Hero (Banner Principal)</h3>
              <div className={styles.formGroup}>
                <label>Título Principal</label>
                <input type="text" name="hero_title" defaultValue={initialHome.hero_title} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Subtítulo</label>
                <textarea name="hero_subtitle" defaultValue={initialHome.hero_subtitle} className={styles.textarea} rows={3}></textarea>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Sección de Servicios (Resumen)</h3>
              <div className={styles.formGroup}>
                <label>Título</label>
                <input type="text" name="services_title" defaultValue={initialHome.services_title} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Subtítulo</label>
                <textarea name="services_subtitle" defaultValue={initialHome.services_subtitle} className={styles.textarea} rows={2}></textarea>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Llamado a la Acción (Final)</h3>
              <div className={styles.formGroup}>
                <label>Título</label>
                <input type="text" name="cta_title" defaultValue={initialHome.cta_title} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Subtítulo</label>
                <textarea name="cta_subtitle" defaultValue={initialHome.cta_subtitle} className={styles.textarea} rows={2}></textarea>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios de Inicio'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'about' && (
          <form onSubmit={(e) => handleSave(e, 'about')} className={styles.formCard}>
            <h2>Página Sobre Mí</h2>
            
            <div className={styles.section}>
              <h3>Encabezado</h3>
              <div className={styles.formGroup}>
                <label>Título</label>
                <input type="text" name="title" defaultValue={initialAbout.title} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Subtítulo (Ej: Licenciada en Nutrición)</label>
                <input type="text" name="subtitle" defaultValue={initialAbout.subtitle} className={styles.input} />
              </div>
            </div>

            <div className={styles.section}>
              <h3>Contenido (Biografía)</h3>
              <div className={styles.formGroup}>
                <label>Párrafo 1</label>
                <textarea name="paragraph_1" defaultValue={initialAbout.paragraph_1} className={styles.textarea} rows={3}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Párrafo 2</label>
                <textarea name="paragraph_2" defaultValue={initialAbout.paragraph_2} className={styles.textarea} rows={3}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Párrafo 3</label>
                <textarea name="paragraph_3" defaultValue={initialAbout.paragraph_3} className={styles.textarea} rows={3}></textarea>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Multimedia</h3>
              <div className={styles.formGroup}>
                <label>URL de tu foto de perfil</label>
                <input type="url" name="image_url" defaultValue={initialAbout.image_url} className={styles.input} placeholder="https://..." />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios de Sobre Mí'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
