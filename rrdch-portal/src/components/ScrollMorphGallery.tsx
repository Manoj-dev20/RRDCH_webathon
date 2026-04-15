"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useScroll } from "framer-motion";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 110;
const IMG_HEIGHT = 150;

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
      transition={{ type: "spring", stiffness: 45, damping: 18 }}
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
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl shadow-xl bg-white/10 backdrop-blur-sm border border-white/20"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity group-hover:opacity-0" />
        </div>
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-[#1A5276] to-[#17A589] flex flex-col items-center justify-center p-4 border border-white/20"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">RRDCH</p>
            <p className="text-[10px] text-white/80 italic">Innovation in Dentistry</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

// High-quality, reliable dental/medical/campus Unsplash images
const IMAGES = [
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6199f7a096?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243639359-2830a747c211?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1932&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532187863486-abf9d39d9992?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1747&auto=format&fit=crop",
];

export default function ScrollMorphGallery() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // FIXED: Trigger on the outer section, but offset so the animation happens while sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const virtualScroll = useTransform(scrollYProgress, [0, 1], [0, MAX_SCROLL]);

  const morphProgress = useTransform(virtualScroll, [1500, 2500], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 45, damping: 20 });
  
  // Rotate during the middle-to-end phase
  const scrollRotate = useTransform(virtualScroll, [500, 2500], [0, 180]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 45, damping: 20 });
  
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(relativeX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    // Initial intro animation state
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const scatterPositions = useMemo(() =>
    IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1500,
      rotation: (Math.random() - 0.5) * 360,
      scale: 0.5,
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

  const contentOpacity = useTransform(smoothMorph, [0.7, 0.9], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.7, 0.9], [40, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative" 
      style={{ height: '400vh', background: 'var(--surface)' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Header content that sticks at the top */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
            y: useTransform(scrollYProgress, [0, 0.1], [0, -20])
          }}
          className="absolute top-24 z-20 text-center px-6"
        >
          <div className="text-[var(--accent)] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Legacy of Excellence
          </div>
          <h2 className="text-[var(--primary)] text-4xl md:text-6xl font-heading font-extrabold mb-4">
            Life at RRDCH
          </h2>
          <p className="text-[var(--text2)] max-w-lg mx-auto">
            Scroll to experience our state-of-the-art campus and 30+ year journey.
          </p>
        </motion.div>

        {/* The animation container */}
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none overflow-hidden">
            <span className="text-[25vw] font-black text-[var(--primary)] whitespace-nowrap">
              R R D C H
            </span>
          </div>

          {/* Cards Layer */}
          <div className="relative w-full h-full flex items-center justify-center">
            {IMAGES.map((src, i) => {
              let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

              if (introPhase === "scatter") {
                target = scatterPositions[i];
              } else if (introPhase === "line") {
                const lineSpacing = containerSize.width < 768 ? 60 : 120;
                target = { 
                  x: i * lineSpacing - (TOTAL_IMAGES * lineSpacing) / 2, 
                  y: 0, 
                  rotation: 0, 
                  scale: 0.8, 
                  opacity: 1 
                };
              } else {
                const isMobile = containerSize.width < 768;
                const minDim = Math.min(containerSize.width, containerSize.height);
                const circleRadius = isMobile ? minDim * 0.45 : minDim * 0.55;
                
                const angle = (i / TOTAL_IMAGES) * 360;
                const circleRad = (angle * Math.PI) / 180;
                
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: angle + 90,
                };

                // Arc transformation (Morphs into a broad arc at the bottom)
                const arcRadius = containerSize.width * (isMobile ? 1.5 : 1.2);
                const spreadAngle = isMobile ? 90 : 120;
                const startAngle = -90 - spreadAngle / 2;
                const step = spreadAngle / (TOTAL_IMAGES - 1);
                
                // Add rotation based on scroll
                const currentArcAngle = startAngle + i * step + (rotateValue - 90);
                const arcRad = (currentArcAngle * Math.PI) / 180;
                
                const arcPos = {
                  x: Math.cos(arcRad) * arcRadius + parallaxValue,
                  y: Math.sin(arcRad) * arcRadius + (containerSize.height * 0.9),
                  rotation: currentArcAngle + 90,
                  scale: isMobile ? 1.5 : 2.5,
                };

                target = {
                  x: lerp(circlePos.x, arcPos.x, morphValue),
                  y: lerp(circlePos.y, arcPos.y, morphValue),
                  rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                  scale: lerp(0.8, arcPos.scale, morphValue),
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

          {/* Reveal Content */}
          <motion.div
            style={{ 
              opacity: useTransform(smoothMorph, [0.8, 1], [0, 1]), 
              y: useTransform(smoothMorph, [0.8, 1], [20, 0]),
              visibility: morphValue > 0.8 ? 'visible' : 'hidden'
            }}
            className="absolute z-10 text-center px-4"
          >
            <h3 className="text-[var(--primary)] text-3xl md:text-5xl font-heading font-bold mb-4">
              World Class Facilities
            </h3>
            <p className="text-[var(--text2)] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Equipped with 300+ advanced dental units, cutting-edge radiology wings, 
              and a comprehensive multi-specialty hospital serving 1000+ patients daily.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="text-[var(--accent)] font-bold text-xl">30+</div>
                <div className="text-[var(--text3)] text-xs uppercase">Years</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="text-[var(--accent)] font-bold text-xl">250+</div>
                <div className="text-[var(--text3)] text-xs uppercase">Chairs</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="text-[var(--accent)] font-bold text-xl">NIRF</div>
                <div className="text-[var(--text3)] text-xs uppercase">Top 10</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
