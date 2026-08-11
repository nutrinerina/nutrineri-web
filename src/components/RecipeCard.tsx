import React from 'react';
import Link from 'next/link';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  id: string;
  title: string;
  difficulty: string;
  prepTime: number;
  imageUrl?: string;
}

export default function RecipeCard({ id, title, difficulty, prepTime, imageUrl }: RecipeCardProps) {
  return (
    <Link href={`/recetas/${id}`} className={styles.card}>
      <div 
        className={styles.imageBox} 
        style={{ backgroundImage: `url(${imageUrl || ''})`, backgroundColor: 'var(--color-quaternary)' }}
      >
        {/* Placeholder if no image */}
        {!imageUrl && <span className={styles.placeholderIcon}>🍽️</span>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.icon}>⏱️</span> {difficulty}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.icon}>🕒</span> {prepTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
