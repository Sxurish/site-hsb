'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import styles from './services-carousel.module.css';

/* ── Data (ids + numeração; conteúdo textual vem do i18n) ─ */

const SERVICE_IDS = ['ai', 'site', 'ads', 'social', 'brand', 'video', 'funnel', 'consult'] as const;

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
  const t = useTranslations('Services');

  const SERVICES = SERVICE_IDS.map((id, i) => ({
    id,
    num: String(i + 1).padStart(2, '0'),
    tag: t(`items.${id}.tag`),
    title: t(`items.${id}.title`),
    desc: t(`items.${id}.desc`),
    detail: {
      includes: [
        t(`items.${id}.include1`),
        t(`items.${id}.include2`),
        t(`items.${id}.include3`),
        t(`items.${id}.include4`),
      ],
      audience: t(`items.${id}.audience`),
    },
  }));

  const N = SERVICES.length;
  const [idx, setIdx]   = useState(0);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const SPEED = 7000;

  const stageRef  = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const go   = useCallback((d: number) => { setIdx(p => (p + d + N) % N); }, [N]);
  const goTo = (n: number) => setIdx(((n % N) + N) % N);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!autoplay || hover || open) return;
    const t = setInterval(() => setIdx(p => (p + 1) % N), SPEED);
    return () => clearInterval(t);
  }, [autoplay, hover, open, N]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, open]);

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

  const cardStyle = (cardIdx: number): React.CSSProperties => {
    let off = cardIdx - idx;
    if (off >  N/2) off -= N;
    if (off < -N/2) off += N;
    const abs = Math.abs(off);

    if (isMobile) {
      if (abs === 0) return { transform: 'translateX(0)', opacity: 1, zIndex: 30 };
      if (abs === 1) {
        const dir = Math.sign(off);
        return { transform: `translateX(${dir*96}%) scale(.92)`, opacity: 0, zIndex: 20 };
      }
      return { transform: `translateX(${Math.sign(off)*180}%)`, opacity: 0, zIndex: 0 };
    }

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
    <section className={styles.sec} id="servicos" aria-labelledby="services-heading">

      <header className={styles.secHead}>
        <div>
          <div className={styles.kicker}>
            <span className={styles.dotk} />
            {t('kicker')}
          </div>
          <h2 id="services-heading" className={styles.h1}>
            {t('title')} <em>{t('titleEm')}</em>.<br />
            <i>{t('subtitle')}</i>
          </h2>
        </div>
        <div className={styles.headRight}>
          <p className={styles.lede}>{t('lede')}</p>
          <div className={styles.toolbar}>
            <span className={styles.counter}>
              <b>{cur.num}</b> / {String(N).padStart(2,'0')}
            </span>
            <button
              className={styles.tbtn}
              aria-pressed={autoplay}
              aria-label={autoplay ? t('autoplayAriaPause') : t('autoplayAriaPlay')}
              onClick={() => setAutoplay(v => !v)}
            >
              <span className={styles.pip} />
              {autoplay ? t('autoOn') : t('autoOff')}
            </button>
          </div>
        </div>
      </header>

      <div
        className={styles.stage}
        ref={stageRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        role="region"
        aria-roledescription="carrossel"
        aria-label={t('regionAria')}
      >
        <button className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label={t('prevAria')}>
          <ChevronL />
        </button>
        <button className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label={t('nextAria')}>
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
                    aria-label={t('ctaAria', {
                      state: isActive && open ? t('closeDetails') : t('viewSolution'),
                      title: svc.title,
                    })}
                  >
                    {isActive && open ? t('close') : t('viewSolution')}
                    <span className={styles.arr} />
                  </button>
                  <span className={styles.expandHint}>
                    {isActive ? (open ? t('collapse') : t('expand')) : ''}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.dotrow} role="tablist" aria-label={t('dotsAria')}>
        {SERVICES.map((svc, i) => (
          <button
            key={svc.id}
            className={styles.dot}
            role="tab"
            aria-selected={i === idx}
            aria-label={t('goToAria', { title: svc.title })}
            onClick={() => goTo(i)}
          >
            <span>{svc.num}</span>
            <span className={[styles.bar, i === idx ? styles.barActive : ''].join(' ')} />
          </button>
        ))}
      </div>

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
            <h4>{t('details.includes')}</h4>
            <ul>
              {cur.detail.includes.map((x, k) => <li key={k}>{x}</li>)}
            </ul>
          </div>
          <div className={styles.detCol}>
            <h4>{t('details.audience')}</h4>
            <p>{cur.detail.audience}</p>
          </div>
          <div className={styles.detCta}>
            {/* Âncora (não button): leva direto pra seção de contato */}
            <a href="#contato" className={styles.btnPrimary}>
              {t('details.requestProposal')} <span aria-hidden>→</span>
            </a>
            <button className={styles.btnClose} onClick={() => setOpen(false)} aria-label={t('closeDetails')}>
              {t('close')}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
