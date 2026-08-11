import React from 'react';
import styles from './TipCard.module.css';
import Link from 'next/link';

interface TipCardProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
}

export default function TipCard({ id, title, summary, imageUrl, category, date }: TipCardProps) {
  return (
    <Link href={`/tips/${id}`} className={styles.card}>
      <div 
        className={styles.imageBox}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <span className={styles.categoryBadge}>{category}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.date}>{date}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
        <span className={styles.readMore}>Leer artículo &rarr;</span>
      </div>
    </Link>
  );
}
