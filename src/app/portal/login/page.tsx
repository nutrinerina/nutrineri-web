import React from 'react';
import { loginPatient } from './actions';
import styles from '@/app/login/page.module.css';

export default function PortalLogin() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard} style={{ textAlign: 'center' }}>
        <h1 className={styles.title} style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>Mi Portal</h1>
        <p className={styles.subtitle}>Ingresá con tu correo electrónico para ver tu plan y evolución.</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input id="email" name="email" type="email" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required className={styles.input} />
          </div>
          <button formAction={loginPatient} className={styles.submitBtn} style={{ backgroundColor: 'var(--color-primary)' }}>
            Ingresar al Portal
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          ¿Es tu primera vez? <br/>
          Pedile a la nutricionista que te genere la clave de acceso.
        </p>
      </div>
    </div>
  );
}
