# 🎨 RRDCH Homepage — 3 UI Elements Addition Guide
> Add exactly 3 new elements to the homepage. Do NOT change any other page or component. Do NOT modify the existing hero text, navbar, stats, features section, testimonials, footer, or any other page. Only add what is described here.

---

## ⚠️ CRITICAL RULES BEFORE YOU START

1. **Touch ONLY `src/pages/Home.tsx`** (or whatever file renders the homepage)
2. **Do NOT modify** the hero text, navbar, stats section, features section, testimonials, news cards, or footer
3. **Install only the packages listed** — do not upgrade or change existing ones
4. **Each element goes in a specific location** — read the placement instructions carefully
5. If any element causes a build error, fix only that element — do not touch anything else

---

## INSTALL THESE PACKAGES FIRST

```bash
npm install @splinetool/react-spline @splinetool/runtime
npm install framer-motion
npm install react-icons
```

---

---

## ELEMENT 1: Spline 3D DNA Model in Hero Section

### What it is
A 3D animated DNA double helix with a pill/capsule from Spline. It will float on the RIGHT side of the hero section alongside the existing dental clinic photo.

### Spline URL
```
https://prod.spline.design/lttPCd2miU4Keh-F/scene.splinecode
```

### Exact Placement
**Inside the hero section, on the right side** — replace the existing `hero-image-wrap` div (the one containing the dental clinic photo) with a split layout:
- Left half of right column: keep the existing dental clinic photo (or make it smaller)
- Right half of right column: the Spline 3D DNA model

If the hero currently has a two-column grid (text left, image right), **replace the right column's content** with the Spline component. The existing text, buttons, stats, badge, and eyebrow on the left column stay completely unchanged.

### Code to Add

**Create `src/components/SplineDNA.tsx`:**
```tsx
import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineDNA() {
  return (
    <div style={{
      width: '100%',
      height: '420px',
      borderRadius: '24px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Suspense fallback={
        <div style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '14px'
        }}>
          Loading 3D model...
        </div>
      }>
        <Spline
          scene="https://prod.spline.design/lttPCd2miU4Keh-F/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>

      {/* Gradient overlay at bottom to blend with hero */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(to top, rgba(26,82,118,0.6), transparent)',
        pointerEvents: 'none',
        borderRadius: '0 0 24px 24px'
      }} />
    </div>
  );
}
```

**In `Home.tsx`, import and use it:**
```tsx
import SplineDNA from '../components/SplineDNA';

// Find the hero's right column (the one with the hero-image-wrap or dental clinic image)
// Replace its content with:

<div className="hero-image-wrap" style={{ position: 'relative' }}>
  {/* Floating badge — keep this if it existed before */}
  <div className="hero-float-card" style={{
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    zIndex: 10,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '14px',
    padding: '14px 18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}>
    <div style={{
      width: '10px',
      height: '10px',
      background: '#2ECC71',
      borderRadius: '50%',
      animation: 'pulse-dot 2s ease infinite'
    }} />
    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
      Live Queue Active
    </div>
  </div>

  {/* The Spline 3D DNA model */}
  <SplineDNA />
</div>
```

### Mobile Behaviour
On screens below 900px, the Spline component should be hidden (the hero already stacks to single column on mobile — no need to show a heavy 3D model there):
```css
/* Add to globals.css or as inline style */
@media (max-width: 900px) {
  .hero-image-wrap {
    display: none;
  }
}
```

### What Should NOT Change
- Hero headline ("Advanced Dental Care & Education" or whatever it currently says)
- Hero eyebrow badge ("Trusted Since 1992 · NAAC A-Grade")
- Hero description text
- "Book Appointment" and "Check Queue Status" buttons
- Hero stats (450+, 30+, 250, 10)
- Hero background gradient
- Navbar above the hero

---

---

## ELEMENT 2: Scroll Morph Photo Gallery Animation

### What it is
20 photos arranged in a circle that morph into an arc when the user scrolls. Photos are of dental college/hospital environments. Goes **directly after the "Why Choose RRDCH" features section** and before anything else.

### Exact Placement in Homepage
```
[Hero Section]
[Accreditation Strip]
[Stats Section]
[Path Cards — I'm a Patient / I'm a Student]
[Why Choose RRDCH — 6 Feature Cards]   ← it goes AFTER this
[ELEMENT 2: Scroll Morph Gallery]       ← INSERT HERE
[ELEMENT 3: Interactive Image Selector] ← INSERT HERE (below Element 2)
[Testimonials]
[News & Events]
[Footer]
```

### Create `src/components/ScrollMorphGallery.tsx`

Copy the component EXACTLY as provided below. Only change the IMAGES array to use dental/medical themed images:

```tsx
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
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1) * 100;
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
```

### In `Home.tsx`, import and place it:
```tsx
import ScrollMorphGallery from '../components/ScrollMorphGallery';

// Find the features section ("Why Choose RRDCH" — the 6 cards grid)
// Place ScrollMorphGallery IMMEDIATELY AFTER that section closes:

{/* Features Section — Why Choose RRDCH (existing, do not touch) */}
<section className="section" style={{ background: '#fff' }}>
  {/* ... existing features content ... */}
</section>

{/* ELEMENT 2: Scroll Morph Gallery — ADD HERE */}
<ScrollMorphGallery />

{/* ELEMENT 3: Interactive Selector — ADD HERE (see below) */}
```

---

---

## ELEMENT 3: Interactive Image Selector (After the Gallery)

### What it is
5 horizontal expanding image panels. Clicking/hovering on a panel expands it to fill most of the width. Shows title and description. Represents different aspects of RRDCH (departments, facilities, research, etc.).

### Exact Placement
**Directly below Element 2 (ScrollMorphGallery)**, still within the homepage, before the Testimonials section.

### Create `src/components/RRDCHGallerySelector.tsx`

```tsx
import React, { useState, useEffect } from 'react';

const RRDCHGallerySelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  // RRDCH-specific options — 5 aspects of the college
  const options = [
    {
      title: "Modern OPD Clinics",
      description: "250 advanced dental chairs",
      image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80",
      icon: "🦷"
    },
    {
      title: "Expert Faculty",
      description: "NAAC A-Grade educators",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
      icon: "👨‍⚕️"
    },
    {
      title: "Research & Innovation",
      description: "Glasgow-affiliated excellence",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      icon: "🔬"
    },
    {
      title: "Campus & Hostel",
      description: "5-acre Mysore Road campus",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      icon: "🏫"
    },
    {
      title: "Patient Care",
      description: "450+ patients served daily",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
      icon: "❤️"
    }
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <section style={{
      background: 'var(--primary)',
      padding: '96px 0',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '12px'
        }}>
          Explore RRDCH
        </div>
        <h2 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '12px'
        }}>
          A Complete Institution
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', maxWidth: '500px', margin: '0 auto' }}>
          From world-class OPD clinics to research labs and student hostels — everything under one roof.
        </p>
      </div>

      {/* The expanding panels — centered */}
      <div style={{
        display: 'flex',
        maxWidth: '960px',
        height: '420px',
        margin: '0 auto',
        overflow: 'hidden',
      }}>
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
              backgroundPosition: 'center',
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'all 0.7s ease-in-out',
              minWidth: '60px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: activeIndex === index ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              backgroundColor: '#1A5276',
              boxShadow: activeIndex === index
                ? '0 20px 60px rgba(0,0,0,0.5)'
                : '0 10px 30px rgba(0,0,0,0.3)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: index === 0 ? '16px 0 0 16px' : index === options.length - 1 ? '0 16px 16px 0' : '0',
            }}
          >
            {/* Dark shadow overlay at bottom */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: activeIndex === index ? '0' : '-40px',
              height: '140px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
              transition: 'all 0.7s ease-in-out',
              pointerEvents: 'none',
            }} />

            {/* Label */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '20px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
              pointerEvents: 'none',
              padding: '0 16px',
              gap: '12px',
            }}>
              {/* Icon circle */}
              <div style={{
                minWidth: '44px',
                maxWidth: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(26,82,118,0.85)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.25)',
                flexShrink: 0,
                fontSize: '20px',
              }}>
                {option.icon}
              </div>

              {/* Title + description */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: '700',
                  fontSize: '18px',
                  color: '#ffffff',
                  opacity: activeIndex === index ? 1 : 0,
                  transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                  transition: 'all 0.7s ease-in-out',
                  whiteSpace: 'nowrap',
                }}>
                  {option.title}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  opacity: activeIndex === index ? 1 : 0,
                  transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                  transition: 'all 0.7s ease-in-out 0.05s',
                  whiteSpace: 'nowrap',
                }}>
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RRDCHGallerySelector;
```

### In `Home.tsx`, import and place it directly below Element 2:
```tsx
import RRDCHGallerySelector from '../components/RRDCHGallerySelector';

// In the JSX, the order must be:
<ScrollMorphGallery />
<RRDCHGallerySelector />
{/* Then testimonials, news, footer below */}
```

---

---

## ✅ FINAL HOMEPAGE SECTION ORDER (after all changes)

```
1. [Navbar — unchanged]
2. [Hero — with Spline DNA model on right side]
3. [Accreditation Strip — unchanged]
4. [Stats Section — unchanged]
5. [Path Cards — unchanged]
6. [Why Choose RRDCH — unchanged]
7. [ScrollMorphGallery — NEW]       ← light surface background
8. [RRDCHGallerySelector — NEW]     ← navy/primary background
9. [Testimonials — unchanged]
10. [News & Events — unchanged]
11. [Footer — unchanged]
```

---

## ⚠️ THINGS TO NEVER DO

- Do NOT remove the `mouseX.set()` call — the parallax effect depends on it (there was a syntax bug in the original — the multiply by 100 must be INSIDE the set call: `mouseX.set(((relativeX / rect.width) * 2 - 1) * 100)`)
- Do NOT change any other page (Appointment, Queue, Departments, Academics, About, Contact, Followup, Hostel, Doctor)
- Do NOT modify the Navbar component
- Do NOT modify the Footer component
- Do NOT change the hero text, hero background gradient, or hero buttons
- Do NOT remove the Spline `Suspense` wrapper — loading the 3D scene takes 1-3 seconds and the fallback prevents blank space

## ✅ VERIFY AFTER BUILDING

- [ ] Hero right column shows the rotating DNA 3D model
- [ ] "Life at RRDCH" section appears below the 6 feature cards with photos in circle formation
- [ ] Scrolling inside the circle animation morphs photos into an arc
- [ ] "A Complete Institution" expanding panels appear below the circle animation
- [ ] Clicking each panel expands it and shows title + description
- [ ] All other pages still work — no regressions
- [ ] `npm run build` completes with 0 errors
