import React from 'react';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import styles from './dashboard.module.css';

export const metadata = {
  title: "Dashboard | Nerina Bruno",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

  const unreadCount = count || 0;
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>N</div>
          <h2>NB Panel</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}><span className={styles.iconWrapper}>📊</span> Resumen</Link>
          <Link href="/dashboard/turnos" className={styles.navLink}><span className={styles.iconWrapper}>📅</span> Turnos (Agenda)</Link>
          <Link href="/dashboard/agenda-movil" className={styles.navLink}><span className={styles.iconWrapper}>📱</span> Agenda en Vivo</Link>
          <Link href="/dashboard/pacientes" className={styles.navLink}><span className={styles.iconWrapper}>👥</span> Pacientes</Link>
          <Link href="/dashboard/recetas" className={styles.navLink}><span className={styles.iconWrapper}>🍎</span> Recetas</Link>
          <Link href="/dashboard/tips" className={styles.navLink}><span className={styles.iconWrapper}>📝</span> Tips (Blog)</Link>
          <Link href="/dashboard/consultas" className={styles.navLink}>
            <span className={styles.iconWrapper}>📩</span> 
            Consultas
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>
          <Link href="/dashboard/configuracion" className={styles.navLink}><span className={styles.iconWrapper}>⚙️</span> Configuración</Link>
        </nav>
        <div className={styles.logoutWrapper}>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>Cerrar sesión</button>
          </form>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
