import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import styles from '@/app/dashboard/dashboard.module.css';

export const metadata = {
  title: "Mi Portal | Nutrineri",
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/portal/login');
  }

  // Find the patient linked to this user's email
  const { data: patient } = await supabase
    .from('patients')
    .select('first_name, last_name')
    .eq('email', user.email)
    .single();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>🌿</div>
          <h2>Mi Portal</h2>
        </div>
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Hola, {patient?.first_name || 'Paciente'}
        </div>
        <nav className={styles.nav}>
          <Link href="/portal" className={styles.navLink}><span className={styles.iconWrapper}>📊</span> Mi Evolución</Link>
          <Link href="/portal/mi-plan" className={styles.navLink}><span className={styles.iconWrapper}>🍏</span> Mi Plan Nutricional</Link>
        </nav>
        <div className={styles.logoutWrapper}>
          <form action={async () => {
            'use server';
            const supabase = await createClient();
            await supabase.auth.signOut();
            redirect('/portal/login');
          }}>
            <button type="submit" className={styles.logoutBtn}>Cerrar sesión</button>
          </form>
        </div>
      </aside>
      
      <main className={styles.mainContent} style={{ backgroundColor: '#fff' }}>
        {children}
      </main>
    </div>
  );
}
