"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

// Base de datos temporal (Mock Data)
const ALIMENTOS_DB = [
  { id: 1, nombre: 'Pechuga de Pollo', porcion: '100g', calorias: 165, carbohidratos: 0, proteinas: 31, grasas: 3.6 },
  { id: 2, nombre: 'Manzana', porcion: '1 unidad (media)', calorias: 95, carbohidratos: 25, proteinas: 0.5, grasas: 0.3 },
  { id: 3, nombre: 'Arroz Blanco (Cocido)', porcion: '100g', calorias: 130, carbohidratos: 28, proteinas: 2.7, grasas: 0.3 },
  { id: 4, mode: 'Palta (Aguacate)', porcion: '100g', calorias: 160, carbohidratos: 8.5, proteinas: 2, grasas: 14.7, nombre: 'Palta (Aguacate)' },
  { id: 5, nombre: 'Huevo (Duro)', porcion: '1 unidad (grande)', calorias: 78, carbohidratos: 0.6, proteinas: 6.3, grasas: 5.3 },
  { id: 6, nombre: 'Avena (Hojuelas)', porcion: '50g', calorias: 194, carbohidratos: 34, proteinas: 6.7, grasas: 3.5 },
  { id: 7, nombre: 'Almendras', porcion: '30g', calorias: 173, carbohidratos: 6, proteinas: 6, grasas: 15 },
  { id: 8, nombre: 'Brócoli (Cocido)', porcion: '100g', calorias: 35, carbohidratos: 7, proteinas: 2.4, grasas: 0.4 },
  { id: 9, nombre: 'Salmón', porcion: '100g', calorias: 208, carbohidratos: 0, proteinas: 20, grasas: 13 },
  { id: 10, nombre: 'Yogur Griego (Natural)', porcion: '150g', calorias: 90, carbohidratos: 6, proteinas: 15, grasas: 0 },
  { id: 11, nombre: 'Pan Integral', porcion: '1 rebanada', calorias: 69, carbohidratos: 12, proteinas: 3.6, grasas: 0.9 },
  { id: 12, nombre: 'Banana', porcion: '1 unidad (media)', calorias: 105, carbohidratos: 27, proteinas: 1.3, grasas: 0.3 },
  { id: 13, nombre: 'Carne Vacuna (Magra)', porcion: '100g', calorias: 250, carbohidratos: 0, proteinas: 26, grasas: 15 },
  { id: 14, nombre: 'Lentejas (Cocidas)', porcion: '100g', calorias: 116, carbohidratos: 20, proteinas: 9, grasas: 0.4 },
  { id: 15, nombre: 'Queso Fresco (Magro)', porcion: '50g', calorias: 115, carbohidratos: 1, proteinas: 9, grasas: 8 }
];

export default function AlimentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAlimentos = ALIMENTOS_DB.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Tabla Nutricional</h1>
        <p>Conocé el perfil nutricional de tus alimentos favoritos y qué porcentaje representan en una dieta promedio de 2000 kcal.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Buscar un alimento... (ej: Pollo, Palta, Avena)" 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Alimento</th>
                <th>Porción</th>
                <th>Calorías (kcal)</th>
                <th>Carbohidratos (g)</th>
                <th>Proteínas (g)</th>
                <th>Grasas (g)</th>
                <th>% de Dieta (2000 kcal)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlimentos.length > 0 ? (
                filteredAlimentos.map(alimento => {
                  const percentage = ((alimento.calorias / 2000) * 100).toFixed(1);
                  return (
                    <tr key={alimento.id} className={styles.tableRow}>
                      <td className={styles.alimentoName}>{alimento.nombre}</td>
                      <td>{alimento.porcion}</td>
                      <td className={styles.macroValue}>{alimento.calorias}</td>
                      <td className={styles.macroValue}>{alimento.carbohidratos}</td>
                      <td className={styles.macroValue}>{alimento.proteinas}</td>
                      <td className={styles.macroValue}>{alimento.grasas}</td>
                      <td className={styles.progressCell}>
                        <div className={styles.progressContainer}>
                          <div className={styles.progressBarBg}>
                            <div 
                              className={styles.progressBarFill} 
                              style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                            ></div>
                          </div>
                          <span className={styles.progressText}>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    No se encontraron alimentos con ese nombre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
