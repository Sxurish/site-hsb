'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { clients } from '@/data/site';
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

type Client = (typeof clients)[number] & { photo?: string };

export function Clients() {
  const list = clients as Client[];
  const N = list.length;

  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const SPEED = 8000;

  const stageRef = useRef<HTMLDivElement>(null);

  const go = useCallback((d: number) => setIdx((p) => (p + d + N) % N), [N]);
  const goTo = (n: number) => setIdx(((n % N) + N) % N);

  /* viewport mode */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* autoplay */
  useEffect(() => {
    if (!autoplay || hover) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % N), SPEED);
    return () => clearInterval(t);
  }, [autoplay, hover, N]);

  /* touch swipe */
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

  /* card transform */
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
            CLIENTES • RESULTADOS REAIS
          </div>
          <h2 id="clients-heading" className={styles.h1}>
            Marcas que confiaram na <em>HSB</em>.<br />
            <i>Para crescer de verdade.</i>
          </h2>
        </div>
        <div className={styles.headRight}>
          <p className={styles.lede}>
            Histórias reais de operações que transformaram marketing em máquina de receita previsível.
          </p>
          <div className={styles.toolbar}>
            <span className={styles.counter}>
              <b>{String(idx + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}
            </span>
            <button
              className={styles.tbtn}
              aria-pressed={autoplay}
              aria-label={autoplay ? 'Pausar autoplay' : 'Iniciar autoplay'}
              onClick={() => setAutoplay((v) => !v)}
            >
              <span className={styles.pip} />
              {autoplay ? 'Auto' : 'Manual'}
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
        aria-label="Depoimentos de clientes HSB"
      >
        <button className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Cliente anterior">
          <ChevronL />
        </button>
        <button className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Próximo cliente">
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
                      alt={`Foto - ${c.brand}`}
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
                      Quero igual <span className={styles.arr} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.dotrow} role="tablist" aria-label="Selecionar depoimento">
        {list.map((c, i) => (
          <button
            key={c.brand}
            className={styles.dot}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Ir para depoimento de ${c.brand}`}
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
