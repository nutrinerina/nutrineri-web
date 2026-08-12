import React from 'react';
import { createClient } from '@/utils/supabase/server';
import ConfiguracionClient from '@/components/ConfiguracionClient';

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  
  const { data: configs } = await supabase
    .from('site_content')
    .select('*');

  // Si no hay configuración inicializada, devolvemos arrays vacíos o placeholders
  const homeConfig = configs?.find(c => c.page_id === 'home')?.content || {};
  const aboutConfig = configs?.find(c => c.page_id === 'about')?.content || {};
  const servicesConfig = configs?.find(c => c.page_id === 'services')?.content || {};

  return (
    <div>
      <ConfiguracionClient 
        initialHome={homeConfig}
        initialAbout={aboutConfig}
        initialServices={servicesConfig}
      />
    </div>
  );
}
