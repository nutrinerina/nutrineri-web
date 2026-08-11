import Image from "next/image";
import Button from "@/components/Button";
import styles from "./page.module.css";

export const metadata = {
  title: "Sobre Mí | Nerina Bruno",
  description: "Conocé mi enfoque sobre la nutrición, basado en hábitos reales, bienestar integral y educación alimentaria sin dietas restrictivas.",
};

export default function SobreMi() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imagePlaceholder}>
              {/* Future: Real Image of Nerina */}
              <span>[Imagen de Nerina]</span>
            </div>
          </div>
          
          <div className={styles.textCol}>
            <h1 className={styles.title}>Hola, soy Nerina Bruno</h1>
            <h2 className={styles.subtitle}>Licenciada en Nutrición</h2>
            
            <div className={styles.content}>
              <p>
                Creo firmemente que la nutrición no debe ser sinónimo de restricción, culpa ni reglas inquebrantables. Mi objetivo es acompañarte a construir una relación más sana con la comida.
              </p>
              <p>
                En mi espacio vas a encontrar un enfoque centrado en <strong>educación alimentaria, hábitos posibles y bienestar integral</strong>. No trabajo con dietas de moda ni con métodos que te generen estrés.
              </p>
              <p>
                Cada persona tiene su propio ritmo, gustos y rutinas. Por eso, mis tratamientos se adaptan a vos, y no al revés. Te brindo las herramientas necesarias para que aprendas a elegir, combinar y disfrutar de todos los alimentos.
              </p>
            </div>
            
            <div className={styles.actions}>
              <Button href="/contacto" variant="primary" size="lg">Comenzar un tratamiento</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
