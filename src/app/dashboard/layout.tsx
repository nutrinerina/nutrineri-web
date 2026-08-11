import React from 'react';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import styles from './dashboard.module.css';

export const metadata = {
  title: "Dashboard | Nerina Bruno",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2>NB Panel</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Resumen</Link>
          <Link href="/dashboard/pacientes" className={styles.navLink}>Pacientes</Link>
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
