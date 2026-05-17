import { NextResponse } from 'next/server';
import { buildMetricsPayload } from '@/lib/metrics';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const payload = await buildMetricsPayload();
    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar métricas';
    console.error('[GET /api/metrics]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
