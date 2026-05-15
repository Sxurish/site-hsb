import { NextResponse } from 'next/server';
import { buildMetricsPayload } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await buildMetricsPayload();
    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar métricas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
