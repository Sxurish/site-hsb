import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// INTEGRAÇÃO SUPABASE + NOTION (Via n8n)
// ==========================================
/*
  Arquitetura recomendada:
  1. O Chatbot (Widget) envia os dados (Lead) para a rota `/api/chat`.
  2. A rota `/api/chat` envia para o Webhook do n8n.
  3. O workflow do n8n processa as informações e salva no Supabase (usando o Node do Supabase no n8n)
  4. Simultaneamente, o n8n salva o Lead no banco de dados do Notion (Node do Notion no n8n).

  Caso precise salvar dados diretamente do Front-end para o Supabase (sem passar pelo n8n),
  você pode usar este client (`supabase`) nas suas funções, exemplo:

  export async function salvarLead(nome: string, email: string) {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nome, email }]);
    return { data, error };
  }
*/
