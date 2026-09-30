import React from 'react';

export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid var(--dash-border)', 
        borderTop: '4px solid var(--dash-primary)', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: 'var(--dash-text-muted)', fontWeight: 500 }}>Cargando panel...</p>
    </div>
  );
}
