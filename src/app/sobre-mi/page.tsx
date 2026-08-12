import Image from "next/image";
import Button from "@/components/Button";
import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";

export const metadata = {
  title: "Sobre Mí | Nerina Bruno",
  description: "Conocé mi enfoque sobre la nutrición, basado en hábitos reales, bienestar integral y educación alimentaria sin dietas restrictivas.",
};

export default async function SobreMi() {
  const supabase = await createClient();
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('page_id', 'about')
    .single();

  const content = siteContent?.content || {
    title: "Hola, soy Nerina Bruno",
    subtitle: "Licenciada en Nutrición",
    paragraph_1: "Creo firmemente que la nutrición no debe ser sinónimo de restricción, culpa ni reglas inquebrantables. Mi objetivo es acompañarte a construir una relación más sana con la comida.",
    paragraph_2: "En mi espacio vas a encontrar un enfoque centrado en educación alimentaria, hábitos posibles y bienestar integral. No trabajo con dietas de moda ni con métodos que te generen estrés.",
    paragraph_3: "Cada persona tiene su propio ritmo, gustos y rutinas. Por eso, mis tratamientos se adaptan a vos, y no al revés. Te brindo las herramientas necesarias para que aprendas a elegir, combinar y disfrutar de todos los alimentos.",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop"
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div 
              className={styles.imagePlaceholder}
              style={content.image_url ? { backgroundImage: `url(${content.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
            >
              {/* Fallback text si no hay imagen */}
              <span>[Imagen de Nerina]</span>
            </div>
          </div>
          
          <div className={styles.textCol}>
            <h1 className={styles.title}>{content.title}</h1>
            <h2 className={styles.subtitle}>{content.subtitle}</h2>
            
            <div className={styles.content}>
              <p>{content.paragraph_1}</p>
              <p>{content.paragraph_2}</p>
              <p>{content.paragraph_3}</p>
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
