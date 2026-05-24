import { NextResponse } from 'next/server';
import { buildMetricsPayload } from '@/lib/metrics';
import { getUser } from '@/lib/auth';
import { paramsToRange } from '@/lib/date-range';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const range = paramsToRange({
      from: url.searchParams.get('from'),
      to: url.searchParams.get('to'),
      preset: url.searchParams.get('preset'),
    });
    const payload = await buildMetricsPayload(range);
    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar métricas';
    console.error('[GET /api/metrics]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
