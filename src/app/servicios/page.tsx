import Button from "@/components/Button";
import Card from "@/components/Card";
import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";

export const metadata = {
  title: "Servicios | Nerina Bruno",
  description: "Conocé mis servicios de nutrición: consultas personalizadas, educación alimentaria y acompañamiento nutricional.",
};

export default async function Servicios() {
  const supabase = await createClient();
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('page_id', 'services')
    .single();

  const content = siteContent?.content || {
    header_title: "Mis Servicios",
    header_subtitle: "Espacios diseñados para acompañarte en la construcción de hábitos saludables, a tu propio ritmo.",
    items: [
      {
        icon: "🍏",
        title: "Consulta Nutricional Inicial",
        description: "Nuestra primera reunión. Haremos una evaluación completa de tus hábitos, antecedentes, rutina y objetivos. A partir de acá diseñaremos tu estrategia.",
        benefits: ["Evaluación antropométrica", "Análisis de rutina y gustos", "Definición de objetivos"]
      },
      {
        icon: "📝",
        title: "Plan Alimentario Personalizado",
        description: "Armado de un esquema adaptado a tu estilo de vida. Sin dietas estrictas ni alimentos prohibidos.",
        benefits: ["Adaptado a tus gustos", "Opciones de reemplazos", "Ideas de menús"]
      },
      {
        icon: "🌱",
        title: "Seguimiento y Control",
        description: "Consultas periódicas para evaluar la evolución, ajustar el plan y resolver dudas. El acompañamiento es clave para sostener el hábito.",
        benefits: ["Ajuste de objetivos", "Resolución de dudas", "Evaluación de progreso"]
      },
      {
        icon: "🎓",
        title: "Educación Alimentaria",
        description: "Aprendé a comer mejor y de forma inteligente. Herramientas prácticas para organizarte y tomar mejores decisiones.",
        benefits: ["Lectura de etiquetas", "Organización (Batch cooking)", "Manejo de porciones"]
      }
    ]
  };

  const servicios = content.items || [];

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>{content.header_title}</h1>
          <p className={styles.subtitle}>
            {content.header_subtitle}
          </p>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {servicios.map((s: any, index: number) => (
              <Card key={index} className={styles.card}>
                <div className={styles.iconWrapper}>{s.icon}</div>
                <h2 className={styles.cardTitle}>{s.title}</h2>
                <p className={styles.cardDescription}>{s.description}</p>
                <ul className={styles.benefitsList}>
                  {s.benefits?.map((b: string, i: number) => (
                    <li key={i}>✓ {b}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', width: '100%', marginTop: 'auto', paddingTop: '1rem' }}>
                  <Button href="/turnos" variant="primary" className={styles.ctaButton}>
                    Reservar turno
                  </Button>
                  <Button href={`/contacto?motivo=${encodeURIComponent(s.title)}`} variant="outline" className={styles.ctaButton}>
                    Consulta
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
