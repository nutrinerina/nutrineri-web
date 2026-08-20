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
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>
              {content.hero_title}
            </h1>
            <p className={styles.subtitle}>
              Te acompaño a lograr tus objetivos con un plan alimentario personalizado, basado en ciencia, empatía y resultados.
            </p>
            <div className={styles.actions}>
              <Button href="/servicios" variant="primary" size="md">
                Conocé mis servicios <span style={{ marginLeft: '8px' }}>🍃</span>
              </Button>
              <Button href="/turnos" variant="outline" size="md">
                Reservá tu turno <span style={{ marginLeft: '8px' }}>📅</span>
              </Button>
            </div>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🌱</div>
                <div className={styles.featureText}>Planes personalizados para cada etapa de tu vida</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>💚</div>
                <div className={styles.featureText}>Enfoque integral y realista</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📊</div>
                <div className={styles.featureText}>Seguimiento y resultados</div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.imageWrapper}>
              <Image 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" 
                alt="Ensalada saludable"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className={styles.floatingCard}>
              <div className={styles.quoteIcon}>“</div>
              <div className={styles.quoteText}>Pequeños cambios hoy, grandes resultados mañana.</div>
              <div className={styles.heartIcon}>♡</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>👤</div>
              <h3 className={styles.cardTitle}>Consulta Nutricional</h3>
              <p className={styles.cardText}>Evaluación integral y plan alimentario personalizado.</p>
              <a href="/servicios" className={styles.cardLink}>Más info →</a>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📋</div>
              <h3 className={styles.cardTitle}>Planes Alimentarios</h3>
              <p className={styles.cardText}>Adaptados a tus objetivos, preferencias y estilo de vida.</p>
              <a href="/servicios" className={styles.cardLink}>Más info →</a>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📈</div>
              <h3 className={styles.cardTitle}>Seguimiento y Control</h3>
              <p className={styles.cardText}>Acompañamiento continuo para lograr tus metas.</p>
              <a href="/servicios" className={styles.cardLink}>Más info →</a>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📖</div>
              <h3 className={styles.cardTitle}>Educación Alimentaria</h3>
              <p className={styles.cardText}>Aprendé a comer mejor y tomar decisiones conscientes.</p>
              <a href="/servicios" className={styles.cardLink}>Más info →</a>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>{content.cta_title}</h2>
          <p className={styles.ctaSubtitle}>{content.cta_subtitle}</p>
          <div className={styles.ctaActions}>
            <Button href="/turnos" variant="primary" size="lg">Reservar mi turno</Button>
            <Button href="/contacto" variant="outline" size="lg" style={{ backgroundColor: 'transparent', borderColor: '#ffffff', color: '#ffffff' }}>Contacto</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
