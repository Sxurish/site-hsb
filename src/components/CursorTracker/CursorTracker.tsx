'use client';
import { useEffect, useRef } from 'react';
import styles from './CursorTracker.module.css';

export default function CursorTracker() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId: number;
    let visible = false;

    const show = () => {
      if (!visible) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        visible = true;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      show();
    };

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      animId = requestAnimationFrame(tick);
    };

    const onEnter = () => ring.classList.add(styles.hovered);
    const onLeave = () => ring.classList.remove(styles.hovered);
    const onDown  = () => { ring.classList.add(styles.pressed); dot.classList.add(styles.pressed); };
    const onUp    = () => { ring.classList.remove(styles.pressed); dot.classList.remove(styles.pressed); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    animId = requestAnimationFrame(tick);

    const attachHovers = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    attachHovers();

    // Re-attach after potential DOM changes
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
