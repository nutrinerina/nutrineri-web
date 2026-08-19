'use client'

import React, { useState } from 'react';
import styles from './DashboardClients.module.css';

export default function LeadsManagerClient({ initialLeads }: { initialLeads: any[] }) {
  const [leads] = useState(initialLeads);

  const downloadCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Fecha', 'Nombre', 'Email', 'Objetivo', 'Calorías Calculadas'];
    const rows = leads.map(l => {
      const date = new Date(l.created_at).toLocaleDateString();
      const goal = l.result_data?.goal || 'N/A';
      const cals = l.result_data?.result_calories || 'N/A';
      return [date, l.name, l.email, goal, cals].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contactos_calculadora.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Total de contactos: {leads.length}</h3>
        <button 
          onClick={downloadCSV}
          style={{ 
            backgroundColor: 'var(--color-tertiary)', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ⬇️ Exportar CSV
        </button>
      </div>

      {leads.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fdfbf7', borderRadius: '12px', border: '1px dashed #d4a373' }}>
          Todavía no hay contactos captados. Compartí el link de tu calculadora en tus redes para empezar a sumar gente.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eaeaea' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaeaea' }}>
                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600 }}>Fecha</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600 }}>Nombre</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600 }}>Resultado Calculadora</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '1rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '1rem' }}><a href={`mailto:${lead.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{lead.email}</a></td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: 'var(--color-quaternary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                      {lead.result_data?.result_calories} Kcal ({lead.result_data?.goal === 'lose' ? 'Bajar' : lead.result_data?.goal === 'gain' ? 'Aumentar' : 'Mantenimiento'})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
