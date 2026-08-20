"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

const ALIMENTOS_DB = [
  // Carnes y Proteínas
  { id: 1, nombre: 'Asado (Tira, magro)', porcion: '100g', calorias: 250, carbohidratos: 0, proteinas: 26, grasas: 15 },
  { id: 2, nombre: 'Vacío (Carne de vaca)', porcion: '100g', calorias: 220, carbohidratos: 0, proteinas: 28, grasas: 11 },
  { id: 3, nombre: 'Milanesa de Carne (Frita)', porcion: '100g', calorias: 320, carbohidratos: 20, proteinas: 18, grasas: 18 },
  { id: 4, nombre: 'Milanesa de Carne (Al horno)', porcion: '100g', calorias: 240, carbohidratos: 22, proteinas: 20, grasas: 7 },
  { id: 5, nombre: 'Pechuga de Pollo (Plancha)', porcion: '100g', calorias: 165, carbohidratos: 0, proteinas: 31, grasas: 3.6 },
  { id: 6, nombre: 'Milanesa de Soja', porcion: '1 unidad', calorias: 180, carbohidratos: 22, proteinas: 14, grasas: 5 },
  { id: 7, nombre: 'Chorizo (Choripán, solo carne)', porcion: '100g', calorias: 340, carbohidratos: 1, proteinas: 14, grasas: 30 },
  { id: 8, nombre: 'Merluza (Filet al horno)', porcion: '100g', calorias: 90, carbohidratos: 0, proteinas: 19, grasas: 1.5 },
  { id: 9, nombre: 'Huevo (Duro)', porcion: '1 unidad (grande)', calorias: 78, carbohidratos: 0.6, proteinas: 6.3, grasas: 5.3 },
  { id: 10, nombre: 'Lentejas (Cocidas)', porcion: '100g', calorias: 116, carbohidratos: 20, proteinas: 9, grasas: 0.4 },
  
  // Panificados y Cereales
  { id: 11, nombre: 'Pan Francés (Flauta)', porcion: '100g (aprox 2 rebanadas gruesas)', calorias: 270, carbohidratos: 55, proteinas: 9, grasas: 1.5 },
  { id: 12, nombre: 'Pan de Miga (Blanco)', porcion: '2 rebanadas', calorias: 140, carbohidratos: 26, proteinas: 4, grasas: 2 },
  { id: 13, nombre: 'Medialuna de Manteca', porcion: '1 unidad', calorias: 180, carbohidratos: 20, proteinas: 3, grasas: 9 },
  { id: 14, nombre: 'Medialuna de Grasa', porcion: '1 unidad', calorias: 160, carbohidratos: 18, proteinas: 3, grasas: 8 },
  { id: 15, nombre: 'Bizcochitos de Grasa', porcion: '50g', calorias: 240, carbohidratos: 25, proteinas: 4, grasas: 14 },
  { id: 16, nombre: 'Torta Frita', porcion: '1 unidad regular', calorias: 250, carbohidratos: 25, proteinas: 4, grasas: 15 },
  { id: 17, nombre: 'Chipá', porcion: '50g (aprox 2 chicos)', calorias: 175, carbohidratos: 16, proteinas: 5, grasas: 10 },
  { id: 18, nombre: 'Galletitas de Agua (Express/Criollitas)', porcion: '5 unidades', calorias: 110, carbohidratos: 18, proteinas: 3, grasas: 3 },
  { id: 19, nombre: 'Fideos Secos (Cocidos)', porcion: '100g', calorias: 130, carbohidratos: 25, proteinas: 5, grasas: 0.5 },
  { id: 20, nombre: 'Arroz Blanco (Cocido)', porcion: '100g', calorias: 130, carbohidratos: 28, proteinas: 2.7, grasas: 0.3 },
  { id: 21, nombre: 'Ñoquis de Papa (Sin salsa)', porcion: '100g', calorias: 150, carbohidratos: 30, proteinas: 4, grasas: 1 },
  { id: 22, nombre: 'Avena (Hojuelas secas)', porcion: '50g', calorias: 194, carbohidratos: 34, proteinas: 6.7, grasas: 3.5 },
  
  // Platos Típicos (Aproximaciones)
  { id: 23, nombre: 'Empanada de Carne (Al horno)', porcion: '1 unidad', calorias: 220, carbohidratos: 20, proteinas: 10, grasas: 11 },
  { id: 24, nombre: 'Empanada de Jamón y Queso (Al horno)', porcion: '1 unidad', calorias: 240, carbohidratos: 22, proteinas: 10, grasas: 12 },
  { id: 25, nombre: 'Pizza de Muzzarella (Masa gruesa)', porcion: '1 porción', calorias: 280, carbohidratos: 30, proteinas: 12, grasas: 12 },
  { id: 26, nombre: 'Tarta de Jamón y Queso', porcion: '1 porción', calorias: 310, carbohidratos: 25, proteinas: 14, grasas: 17 },
  { id: 27, nombre: 'Tarta de Verdura (Pascualina)', porcion: '1 porción', calorias: 220, carbohidratos: 22, proteinas: 8, grasas: 11 },
  { id: 28, nombre: 'Sanguche de Miga (Jamón y Queso)', porcion: '1 unidad simple', calorias: 210, carbohidratos: 25, proteinas: 9, grasas: 8 },
  
  // Lácteos y Fiambres
  { id: 29, nombre: 'Dulce de Leche', porcion: '1 cucharada (20g)', calorias: 60, carbohidratos: 11, proteinas: 1.5, grasas: 1 },
  { id: 30, nombre: 'Queso Mantecoso / Cremoso', porcion: '50g', calorias: 160, carbohidratos: 1, proteinas: 9, grasas: 13 },
  { id: 31, nombre: 'Queso Provolone', porcion: '50g', calorias: 175, carbohidratos: 1, proteinas: 12, grasas: 13 },
  { id: 32, nombre: 'Queso Untable Clásico', porcion: '1 cucharada (20g)', calorias: 50, carbohidratos: 1, proteinas: 2, grasas: 4 },
  { id: 33, nombre: 'Jamón Cocido', porcion: '50g', calorias: 55, carbohidratos: 0.5, proteinas: 9, grasas: 2 },
  { id: 34, nombre: 'Salame', porcion: '50g', calorias: 210, carbohidratos: 1, proteinas: 11, grasas: 18 },
  { id: 35, nombre: 'Leche Entera', porcion: '1 taza (200ml)', calorias: 120, carbohidratos: 10, proteinas: 6, grasas: 6 },
  { id: 36, nombre: 'Yogur Bebible Entero', porcion: '1 vaso (200ml)', calorias: 140, carbohidratos: 18, proteinas: 6, grasas: 5 },
  
  // Verduras y Hortalizas
  { id: 37, nombre: 'Papa (Hervida)', porcion: '100g', calorias: 86, carbohidratos: 20, proteinas: 1.7, grasas: 0.1 },
  { id: 38, nombre: 'Batata (Al horno)', porcion: '100g', calorias: 115, carbohidratos: 26, proteinas: 2, grasas: 0.2 },
  { id: 39, nombre: 'Zapallo Anco (Hervido)', porcion: '100g', calorias: 35, carbohidratos: 8, proteinas: 1, grasas: 0.1 },
  { id: 40, nombre: 'Choclo (Hervido)', porcion: '100g', calorias: 86, carbohidratos: 19, proteinas: 3.2, grasas: 1.2 },
  { id: 41, nombre: 'Tomate', porcion: '1 unidad media (150g)', calorias: 27, carbohidratos: 6, proteinas: 1.3, grasas: 0.3 },
  { id: 42, nombre: 'Lechuga', porcion: '1 porción abundante (50g)', calorias: 8, carbohidratos: 1.5, proteinas: 0.7, grasas: 0.1 },
  { id: 43, nombre: 'Cebolla', porcion: '100g', calorias: 40, carbohidratos: 9, proteinas: 1.1, grasas: 0.1 },
  { id: 55, nombre: 'Brócoli (Hervido/Vapor)', porcion: '100g', calorias: 35, carbohidratos: 7, proteinas: 2.8, grasas: 0.4 },
  { id: 56, nombre: 'Espinaca (Cocida)', porcion: '100g', calorias: 23, carbohidratos: 3.8, proteinas: 3, grasas: 0.3 },
  { id: 57, nombre: 'Zanahoria (Cruda/Rallada)', porcion: '1 unidad media (60g)', calorias: 25, carbohidratos: 6, proteinas: 0.6, grasas: 0.1 },
  { id: 58, nombre: 'Zapallito / Zucchini (Cocido)', porcion: '100g', calorias: 15, carbohidratos: 3, proteinas: 1.1, grasas: 0.4 },
  { id: 59, nombre: 'Berenjena (Al horno/Plancha)', porcion: '100g', calorias: 25, carbohidratos: 6, proteinas: 1, grasas: 0.2 },
  { id: 60, nombre: 'Rúcula', porcion: '1 taza (20g)', calorias: 5, carbohidratos: 0.7, proteinas: 0.5, grasas: 0.1 },
  { id: 61, nombre: 'Morrón (Pimiento, cualquier color)', porcion: '1 unidad media (100g)', calorias: 26, carbohidratos: 6, proteinas: 1, grasas: 0.3 },
  
  // Frutas y Otros
  { id: 44, nombre: 'Banana', porcion: '1 unidad media', calorias: 105, carbohidratos: 27, proteinas: 1.3, grasas: 0.3 },
  { id: 45, nombre: 'Manzana', porcion: '1 unidad media', calorias: 95, carbohidratos: 25, proteinas: 0.5, grasas: 0.3 },
  { id: 46, nombre: 'Naranja', porcion: '1 unidad media', calorias: 62, carbohidratos: 15, proteinas: 1.2, grasas: 0.2 },
  { id: 47, nombre: 'Mandarina', porcion: '1 unidad media', calorias: 47, carbohidratos: 12, proteinas: 0.8, grasas: 0.1 },
  { id: 48, nombre: 'Palta (Aguacate)', porcion: '100g', calorias: 160, carbohidratos: 8.5, proteinas: 2, grasas: 14.7 },
  { id: 49, nombre: 'Almendras / Nueces', porcion: 'Puñado (30g)', calorias: 180, carbohidratos: 6, proteinas: 6, grasas: 16 },
  
  // Dulces e Infusiones
  { id: 50, nombre: 'Alfajor de Maicena', porcion: '1 unidad regular', calorias: 290, carbohidratos: 45, proteinas: 4, grasas: 10 },
  { id: 51, nombre: 'Alfajor Bañado en Chocolate', porcion: '1 unidad (50g)', calorias: 230, carbohidratos: 35, proteinas: 3, grasas: 9 },
  { id: 52, nombre: 'Flan Casero', porcion: '1 porción (100g)', calorias: 140, carbohidratos: 22, proteinas: 4, grasas: 4 },
  { id: 53, nombre: 'Yerba Mate (Infusión sin azúcar)', porcion: '1 mate cebado', calorias: 5, carbohidratos: 1, proteinas: 0, grasas: 0 },
  { id: 54, nombre: 'Polenta (Cocida sin queso)', porcion: '100g', calorias: 70, carbohidratos: 15, proteinas: 2, grasas: 0.2 }
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
