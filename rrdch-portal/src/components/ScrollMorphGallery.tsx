"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ src, index, total, phase, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={src} alt={`gallery-${index}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-[#1A5276] flex flex-col items-center justify-center p-4 border border-[#2E86C1]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[8px] font-bold text-[#17A589] uppercase tracking-widest mb-1">RRDCH</p>
            <p className="text-xs font-medium text-white">Since 1992</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

// RRDCH-themed dental/medical images from Unsplash
const IMAGES = [
  "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=300&q=80",
  "https://images.unsplash.com/photo-1588776814546-1ffbb172f6fb?w=300&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=80",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80",
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80",
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&q=80",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&q=80",
  "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=300&q=80",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&q=80",
  "https://images.unsplash.com/photo-1588776813677-77aef5595b83?w=300&q=80",
  "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=300&q=80",
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=300&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&q=80",
  "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=300&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&q=80",
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&q=80",
];

export default function ScrollMorphGallery() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX.set((((e.clientX - rect.left) / rect.width) * 2 - 1) * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const scatterPositions = useMemo(() =>
    IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    })), []);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    // WRAPPER: full section with background matching the homepage surface color
    <section style={{
      background: 'var(--surface)',
      padding: '96px 0',
      position: 'relative',
    }}>
      {/* Section header above the animation */}
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '12px'
        }}>
          Campus & Facilities
        </div>
        <h2 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: '800',
          color: 'var(--primary)',
          marginBottom: '12px'
        }}>
          Life at RRDCH
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '500px', margin: '0 auto' }}>
          Scroll to explore our campus, facilities, and 30+ years of dental excellence.
        </p>
      </div>

      {/* The scroll animation container — fixed height, captures scroll internally */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          background: '#FAFAFA',
          overflow: 'hidden',
          cursor: 'grab',
        }}
      >
        <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Intro text that fades out as scroll begins */}
          <div style={{
            position: 'absolute',
            zIndex: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1 }}
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 'clamp(20px, 3vw, 32px)',
                fontWeight: '700',
                color: 'var(--primary)',
              }}
            >
              Explore RRDCH
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.5 - morphValue }
                : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ marginTop: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.2em', color: 'var(--text2)' }}
            >
              SCROLL TO EXPLORE
            </motion.p>
          </div>

          {/* Content that fades in after arc forms */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY, position: 'absolute', top: '8%', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}
          >
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
              Our Campus Gallery
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text2)', maxWidth: '400px', margin: '0 auto' }}>
              State-of-the-art facilities, world-class faculty, 30+ years of excellence.
            </p>
          </motion.div>

          {/* The cards */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
              let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

              if (introPhase === "scatter") {
                target = scatterPositions[i];
              } else if (introPhase === "line") {
                const lineSpacing = 70;
                const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                target = { x: i * lineSpacing - lineTotalWidth / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
              } else {
                const isMobile = containerSize.width < 768;
                const minDimension = Math.min(containerSize.width, containerSize.height);
                const circleRadius = Math.min(minDimension * 0.35, 220);
                const circleAngle = (i / TOTAL_IMAGES) * 360;
                const circleRad = (circleAngle * Math.PI) / 180;
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                };
                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                const arcCenterY = arcApexY + arcRadius;
                const spreadAngle = isMobile ? 100 : 130;
                const startAngle = -90 - spreadAngle / 2;
                const step = spreadAngle / (TOTAL_IMAGES - 1);
                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                const boundedRotation = -scrollProgress * spreadAngle * 0.8;
                const currentArcAngle = startAngle + i * step + boundedRotation;
                const arcRad = (currentArcAngle * Math.PI) / 180;
                const arcPos = {
                  x: Math.cos(arcRad) * arcRadius + parallaxValue,
                  y: Math.sin(arcRad) * arcRadius + arcCenterY,
                  rotation: currentArcAngle + 90,
                  scale: isMobile ? 1.4 : 1.8,
                };
                target = {
                  x: lerp(circlePos.x, arcPos.x, morphValue),
                  y: lerp(circlePos.y, arcPos.y, morphValue),
                  rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                  scale: lerp(1, arcPos.scale, morphValue),
                  opacity: 1,
                };
              }

              return (
                <FlipCard
                  key={i}
                  src={src}
                  index={i}
                  total={TOTAL_IMAGES}
                  phase={introPhase}
                  target={target}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
