import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { fetchLeads, updateLeadStatus, LEADS_CACHE_TAG } from '@/lib/services/supabase';
import { getUser } from '@/lib/auth';
import type { LeadStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  // Lista de leads expõe PII (email/telefone) — restrita a admin (LGPD: minimização).
  // Viewers acessam só métricas agregadas via /api/metrics.
  if (user.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  try {
    const leads = await fetchLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar leads';
    console.error('[GET /api/leads]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const VALID_STATUS: LeadStatus[] = ['novo', 'em_atendimento', 'qualificado', 'enviado_para_equipe'];

export async function PATCH(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const { id, status } = body as { id?: string; status?: string };
    if (!id || !status || !VALID_STATUS.includes(status as LeadStatus)) {
      return NextResponse.json({ error: 'Parâmetros inválidos: id e status são obrigatórios.' }, { status: 400 });
    }
    await updateLeadStatus(id, status as LeadStatus);
    // Invalida o cache de fetchLeads pra próxima leitura refletir a mudança.
    revalidateTag(LEADS_CACHE_TAG);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar lead';
    console.error('[PATCH /api/leads]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
