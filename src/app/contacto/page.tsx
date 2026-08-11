import Button from "@/components/Button";
import Card from "@/components/Card";
import styles from "./page.module.css";

export const metadata = {
  title: "Contacto | Nerina Bruno",
  description: "Ponete en contacto para reservar un turno, hacer una consulta o sumarte a mis programas de nutrición.",
};

export default function Contacto() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Contacto</h1>
          <p className={styles.subtitle}>
            ¿Lista/o para empezar? Dejame tu mensaje y me pondré en contacto con vos a la brevedad.
          </p>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Contact Form */}
            <Card className={styles.formCard}>
              <h2 className={styles.formTitle}>Dejanos tu consulta</h2>
              <form className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.label}>Nombre completo</label>
                  <input type="text" id="name" className={styles.input} placeholder="Tu nombre" required />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" className={styles.input} placeholder="tu@email.com" required />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="reason" className={styles.label}>Motivo de consulta</label>
                  <select id="reason" className={styles.input} required>
                    <option value="">Seleccioná un motivo</option>
                    <option value="turno">Quiero reservar un turno</option>
                    <option value="duda">Tengo una duda sobre los servicios</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="message" className={styles.label}>Mensaje</label>
                  <textarea id="message" rows={5} className={styles.textarea} placeholder="Escribí tu mensaje acá..." required></textarea>
                </div>
                
                <Button type="submit" variant="primary" className={styles.submitBtn}>
                  Enviar Mensaje
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className={styles.infoCol}>
              <Card className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Otras vías de contacto</h3>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📱</span>
                  <div>
                    <p className={styles.infoLabel}>WhatsApp</p>
                    <a href="https://wa.me/123456789" className={styles.infoValue}>+54 9 11 1234-5678</a>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>✉️</span>
                  <div>
                    <p className={styles.infoLabel}>Email</p>
                    <a href="mailto:hola@nerinabruno.com" className={styles.infoValue}>hola@nerinabruno.com</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📸</span>
                  <div>
                    <p className={styles.infoLabel}>Instagram</p>
                    <a href="https://instagram.com" className={styles.infoValue}>@nerinabruno.nutri</a>
                  </div>
                </div>
              </Card>

              <Card className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Modalidad de atención</h3>
                <p className={styles.infoText}>
                  Actualmente brindo atención <strong>100% online</strong> a través de videollamada para que puedas sumarte desde donde estés.
                </p>
              </Card>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
