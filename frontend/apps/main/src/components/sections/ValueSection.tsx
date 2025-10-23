import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Rocket, Bot, Star, Shield, Grid3x3, BarChart3, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GradientText } from '@shared/ui';
import AutomatedSEODemo from './demos/AutomatedSEODemo';
import InstantLaunchDemo from './demos/InstantLaunchDemo';
import GoogleReviewsDemo from './demos/GoogleReviewsDemo';
import IndustryTemplatesDemo from './demos/IndustryTemplatesDemo';
import AnalyticsDashboardDemo from './demos/AnalyticsDashboardDemo';
import SecureBookingDemo from './demos/SecureBookingDemo';
import MuchMoreDemo from './demos/MuchMoreDemo';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string | React.ReactNode;
  gradient: string;
  size: 'small' | 'medium' | 'large';
}

const features: Feature[] = [
  {
    icon: Rocket,
    title: 'Instant Launch',
    description: (
      <>
        <GradientText variant="cyan-purple">Launch</GradientText> your website in under 60 seconds.
      </>
    ),
    gradient: 'from-yellow-400 to-orange-500',
    size: 'medium'
  },
  {
    icon: Bot,
    title: 'Automated SEO',
    description: 'Schema, pages, and Google indexing handled for you.',
    gradient: 'from-blue-400 to-cyan-500',
    size: 'medium'
  },
  {
    icon: Star,
    title: 'Google Reviews Engine',
    description: 'Auto-sync and display your customer reviews.',
    gradient: 'from-red-500 via-yellow-400 via-green-500 to-blue-500',
    size: 'medium'
  },
  {
    icon: Shield,
    title: 'Secure Online Booking',
    description: 'Accept appointments and payments online, safely.',
    gradient: 'from-green-400 to-emerald-500',
    size: 'medium'
  },
  {
    icon: Grid3x3,
    title: 'Industry-Specific Templates',
    description: 'Professionally designed layouts for each niche.',
    gradient: 'from-red-400 to-rose-500',
    size: 'small'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time performance and SEO insights.',
    gradient: 'from-violet-400 to-fuchsia-500',
    size: 'medium'
  },
  {
    icon: Sparkles,
    title: 'Much More...',
    description: '',
    gradient: 'from-fuchsia-500 via-cyan-400 to-blue-600',
    size: 'large'
  }
];

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  hue: number;
}

export default function SmartAdvantageSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cardPositions = cardsRef.current
      .filter(card => card)
      .map(card => {
        const rect = card!.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        return {
          x: rect.left - canvasRect.left + rect.width / 2,
          y: rect.top - canvasRect.top + rect.height / 2
        };
      });

    if (cardPositions.length === 0) {
      return;
    }

    for (let i = 0; i < 50; i++) {
      const startCard = cardPositions[Math.floor(Math.random() * cardPositions.length)];
      const endCard = cardPositions[Math.floor(Math.random() * cardPositions.length)];

      particlesRef.current.push({
        x: startCard.x,
        y: startCard.y,
        targetX: endCard.x,
        targetY: endCard.y,
        vx: 0,
        vy: 0,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 60 + 200
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          const newTarget = cardPositions[Math.floor(Math.random() * cardPositions.length)];
          particle.targetX = newTarget.x;
          particle.targetY = newTarget.y;
        }

        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();

        const nextParticle = particlesRef.current[index + 1];
        if (nextParticle) {
          const lineDistance = Math.sqrt(
            Math.pow(nextParticle.x - particle.x, 2) +
            Math.pow(nextParticle.y - particle.y, 2)
          );
          if (lineDistance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(nextParticle.x, nextParticle.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="advantage"
      className="relative h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 overflow-hidden pt-32 pb-8 px-6 snap-start snap-always flex items-start"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[128px] -top-64 -left-64 animate-float" />
        <div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[128px] -bottom-48 -right-48 animate-float-delayed" />
        <div className="absolute w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[128px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
      </div>

      {/* Particle network canvas - disabled to prevent interference with demos */}
      {/* <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      /> */}

      <div className="relative max-w-7xl mx-auto w-full mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 space-y-3"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-white">The </span>
            <GradientText variant="shimmer">
              Smart
            </GradientText>
            <span className="text-white"> Advantage</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Everything your business needs — automated, optimized, and ready to grow.
          </p>
        </motion.div>

        <div className="relative">
          {features.filter((_, index) => index === activeCardIndex).map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={activeCardIndex} className="space-y-2">
                {/* Title and Icon */}
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-2xl p-[2px] ${feature.title !== 'Google Reviews Engine' ? `bg-gradient-to-br ${feature.gradient}` : ''}`}
                    style={
                      feature.title === 'Google Reviews Engine'
                        ? {
                            background: 'conic-gradient(from -45deg at 50% 50%, #EA4335 0deg 90deg, #FBBC04 90deg 180deg, #34A853 180deg 270deg, #4285F4 270deg 360deg)'
                          }
                        : undefined
                    }
                  >
                    <div className="w-full h-full bg-slate-950/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-6 h-6 text-white animate-icon-float" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {feature.title === 'Google Reviews Engine' ? (
                      <>
                        <GradientText colors={['#EA4335', '#4285F4', '#FBBC04', '#34A853']}>
                          Google
                        </GradientText>
                        {' Reviews Engine'}
                      </>
                    ) : (
                      feature.title
                    )}
                  </h3>
                </div>

                {/* Description */}
                <p className="relative z-10 text-center text-base text-slate-400 font-light max-w-xl mx-auto mb-0">
                  {feature.description}
                </p>

                {/* Demo with Chevrons on sides */}
                <div className="relative z-0 w-full mx-auto h-[calc(100vh-320px)] !-mt-24 flex items-center justify-center gap-8">
                  {/* Left Chevron */}
                  <button
                    onClick={() => setActiveCardIndex((prev) => (prev - 1 + features.length) % features.length)}
                    className="flex-shrink-0 text-white/60 hover:text-white transition-colors cursor-pointer"
                    aria-label="Previous feature"
                  >
                    <ChevronLeft className="w-12 h-12" strokeWidth={3} />
                  </button>

                  {/* Demo Container */}
                  <div className="flex-1 max-w-5xl">
                    <div
                      ref={el => { if (el) cardsRef.current[activeCardIndex] = el; }}
                      className="relative overflow-visible"
                      style={{ height: '805px' }}
                    >
                      {activeCardIndex === 0 && <InstantLaunchDemo />}
                      {activeCardIndex === 1 && <AutomatedSEODemo />}
                      {activeCardIndex === 2 && <GoogleReviewsDemo />}
                      {activeCardIndex === 3 && <SecureBookingDemo />}
                      {activeCardIndex === 4 && <IndustryTemplatesDemo />}
                      {activeCardIndex === 5 && <AnalyticsDashboardDemo />}
                      {activeCardIndex === 6 && <MuchMoreDemo />}
                    </div>
                  </div>

                  {/* Right Chevron */}
                  <button
                    onClick={() => setActiveCardIndex((prev) => (prev + 1) % features.length)}
                    className="flex-shrink-0 text-white/60 hover:text-white transition-colors cursor-pointer"
                    aria-label="Next feature"
                  >
                    <ChevronRight className="w-12 h-12" strokeWidth={3} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
