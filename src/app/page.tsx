import Image from "next/image";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";

export default async function Home() {
  const supabase = await createClient();
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('page_id', 'home')
    .single();

  const content = siteContent?.content || {
    hero_title: "Nutrición que transforma hábitos y mejora tu vida.",
    hero_subtitle: "Te acompaño a construir una alimentación saludable, realista y adaptada a vos. Sin dietas restrictivas, con educación y consciencia.",
    services_title: "¿Cómo te puedo ayudar?",
    services_subtitle: "Espacios pensados para lograr tus objetivos de forma sostenible.",
    cta_title: "¿Querés empezar a sentirte mejor?",
    cta_subtitle: "Da el primer paso hacia una vida más saludable. Estoy acá para acompañarte en el proceso."
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {content.hero_title}
          </h1>
          <p className={styles.subtitle}>
            {content.hero_subtitle}
          </p>
          <div className={styles.actions}>
            <Button href="/servicios" variant="primary" size="lg">Conocé mis servicios</Button>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button href="/turnos" variant="primary" size="lg">Reservar turno</Button>
              <Button href="/contacto" variant="outline" size="lg">Contacto</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{content.services_title}</h2>
            <p className={styles.sectionSubtitle}>{content.services_subtitle}</p>
          </div>
          
          <div className={styles.grid}>
            <Card hoverable className={styles.card}>
              <div className={styles.iconWrapper}>🍏</div>
              <h3 className={styles.cardTitle}>Consulta Nutricional</h3>
              <p className={styles.cardText}>Evaluación completa, diagnóstico y armado de estrategia personalizada según tus necesidades.</p>
              <Button href="/servicios" variant="text" className={styles.cardLink}>Conocer más →</Button>
            </Card>

            <Card hoverable className={styles.card}>
              <div className={styles.iconWrapper}>📝</div>
              <h3 className={styles.cardTitle}>Plan Personalizado</h3>
              <p className={styles.cardText}>Esquema de alimentación adaptado a tu estilo de vida, preferencias y objetivos reales.</p>
              <Button href="/servicios" variant="text" className={styles.cardLink}>Conocer más →</Button>
            </Card>

            <Card hoverable className={styles.card}>
              <div className={styles.iconWrapper}>🌱</div>
              <h3 className={styles.cardTitle}>Educación Alimentaria</h3>
              <p className={styles.cardText}>Aprende a comer sin culpas. Herramientas para que seas independiente en tus elecciones.</p>
              <Button href="/servicios" variant="text" className={styles.cardLink}>Conocer más →</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>{content.cta_title}</h2>
          <p className={styles.ctaSubtitle}>{content.cta_subtitle}</p>
          <Button href="/contacto" variant="primary" size="lg">Reservar mi turno</Button>
        </div>
      </section>
    </div>
  );
}
