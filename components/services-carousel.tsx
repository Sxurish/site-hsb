'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './services-carousel.module.css';

/* ── Data ──────────────────────────────────────────── */

const SERVICES = [
  {
    id: 'ai', num: '01', tag: 'IA',
    title: 'Automação & IA',
    desc: 'Workflows inteligentes com n8n, assistentes de IA e automações para escalar atendimento, vendas e operações.',
    detail: {
      includes: ['Mapeamento de processos', 'Implementação n8n + APIs', 'Assistentes GPT customizados', 'Integrações com CRM e WhatsApp'],
      audience: 'Operações que lidam com volume alto de leads, atendimento ou tarefas repetitivas.',
      outcome: 'Redução de até 70% em tarefas manuais e SLA de resposta abaixo de 1 minuto.',
    },
  },
  {
    id: 'site', num: '02', tag: 'Design',
    title: 'Sites & Landing Pages',
    desc: 'Sites institucionais, páginas de captura e landing pages premium focadas em conversão.',
    detail: {
      includes: ['UX writing e wireframe', 'Design de alta conversão', 'Desenvolvimento responsivo', 'Integração com analytics e A/B'],
      audience: 'Marcas que precisam de presença digital editorial e páginas que vendem.',
      outcome: 'Aumento médio de 2-3x em conversão de visitantes em leads qualificados.',
    },
  },
  {
    id: 'ads', num: '03', tag: 'Performance',
    title: 'Tráfego Pago',
    desc: 'Estratégias de anúncios em Google Ads, Meta Ads e outras plataformas com foco em performance e crescimento.',
    detail: {
      includes: ['Estratégia de mídia', 'Estrutura de campanhas', 'Criativos e copy', 'Otimização e relatórios semanais'],
      audience: 'Empresas que querem previsibilidade de aquisição e escala controlada.',
      outcome: 'CAC reduzido e ROAS otimizado em ciclos curtos de 30 dias.',
    },
  },
  {
    id: 'social', num: '04', tag: 'Conteúdo',
    title: 'Social Media & Conteúdo',
    desc: 'Planejamento, criação e gestão de conteúdo para fortalecer posicionamento e presença digital.',
    detail: {
      includes: ['Planejamento editorial', 'Roteiro e copy', 'Design e edição', 'Publicação e community'],
      audience: 'Marcas que querem virar referência no seu nicho com consistência.',
      outcome: 'Audiência qualificada, autoridade e geração contínua de demanda inbound.',
    },
  },
  {
    id: 'brand', num: '05', tag: 'Branding',
    title: 'Branding & Identidade Visual',
    desc: 'Construção de marcas, identidade visual, direção criativa e posicionamento premium.',
    detail: {
      includes: ['Estratégia e arquétipos', 'Naming e narrativa', 'Sistema visual completo', 'Brand book e diretrizes'],
      audience: 'Negócios em construção, reposicionamento ou prontos para subir de tier.',
      outcome: 'Marca coerente, percebida como premium e pronta para escalar.',
    },
  },
  {
    id: 'video', num: '06', tag: 'Audiovisual',
    title: 'Produção Audiovisual',
    desc: 'Criação de vídeos, criativos, reels, campanhas visuais e conteúdos para redes sociais.',
    detail: {
      includes: ['Pré-produção e roteiro', 'Captação e direção', 'Edição e motion', 'Pacotes de criativos para mídia'],
      audience: 'Marcas que precisam alimentar mídia paga e orgânica com qualidade cinematográfica.',
      outcome: 'Material que para o feed, gera engajamento e converte em performance.',
    },
  },
  {
    id: 'funnel', num: '07', tag: 'Estratégia',
    title: 'Estratégia Comercial & Funis',
    desc: 'Construção de jornadas, funis de vendas, páginas, automações e estratégias para geração de leads.',
    detail: {
      includes: ['Mapa de jornada', 'Funil top → bottom', 'Páginas e automações', 'Métricas e dashboards'],
      audience: 'Times comerciais que querem máquina de vendas previsível.',
      outcome: 'Pipeline organizado, leads qualificados e taxa de fechamento maior.',
    },
  },
  {
    id: 'consult', num: '08', tag: 'Consultoria',
    title: 'Consultoria Estratégica',
    desc: 'Diagnóstico, planejamento e orientação para empresas que desejam estruturar marketing, vendas e presença digital.',
    detail: {
      includes: ['Diagnóstico 360º', 'Plano de 90 dias', 'Mentoria executiva', 'Acompanhamento mensal'],
      audience: 'Founders e diretores que precisam de clareza estratégica antes de executar.',
      outcome: 'Direção clara, prioridades validadas e roadmap pronto para execução.',
    },
  },
];

/* ── Glyphs ─────────────────────────────────────────── */

function Glyph({ kind }: { kind: string }) {
  const stroke = 'var(--acc)';
  const bone   = 'var(--bone)';
  const mute   = 'rgba(236,228,208,.35)';
  const props  = { width: '100%', height: '100%', viewBox: '0 0 200 200', fill: 'none' as const };

  switch (kind) {
    case 'ai':
      return (
        <svg {...props}>
          <circle cx="100" cy="100" r="78" stroke={mute} strokeWidth="1" />
          <circle cx="100" cy="100" r="50" stroke={mute} strokeWidth="1" />
          <circle cx="100" cy="100" r="22" stroke={bone} strokeWidth="1" />
          <circle cx="178" cy="100" r="3.5" fill={stroke} />
          <circle cx="100" cy="50"  r="2.5" fill={bone} />
          <circle cx="50"  cy="135" r="2.5" fill={bone} />
          <line x1="100" y1="100" x2="178" y2="100" stroke={stroke} strokeWidth="1" />
          <line x1="100" y1="100" x2="100" y2="22"  stroke={mute} strokeWidth="1" strokeDasharray="2 4" />
        </svg>
      );
    case 'site':
      return (
        <svg {...props}>
          <rect x="34" y="34" width="132" height="92" rx="6" stroke={mute} strokeWidth="1" />
          <rect x="48" y="58" width="104" height="92" rx="6" stroke={bone} strokeWidth="1" />
          <rect x="62" y="82" width="76"  height="84" rx="6" stroke={stroke} strokeWidth="1" fill="rgba(212,165,102,.05)" />
          <line x1="62" y1="100" x2="138" y2="100" stroke={stroke} strokeWidth="1" />
          <circle cx="74" cy="91" r="2" fill={stroke} />
        </svg>
      );
    case 'ads':
      return (
        <svg {...props}>
          <line x1="30" y1="170" x2="170" y2="170" stroke={mute} strokeWidth="1" />
          <line x1="30" y1="30"  x2="30"  y2="170" stroke={mute} strokeWidth="1" />
          <path d="M30 150 L70 130 L100 110 L140 70 L170 50"  stroke={bone}   strokeWidth="1"   fill="none" />
          <path d="M30 160 L70 145 L100 130 L140 100 L170 80" stroke={stroke} strokeWidth="1.5" fill="none" />
          <circle cx="170" cy="50" r="4" fill={bone} />
          <circle cx="170" cy="80" r="4" fill={stroke} />
          <path d="M155 65 L170 50 L170 65" stroke={bone} strokeWidth="1" fill="none" />
        </svg>
      );
    case 'social':
      return (
        <svg {...props}>
          {[0,1,2].flatMap(r => [0,1,2].map(c => (
            <rect key={`${r}-${c}`} x={40+c*42} y={40+r*42} width="32" height="32" rx="3"
              stroke={r===1&&c===1 ? stroke : mute}
              fill={r===1&&c===1 ? 'rgba(212,165,102,.12)' : 'transparent'}
              strokeWidth="1" />
          )))}
          <circle cx="56" cy="56" r="2" fill={bone} />
        </svg>
      );
    case 'brand':
      return (
        <svg {...props}>
          <circle cx="100" cy="100" r="60" stroke={mute} strokeWidth="1" />
          <text x="100" y="118" textAnchor="middle" fontFamily="Instrument Serif, serif"
                fontSize="68" fill={bone} fontStyle="italic">H</text>
          <line x1="40" y1="100" x2="60"  y2="100" stroke={stroke} strokeWidth="1" />
          <line x1="140" y1="100" x2="160" y2="100" stroke={stroke} strokeWidth="1" />
          <circle cx="40"  cy="100" r="2" fill={stroke} />
          <circle cx="160" cy="100" r="2" fill={stroke} />
        </svg>
      );
    case 'video':
      return (
        <svg {...props}>
          <circle cx="100" cy="100" r="62" stroke={mute} strokeWidth="1" />
          {[0,60,120,180,240,300].map(a => (
            <line key={a} x1="100" y1="100"
              x2={100 + Math.cos(a*Math.PI/180)*62}
              y2={100 + Math.sin(a*Math.PI/180)*62}
              stroke={a===0 ? stroke : mute} strokeWidth="1" />
          ))}
          <circle cx="100" cy="100" r="18" stroke={bone} strokeWidth="1" fill="rgba(212,165,102,.08)" />
          <circle cx="100" cy="100" r="3"  fill={stroke} />
        </svg>
      );
    case 'funnel':
      return (
        <svg {...props}>
          {Array.from({length:9}).map((_,idx) => {
            const y = 40 + idx*15;
            const w = 130 - idx*12;
            const x = 100 - w/2;
            return <line key={idx} x1={x} y1={y} x2={x+w} y2={y}
              stroke={idx===8 ? stroke : idx>5 ? bone : mute} strokeWidth="1" />;
          })}
          <circle cx="100" cy="170" r="3" fill={stroke} />
        </svg>
      );
    case 'consult':
      return (
        <svg {...props}>
          <line x1="30" y1="100" x2="170" y2="100" stroke={mute} strokeWidth="1" />
          {[40,70,100,130,160].map((x,idx) => (
            <line key={idx} x1={x} y1="95" x2={x} y2="105" stroke={mute} strokeWidth="1" />
          ))}
          <circle cx="100" cy="100" r="22" stroke={bone} strokeWidth="1" />
          <circle cx="100" cy="100" r="6"  fill={stroke} />
          <text x="100" y="60"  textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={mute} letterSpacing="2">DIAGNÓSTICO</text>
          <text x="100" y="148" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={mute} letterSpacing="2">PLANO</text>
        </svg>
      );
    default:
      return <svg {...props}><circle cx="100" cy="100" r="60" stroke={bone} /></svg>;
  }
}

/* ── Icons ──────────────────────────────────────────── */

const ChevronL = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="18" height="18">
    <polyline points="15 6 9 12 15 18" />
  </svg>
);
const ChevronR = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="18" height="18">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

/* ── Carousel ───────────────────────────────────────── */

export function Services() {
  const N = SERVICES.length;
  const [idx, setIdx]   = useState(0);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const SPEED = 7000;

  const stageRef  = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const go   = useCallback((d: number) => { setIdx(p => (p + d + N) % N); }, [N]);
  const goTo = (n: number) => setIdx(((n % N) + N) % N);

  /* autoplay */
  useEffect(() => {
    if (!autoplay || hover || open) return;
    const t = setInterval(() => setIdx(p => (p + 1) % N), SPEED);
    return () => clearInterval(t);
  }, [autoplay, hover, open, N]);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, open]);

  /* touch swipe */
  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    let sx = 0, dx = 0, active = false;
    const ts = (e: TouchEvent) => { active = true; sx = e.touches[0].clientX; dx = 0; };
    const tm = (e: TouchEvent) => { if (!active) return; dx = e.touches[0].clientX - sx; };
    const te = () => { if (!active) return; active = false; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); };
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove',  tm, { passive: true });
    el.addEventListener('touchend',   te);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove',  tm);
      el.removeEventListener('touchend',   te);
    };
  }, [go]);

  /* card 3D transform */
  const cardStyle = (cardIdx: number): React.CSSProperties => {
    let off = cardIdx - idx;
    if (off >  N/2) off -= N;
    if (off < -N/2) off += N;
    const abs = Math.abs(off);
    const d = 0.9;

    if (abs === 0) return { transform: 'translateX(0) translateZ(0) scale(1)', opacity: 1, zIndex: 30 };
    if (abs === 1) {
      const dir = Math.sign(off);
      return {
        transform: `translateX(${dir*(320+60*d)}px) translateZ(${-120*d}px) scale(${1-0.12*d}) rotateY(${dir*-8*d}deg)`,
        opacity: 0.55, zIndex: 20,
      };
    }
    if (abs === 2) {
      const dir = Math.sign(off);
      return {
        transform: `translateX(${dir*(560+80*d)}px) translateZ(${-260*d}px) scale(${1-0.22*d}) rotateY(${dir*-12*d}deg)`,
        opacity: 0.18, zIndex: 10,
      };
    }
    return { transform: `translateX(${Math.sign(off)*800}px) scale(.6)`, opacity: 0, zIndex: 0 };
  };

  const cur = SERVICES[idx];

  return (
    <section className={styles.sec} id="services" aria-labelledby="services-heading">

      {/* Header */}
      <header className={styles.secHead}>
        <div>
          <div className={styles.kicker}>
            <span className={styles.dotk} />
            CREATE • CONNECT • GROW
          </div>
          <h2 id="services-heading" className={styles.h1}>
            Nossos <em>Serviços</em>.<br />
            <i>Estratégia que vira resultado.</i>
          </h2>
        </div>
        <div className={styles.headRight}>
          <p className={styles.lede}>
            Soluções premium em marketing, tecnologia e crescimento — desenhadas sob medida para cada operação.
          </p>
          <div className={styles.toolbar}>
            <span className={styles.counter}>
              <b>{cur.num}</b> / {String(N).padStart(2,'0')}
            </span>
            <button
              className={styles.tbtn}
              aria-pressed={autoplay}
              aria-label={autoplay ? 'Pausar autoplay' : 'Iniciar autoplay'}
              onClick={() => setAutoplay(v => !v)}
            >
              <span className={styles.pip} />
              {autoplay ? 'Auto' : 'Manual'}
            </button>
          </div>
        </div>
      </header>

      {/* Stage */}
      <div
        className={styles.stage}
        ref={stageRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Serviços HSB"
      >
        <button className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Serviço anterior">
          <ChevronL />
        </button>
        <button className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Próximo serviço">
          <ChevronR />
        </button>

        <div className={styles.track}>
          {SERVICES.map((svc, i) => {
            let off = i - idx;
            if (off >  N/2) off -= N;
            if (off < -N/2) off += N;
            const abs = Math.abs(off);
            const isActive = abs === 0;
            const isSide   = abs === 1 || abs === 2;

            return (
              <article
                key={svc.id}
                className={[
                  styles.card,
                  isActive ? styles.active : '',
                  isSide   ? styles.side   : '',
                  abs > 2  ? styles.far    : '',
                ].join(' ')}
                style={cardStyle(i)}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => { if (isActive) setOpen(o => !o); else goTo(i); }}
                onKeyDown={(e) => {
                  if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault(); setOpen(o => !o);
                  }
                }}
              >
                <div className={styles.crow}>
                  <span className={styles.tag}>{svc.tag}</span>
                  <span className={styles.num}>{svc.num} — HSB</span>
                </div>
                <div className={styles.glyph}>
                  <Glyph kind={svc.id} />
                </div>
                <div>
                  <h3 className={styles.cardtitle}>{svc.title}</h3>
                  <p className={styles.carddesc}>{svc.desc}</p>
                </div>
                <div className={styles.cardfoot}>
                  <button
                    className={styles.ctaMini}
                    onClick={(e) => { e.stopPropagation(); if (isActive) setOpen(o => !o); else goTo(i); }}
                    aria-label={`${isActive && open ? 'Fechar detalhes' : 'Ver solução'}: ${svc.title}`}
                  >
                    {isActive && open ? 'Fechar' : 'Ver solução'}
                    <span className={styles.arr} />
                  </button>
                  <span className={styles.expandHint}>
                    {isActive ? (open ? '▲ Recolher' : '▼ Expandir') : ''}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className={styles.dotrow} role="tablist" aria-label="Selecionar serviço">
        {SERVICES.map((svc, i) => (
          <button
            key={svc.id}
            className={styles.dot}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Ir para ${svc.title}`}
            onClick={() => goTo(i)}
          >
            <span>{svc.num}</span>
            <span className={[styles.bar, i === idx ? styles.barActive : ''].join(' ')} />
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div
        ref={detailRef}
        className={styles.detail}
        style={{
          maxHeight: open
            ? `${(detailRef.current?.scrollHeight ?? 600) + 80}px`
            : '0px',
          opacity: open ? 1 : 0,
        }}
        aria-hidden={!open}
      >
        <div className={styles.detailInner}>
          <div className={styles.detCol}>
            <h4>O que está incluso</h4>
            <ul>
              {cur.detail.includes.map((x, k) => <li key={k}>{x}</li>)}
            </ul>
          </div>
          <div className={styles.detCol}>
            <h4>Para quem é</h4>
            <p>{cur.detail.audience}</p>
          </div>
          <div className={styles.detCol}>
            <h4>Resultado esperado</h4>
            <p>{cur.detail.outcome}</p>
          </div>
          <div className={styles.detCta}>
            <button className={styles.btnPrimary}>
              Solicitar proposta <span aria-hidden>→</span>
            </button>
            <button className={styles.btnClose} onClick={() => setOpen(false)} aria-label="Fechar detalhes">
              Fechar
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
