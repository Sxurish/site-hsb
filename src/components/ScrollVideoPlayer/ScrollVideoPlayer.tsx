"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollVideoPlayer.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) return;

    // Ensure video is loaded before calculating duration
    video.onloadedmetadata = () => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2000", // The scroll distance to scrub through the video
          scrub: true,
          pin: true,
        }
      });

      // Animate video current time based on scroll
      tl.to(video, {
        currentTime: video.duration || 5, // fallback if duration fails
        ease: "none"
      });
    };

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.videoContainer}>
      <div className={styles.overlay}>
        <h2 className="text-gradient">O Futuro do Marketing</h2>
        <p>Acompanhe cada detalhe da nossa estratégia enquanto faz scroll.</p>
      </div>
      <video 
        ref={videoRef}
        className={styles.video}
        src="https://www.w3schools.com/html/mov_bbb.mp4" 
        muted 
        playsInline 
        preload="auto"
      />
    </div>
  );
}
