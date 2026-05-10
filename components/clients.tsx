'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './clients.module.css';

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

type Client = {
  brand: string;
  initials: string;
  services: string[];
  quote: string;
  name: string;
  role: string;
  photo?: string;
};

const CLIENT_META = [
  { brand: 'Clínica Vitalidade',    initials: 'CV' },
  { brand: 'Construtora Horizonte', initials: 'CH' },
  { brand: 'Drivex Auto Group',     initials: 'DA' },
  { brand: 'NovaHub Fintech',       initials: 'NH' },
  { brand: 'Fashion Studio SP',     initials: 'FS' },
  { brand: 'Rede Alimentar',        initials: 'RA' },
];

export function Clients() {
  const t = useTranslations('Clients');

  const list: Client[] = CLIENT_META.map((m, i) => {
    const n = i + 1;
    return {
      brand: m.brand,
      initials: m.initials,
      services: [t(`items.c${n}S1`), t(`items.c${n}S2`)],
      quote: t(`items.c${n}Quote`),
      name: t(`items.c${n}Name`),
      role: t(`items.c${n}Role`),
    };
  });

  const N = list.length;

  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const SPEED = 8000;

  const stageRef = useRef<HTMLDivElement>(null);

  const go = useCallback((d: number) => setIdx((p) => (p + d + N) % N), [N]);
  const goTo = (n: number) => setIdx(((n % N) + N) % N);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!autoplay || hover) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % N), SPEED);
    return () => clearInterval(t);
  }, [autoplay, hover, N]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let sx = 0, dx = 0, active = false;
    const ts = (e: TouchEvent) => { active = true; sx = e.touches[0].clientX; dx = 0; };
    const tm = (e: TouchEvent) => { if (active) dx = e.touches[0].clientX - sx; };
    const te = () => { if (!active) return; active = false; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); };
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: true });
    el.addEventListener('touchend', te);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', te);
    };
  }, [go]);

  const cardStyle = (cardIdx: number): React.CSSProperties => {
    let off = cardIdx - idx;
    if (off >  N / 2) off -= N;
    if (off < -N / 2) off += N;
    const abs = Math.abs(off);

    if (isMobile) {
      if (abs === 0) return { transform: 'translateX(0)', opacity: 1, zIndex: 30 };
      if (abs === 1) {
        const dir = Math.sign(off);
        return { transform: `translateX(${dir * 96}%) scale(.92)`, opacity: 0, zIndex: 20 };
      }
      return { transform: `translateX(${Math.sign(off) * 180}%)`, opacity: 0, zIndex: 0 };
    }

    const d = 0.9;
    if (abs === 0) return { transform: 'translateX(0) translateZ(0) scale(1)', opacity: 1, zIndex: 30 };
    if (abs === 1) {
      const dir = Math.sign(off);
      return {
        transform: `translateX(${dir * (360 + 60 * d)}px) translateZ(${-140 * d}px) scale(${1 - 0.13 * d}) rotateY(${dir * -8 * d}deg)`,
        opacity: 0.55,
        zIndex: 20,
      };
    }
    if (abs === 2) {
      const dir = Math.sign(off);
      return {
        transform: `translateX(${dir * (640 + 80 * d)}px) translateZ(${-280 * d}px) scale(${1 - 0.24 * d}) rotateY(${dir * -12 * d}deg)`,
        opacity: 0.18,
        zIndex: 10,
      };
    }
    return { transform: `translateX(${Math.sign(off) * 900}px) scale(.6)`, opacity: 0, zIndex: 0 };
  };

  return (
    <section className={styles.sec} id="clientes" aria-labelledby="clients-heading">
      <header className={styles.secHead}>
        <div>
          <div className={styles.kicker}>
            <span className={styles.dotk} />
            {t('kicker')}
          </div>
          <h2 id="clients-heading" className={styles.h1}>
            {t('title')} <em>{t('titleEm')}</em>.<br />
            <i>{t('subtitle')}</i>
          </h2>
        </div>
        <div className={styles.headRight}>
          <p className={styles.lede}>{t('lede')}</p>
          <div className={styles.toolbar}>
            <span className={styles.counter}>
              <b>{String(idx + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}
            </span>
            <button
              className={styles.tbtn}
              aria-pressed={autoplay}
              aria-label={autoplay ? t('autoplayAriaPause') : t('autoplayAriaPlay')}
              onClick={() => setAutoplay((v) => !v)}
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
          {list.map((c, i) => {
            let off = i - idx;
            if (off >  N / 2) off -= N;
            if (off < -N / 2) off += N;
            const abs = Math.abs(off);
            const isActive = abs === 0;
            const isSide = abs === 1 || abs === 2;

            return (
              <article
                key={c.brand}
                className={[
                  styles.card,
                  isActive ? styles.active : '',
                  isSide ? styles.side : '',
                  abs > 2 ? styles.far : '',
                ].join(' ')}
                style={cardStyle(i)}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => { if (!isActive) goTo(i); }}
              >
                <div className={styles.photo}>
                  {c.photo ? (
                    <Image
                      src={c.photo}
                      alt={t('photoAlt', { brand: c.brand })}
                      fill
                      sizes="(max-width: 900px) 86vw, 640px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.photoFallback}>
                      <span className={styles.photoInitials}>{c.initials}</span>
                    </div>
                  )}
                  <div className={styles.photoOverlay} />
                  <div className={styles.brandTop}>
                    <span className={styles.brandLabel}>{c.brand}</span>
                    <span className={styles.numLabel}>
                      {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={styles.photoBadges}>
                    {c.services.map((s) => (
                      <span key={s} className={styles.badge}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.content}>
                  <blockquote className={styles.quote}>{c.quote}</blockquote>
                  <div className={styles.author}>
                    <div className={styles.authorMeta}>
                      <div className={styles.avatar}>{c.initials}</div>
                      <div>
                        <p className={styles.authorName}>{c.name}</p>
                        <p className={styles.authorRole}>{c.role}</p>
                      </div>
                    </div>
                    <a href="#contato" className={styles.cta} onClick={(e) => e.stopPropagation()}>
                      {t('ctaWantSame')} <span className={styles.arr} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.dotrow} role="tablist" aria-label={t('dotsAria')}>
        {list.map((c, i) => (
          <button
            key={c.brand}
            className={styles.dot}
            role="tab"
            aria-selected={i === idx}
            aria-label={t('goToAria', { brand: c.brand })}
            onClick={() => goTo(i)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <span className={[styles.bar, i === idx ? styles.barActive : ''].join(' ')} />
          </button>
        ))}
      </div>
    </section>
  );
}
