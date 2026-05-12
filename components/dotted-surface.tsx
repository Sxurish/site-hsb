'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DEFAULT_AMOUNT = 50;
const DEFAULT_SEPARATION = 80;

const COLOR_DARK = 0xd4a566;
const COLOR_LIGHT = 0x3a2a14;

export function DottedSurface() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const amountX = isMobile ? 32 : DEFAULT_AMOUNT;
    const amountY = isMobile ? 32 : DEFAULT_AMOUNT;
    const separation = isMobile ? 110 : DEFAULT_SEPARATION;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 622);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const total = amountX * amountY;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);

    let ptr = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        positions[ptr] = ix * separation - (amountX * separation) / 2;
        positions[ptr + 1] = 0;
        positions[ptr + 2] = iy * separation - (amountY * separation) / 2;
        colors[ptr] = 1;
        colors[ptr + 1] = 1;
        colors[ptr + 2] = 1;
        ptr += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const applyTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      const color = new THREE.Color(dark ? COLOR_DARK : COLOR_LIGHT);
      const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
      const arr = colorAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i] = color.r;
        arr[i + 1] = color.g;
        arr[i + 2] = color.b;
      }
      colorAttr.needsUpdate = true;
      material.opacity = dark ? 0.6 : 0.7;
      material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      material.needsUpdate = true;
    };
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let frame = 0;
    let count = 0;
    let running = true;

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    const tick = () => {
      if (!running) return;
      frame = requestAnimationFrame(tick);

      let idx = 1;
      for (let ix = 0; ix < amountX; ix++) {
        for (let iy = 0; iy < amountY; iy++) {
          posArr[idx] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          idx += 3;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += reduceMotion ? 0 : 0.06;
    };

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        tick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    tick();
    if (reduceMotion) {
      renderer.render(scene, camera);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      themeObserver.disconnect();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    />
  );
}
