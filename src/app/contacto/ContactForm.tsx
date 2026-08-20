'use client'

import { useState } from 'react'
import Button from "@/components/Button"
import styles from "./page.module.css"
import { submitConsultation } from "./actions"

export default function ContactForm({ initialReason = "" }: { initialReason?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleAction(formData: FormData) {
    setStatus('loading')
    setErrorMessage('')
    
    const result = await submitConsultation(formData)
    
    if (result?.error) {
      setStatus('error')
      setErrorMessage(result.error)
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>¡Consulta enviada!</h3>
        <p>Gracias por escribirme.</p>
        <div style={{ marginTop: '1rem' }}>
          <Button onClick={() => setStatus('idle')} variant="outline">
            Enviar otra consulta
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form action={handleAction} className={styles.form}>
      {status === 'error' && (
        <div style={{ backgroundColor: 'var(--error-light, #ffebee)', color: 'var(--error, #c62828)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {errorMessage}
        </div>
      )}
      
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Nombre completo</label>
        <input type="text" id="name" name="name" className={styles.input} placeholder="Tu nombre" required />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Email (Opcional)</label>
        <input type="text" id="email" name="email" className={styles.input} placeholder="tu@email.com" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone" className={styles.label}>Celular</label>
        <input type="tel" id="phone" name="phone" className={styles.input} placeholder="Ej: 11 2345-6789" required />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="reason" className={styles.label}>Motivo de consulta</label>
        <select id="reason" name="reason" className={styles.input} defaultValue={initialReason} required>
          <option value="">Seleccioná un motivo</option>
          <option value="Consulta Nutricional Inicial">Consulta Nutricional Inicial</option>
          <option value="Plan Alimentario Personalizado">Plan Alimentario Personalizado</option>
          <option value="Seguimiento y Control">Seguimiento y Control</option>
          <option value="Educación Alimentaria">Educación Alimentaria</option>
          <option value="turno">Quiero reservar un turno</option>
          <option value="duda">Tengo una duda sobre los servicios</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="message" className={styles.label}>Mensaje</label>
        <textarea id="message" name="message" rows={5} className={styles.textarea} placeholder="Escribí tu mensaje acá..." required></textarea>
      </div>
      
      <Button type="submit" variant="primary" className={styles.submitBtn} disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
    </form>
  )
}
