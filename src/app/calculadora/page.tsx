'use client'

import React, { useState } from 'react';
import { saveLead } from './actions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CalculadoraPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    gender: 'female',
    weight: '',
    height: '',
    age: '',
    activity: '1.2',
    goal: 'maintenance'
  });

  // Lead Data State
  const [leadData, setLeadData] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const calculateTDEE = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseInt(formData.age);
    let bmr = 0;

    if (formData.gender === 'male') {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    let tdee = bmr * parseFloat(formData.activity);

    // Adjust for goal
    if (formData.goal === 'lose') tdee -= 400;
    if (formData.goal === 'gain') tdee += 400;

    return Math.round(tdee);
  };

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tdee = calculateTDEE();
    setResult(tdee);
    setStep(2); // Move to lead capture step
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const calculatedData = {
      ...formData,
      result_calories: result
    };

    const response = await saveLead(leadData.name, leadData.email, calculatedData);

    if (response.success) {
      setStep(3); // Show results
    } else {
      alert(`Hubo un problema al guardar tus datos: ${response.error}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: '#fdfbf7', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '2rem', textAlign: 'center', color: 'white' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>Calculadora Nutricional</h1>
            <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Descubrí cuántas calorías necesitás por día</p>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* STEP 1: CALCULATOR FORM */}
            {step === 1 && (
              <form onSubmit={handleCalculateSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Género</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <option value="female">Femenino</option>
                      <option value="male">Masculino</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Edad (años)</label>
                    <input type="number" name="age" required min="15" max="100" value={formData.age} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Peso (kg)</label>
                    <input type="number" name="weight" required min="30" max="250" value={formData.weight} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Altura (cm)</label>
                    <input type="number" name="height" required min="100" max="220" value={formData.height} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Nivel de Actividad Física</label>
                  <select name="activity" value={formData.activity} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <option value="1.2">Sedentario (Poco o ningún ejercicio)</option>
                    <option value="1.375">Ligero (Ejercicio ligero 1-3 días a la semana)</option>
                    <option value="1.55">Moderado (Ejercicio moderado 3-5 días a la semana)</option>
                    <option value="1.725">Activo (Ejercicio fuerte 6-7 días a la semana)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>¿Cuál es tu objetivo?</label>
                  <select name="goal" value={formData.goal} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <option value="lose">Perder Grasa / Bajar de peso</option>
                    <option value="maintenance">Mantenimiento Saludable</option>
                    <option value="gain">Aumentar Masa Muscular</option>
                  </select>
                </div>

                <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-tertiary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>
                  Calcular mis Requerimientos
                </button>
              </form>
            )}

            {/* STEP 2: LEAD CAPTURE GATE */}
            {step === 2 && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '1rem' }}>¡Tus resultados están listos!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Dejanos tu nombre y correo para enviártelos y desbloquear tu resultado en pantalla.</p>
                
                <form onSubmit={handleLeadSubmit}>
                  <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre</label>
                    <input type="text" name="name" required value={leadData.name} onChange={handleLeadChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo Electrónico</label>
                    <input type="email" name="email" required value={leadData.email} onChange={handleLeadChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-tertiary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Calculando...' : 'Ver mis resultados ahora'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: RESULTS */}
            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Hola, {leadData.name}</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Tu requerimiento calórico diario estimado para tu objetivo es de:</p>
                
                <div style={{ backgroundColor: '#f1f5f2', border: '2px solid var(--color-primary)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{result}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>Kcal / día</span>
                </div>

                <div style={{ backgroundColor: 'var(--color-quaternary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--color-tertiary)', margin: '0 0 0.5rem 0' }}>💡 Recordá:</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                    Esta calculadora te da un <strong>estimado general</strong> basado en fórmulas matemáticas. No tiene en cuenta tus patologías, gustos, composición corporal real ni relación con la comida. 
                  </p>
                </div>

                <a href="/turnos" style={{ display: 'inline-block', width: '100%', padding: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
                  Reservar un Turno Personalizado
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
