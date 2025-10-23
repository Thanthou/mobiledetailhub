import { useEffect, useState, useRef } from "react";
import {
  Bot,
  MessageSquare,
  Mail,
  Star,
  Layers,
  TrendingUp,
  Image,
  CheckCircle,
  Activity,
  HeadphonesIcon,
  Sparkles,
} from "lucide-react";

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

export default function MuchMoreDemo() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [visibleIcons, setVisibleIcons] = useState<number[]>([0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  const features = [
    { title: "AI Integration", subtitle: "Generate smart content and service descriptions", icon: Bot, gradient: "from-blue-400 to-cyan-500", angle: 0 },
    { title: "Automatic SMS Texting", subtitle: "Get instant quote and booking alerts", icon: MessageSquare, gradient: "from-green-400 to-emerald-500", angle: 36 },
    { title: "Custom Domain & Email", subtitle: "Use your own branded address for web and mail", icon: Mail, gradient: "from-purple-400 to-pink-500", angle: 72 },
    { title: "Smart Reviews Prompt", subtitle: "Automatically ask for 5-star feedback after each job", icon: Star, gradient: "from-yellow-400 to-orange-500", angle: 108 },
    { title: "Dynamic Service Pages", subtitle: "Add or edit services in seconds", icon: Layers, gradient: "from-cyan-400 to-blue-500", angle: 144 },
    { title: "Business Insights AI", subtitle: "Personalized growth recommendations from your data", icon: TrendingUp, gradient: "from-violet-400 to-fuchsia-500", angle: 180 },
    { title: "Drag-and-Drop Gallery", subtitle: "Show before-and-after photos effortlessly", icon: Image, gradient: "from-pink-400 to-rose-500", angle: 216 },
    { title: "Booking Confirmations", subtitle: "Instant text + email confirmations for customers", icon: CheckCircle, gradient: "from-emerald-400 to-green-500", angle: 252 },
    { title: "Real-Time Health Monitor", subtitle: "Tracks speed, uptime, and SEO performance", icon: Activity, gradient: "from-red-400 to-orange-500", angle: 288 },
    { title: "Priority Support", subtitle: "Real people, fast help when you need it", icon: HeadphonesIcon, gradient: "from-indigo-400 to-blue-500", angle: 324 },
  ];

  // Reveal one new icon every 4 seconds
  useEffect(() => {
    if (currentFeatureIndex >= features.length - 1) return;
    const interval = setInterval(() => {
      setCurrentFeatureIndex((i) => {
        const next = i + 1;
        setVisibleIcons((prev) => [...prev, next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentFeatureIndex, features.length]);

  // Ambient particle web effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Get node positions for particle targeting
    const getNodePositions = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const positions: { x: number; y: number }[] = [];

      // Add center
      if (centerRef.current) {
        const r = centerRef.current.getBoundingClientRect();
        positions.push({
          x: r.left - canvasRect.left + r.width / 2,
          y: r.top - canvasRect.top + r.height / 2,
        });
      }

      // Add all visible icons
      iconRefs.current.forEach((icon, index) => {
        if (icon && visibleIcons.includes(index)) {
          const r = icon.getBoundingClientRect();
          positions.push({
            x: r.left - canvasRect.left + r.width / 2,
            y: r.top - canvasRect.top + r.height / 2,
          });
        }
      });

      return positions;
    };

    // Add particles for new icons
    const expectedCount = (visibleIcons.length + 1) * 15; // +1 for center, 12 particles per node
    while (particlesRef.current.length < expectedCount) {
      const positions = getNodePositions();
      if (positions.length === 0) break;

      const startIdx = Math.floor(Math.random() * positions.length);
      const targetIdx = Math.floor(Math.random() * positions.length);
      const startPos = positions[startIdx];
      const targetPos = positions[targetIdx];
      
      if (!startPos || !targetPos) break;

      particlesRef.current.push({
        x: startPos.x,
        y: startPos.y,
        targetX: targetPos.x,
        targetY: targetPos.y,
        vx: 0,
        vy: 0,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 80 + 180,
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const positions = getNodePositions();
      if (positions.length === 0 || particlesRef.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Pick new target when close
        if (distance < 10 && positions.length > 0) {
          const targetIdx = Math.floor(Math.random() * positions.length);
          const newTarget = positions[targetIdx];
          if (newTarget) {
            particle.targetX = newTarget.x;
            particle.targetY = newTarget.y;
          }
        }

        // Apply physics
        particle.vx += dx * 0.00015;
        particle.vy += dy * 0.00015;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();

        // Draw web lines to nearby particles (within 150px)
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          if (!other) continue;
          
          const lineDistance = Math.sqrt(
            Math.pow(other.x - particle.x, 2) + Math.pow(other.y - particle.y, 2)
          );

          if (lineDistance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            const lineOpacity = (1 - lineDistance / 150) * particle.opacity * 0.4;
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [visibleIcons]);

  const getIconPosition = (angle: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const centerY = 60; // Position center at 60% from top
    return { x: 50 + radius * Math.cos(rad), y: centerY + radius * Math.sin(rad) };
  };

  const stars = Array.from({ length: 20 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-visible">
      {/* Canvas for ambient particle web */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: visibleIcons.length > 0 ? 1 : 0,
          transition: "opacity 0.5s",
        }}
      />

      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {/* Text */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 max-w-3xl text-center px-6">
        <div key={currentFeatureIndex} className="animate-fade-in">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {features[currentFeatureIndex]?.title}
          </span>
          <span className="text-2xl font-medium text-slate-200">
            : {features[currentFeatureIndex]?.subtitle}
          </span>
        </div>
      </div>

      {/* Center Icon */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={centerRef} className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-cyan-400 to-blue-600 p-[3px] animate-spin-slow">
            <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-cyan-400 to-blue-600 blur-xl opacity-40 animate-pulse-slow" />
        </div>
      </div>

      {/* Feature icons */}
      {features.map((feature, i) => {
        if (!visibleIcons.includes(i)) return null;
        const Icon = feature.icon;
        const pos = getIconPosition(feature.angle, 35);
        return (
          <div
            key={i}
            ref={(el) => (iconRefs.current[i] = el)}
            className="absolute transition-all duration-500"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="animate-fade-in">
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[2px] shadow-lg`}
                >
                  <div className="w-full h-full bg-slate-950/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-lg opacity-50`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
