import React from 'react';
import { createClient } from '@/utils/supabase/server';
import TipsManagerClient from '@/components/TipsManagerClient';

export default async function TipsManagerPage() {
  const supabase = await createClient();
  
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <TipsManagerClient initialTips={tips || []} />
    </div>
  );
}
