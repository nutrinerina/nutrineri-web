'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import styles from './DashboardCharts.module.css';

interface DashboardChartsProps {
  monthlyPatients: { month: string; count: number }[];
  modalityData: { name: string; value: number }[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function DashboardCharts({ monthlyPatients, modalityData }: DashboardChartsProps) {
  return (
    <div className={styles.chartsContainer}>
      <div className={styles.chartCard}>
        <h3>Pacientes Nuevos (Últimos 6 meses)</h3>
        <div className={styles.chartWrapper}>
          {monthlyPatients.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPatients} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{fill: '#6b7280', fontSize: 12}} axisLine={{stroke: '#d1d5db'}} tickLine={false} />
                <YAxis allowDecimals={false} tick={{fill: '#6b7280', fontSize: 12}} axisLine={{stroke: '#d1d5db'}} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="count" name="Nuevos Pacientes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>No hay datos suficientes</div>
          )}
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3>Modalidad de Turnos</h3>
        <div className={styles.chartWrapper}>
          {modalityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modalityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>No hay datos suficientes</div>
          )}
        </div>
      </div>
    </div>
  );
}
