import { NextResponse } from 'next/server';
import { fetchLeads, updateLeadStatus } from '@/lib/services/supabase';
import type { LeadStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = await fetchLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar leads';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const VALID_STATUS: LeadStatus[] = ['novo', 'em_atendimento', 'qualificado', 'enviado_para_equipe'];

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body as { id?: string; status?: string };
    if (!id || !status || !VALID_STATUS.includes(status as LeadStatus)) {
      return NextResponse.json({ error: 'Parâmetros inválidos: id e status são obrigatórios.' }, { status: 400 });
    }
    await updateLeadStatus(id, status as LeadStatus);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar lead';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
