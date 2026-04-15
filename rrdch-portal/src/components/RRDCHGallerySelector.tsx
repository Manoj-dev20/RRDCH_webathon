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
