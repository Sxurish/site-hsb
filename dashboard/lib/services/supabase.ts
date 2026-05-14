import type { Lead } from '../types';

// Stub para futura integração com Supabase
// Setup:
//   npm install @supabase/supabase-js
//   NEXT_PUBLIC_SUPABASE_URL=... e SUPABASE_SERVICE_ROLE_KEY=... em .env.local
//
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
// );

export async function fetchLeads(): Promise<Lead[]> {
  // TODO: substituir por query real
  // const { data, error } = await supabase
  //   .from('leads')
  //   .select('*')
  //   .order('created_at', { ascending: false });
  // if (error) throw error;
  // return data as Lead[];
  throw new Error('Supabase não configurado. Usando dados mockados.');
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
  // TODO: implementar
  // await supabase.from('leads').update({ status }).eq('id', id);
  void id; void status;
  throw new Error('Supabase não configurado.');
}

export async function fetchMetrics(): Promise<Record<string, number>> {
  // TODO: implementar consultas de métricas agrupadas
  throw new Error('Supabase não configurado.');
}
