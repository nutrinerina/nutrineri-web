import React from 'react';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import { LayoutDashboard, Calendar, CalendarDays, Users, Apple, BookOpen, MessageSquare, Magnet, Settings } from 'lucide-react';
import styles from './dashboard.module.css';

export const metadata = {
  title: "Dashboard | Nerina Bruno",
};

export const dynamic = 'force-dynamic';

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
          <Link href="/dashboard" className={styles.navLink}><span className={styles.iconWrapper}><LayoutDashboard size={20} /></span> Resumen</Link>
          <Link href="/dashboard/turnos" className={styles.navLink}><span className={styles.iconWrapper}><Calendar size={20} /></span> Turnos (Agenda)</Link>
          <Link href="/dashboard/pacientes" className={styles.navLink}><span className={styles.iconWrapper}><Users size={20} /></span> Pacientes</Link>
          <Link href="/dashboard/recetas" className={styles.navLink}><span className={styles.iconWrapper}><Apple size={20} /></span> Recetas</Link>
          <Link href="/dashboard/tips" className={styles.navLink}><span className={styles.iconWrapper}><BookOpen size={20} /></span> Tips (Blog)</Link>
          <Link href="/dashboard/consultas" className={styles.navLink}>
            <span className={styles.iconWrapper}><MessageSquare size={20} /></span> 
            Consultas
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>
          <Link href="/dashboard/leads" className={styles.navLink}><span className={styles.iconWrapper}><Magnet size={20} /></span> Contactos</Link>
          <Link href="/dashboard/configuracion" className={styles.navLink}><span className={styles.iconWrapper}><Settings size={20} /></span> Configuración</Link>
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
