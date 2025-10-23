import { useEffect, useState } from 'react';
import { TrendingUp, Users, Calendar, Star, Sparkles } from 'lucide-react';

interface Widget {
  id: string;
  visible: boolean;
  value: number;
}

export default function AnalyticsDashboardDemo() {
  const [step, setStep] = useState(0);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'visitors', visible: false, value: 0 },
    { id: 'bookings', visible: false, value: 0 },
    { id: 'revenue', visible: false, value: 0 },
    { id: 'reviews', visible: false, value: 0 }
  ]);
  const [lineProgress, setLineProgress] = useState(0);
  const [barHeights, setBarHeights] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [botPosition, setBotPosition] = useState({ x: -100, y: -100, active: false });
  const [pulses, setPulses] = useState<{ id: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStep(0);
        setWidgets([
          { id: 'visitors', visible: false, value: 0 },
          { id: 'bookings', visible: false, value: 0 },
          { id: 'revenue', visible: false, value: 0 },
          { id: 'reviews', visible: false, value: 0 }
        ]);
        setLineProgress(0);
        setBarHeights([0, 0, 0, 0, 0, 0, 0]);
        setBotPosition({ x: -100, y: -100, active: false });
        setPulses([]);

        await new Promise(resolve => setTimeout(resolve, 800));
        setStep(1);

        await new Promise(resolve => setTimeout(resolve, 400));
        setWidgets(prev => prev.map((w, i) => i === 0 ? { ...w, visible: true } : w));

        await new Promise(resolve => setTimeout(resolve, 300));
        setWidgets(prev => prev.map((w, i) => i === 1 ? { ...w, visible: true } : w));

        await new Promise(resolve => setTimeout(resolve, 300));
        setWidgets(prev => prev.map((w, i) => i === 2 ? { ...w, visible: true } : w));

        await new Promise(resolve => setTimeout(resolve, 300));
        setWidgets(prev => prev.map((w, i) => i === 3 ? { ...w, visible: true } : w));

        await new Promise(resolve => setTimeout(resolve, 600));
        setStep(2);

        for (let i = 0; i <= 100; i += 2) {
          await new Promise(resolve => setTimeout(resolve, 15));
          setLineProgress(i);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
        setStep(3);

        const targetHeights = [45, 60, 55, 75, 65, 80, 90];
        for (let i = 0; i <= 100; i += 3) {
          await new Promise(resolve => setTimeout(resolve, 15));
          setBarHeights(targetHeights.map(h => (h * i) / 100));
        }

        await new Promise(resolve => setTimeout(resolve, 600));
        setStep(5);

        const positions = [
          { x: 20, y: 20 },
          { x: 50, y: 20 },
          { x: 20, y: 50 },
          { x: 50, y: 50 },
          { x: 35, y: 75 },
          { x: 65, y: 75 }
        ];

        for (const pos of positions) {
          setBotPosition({ x: pos.x, y: pos.y, active: true });
          setPulses(prev => [...prev, { id: Math.random().toString(), x: pos.x, y: pos.y }]);
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        setBotPosition({ x: -100, y: -100, active: false });

        await new Promise(resolve => setTimeout(resolve, 400));
        setStep(6);

        setWidgets(prev => prev.map(w => ({
          ...w,
          value: w.id === 'visitors' ? 2847 :
                 w.id === 'bookings' ? 143 :
                 w.id === 'revenue' ? 12450 :
                 w.id === 'reviews' ? 4.9 : 0
        })));

        for (let tick = 0; tick < 5; tick++) {
          await new Promise(resolve => setTimeout(resolve, 600));
          setWidgets(prev => prev.map(w => ({
            ...w,
            value: w.id === 'visitors' ? w.value + Math.floor(Math.random() * 5 + 1) :
                   w.id === 'bookings' ? w.value + (Math.random() > 0.7 ? 1 : 0) :
                   w.id === 'revenue' ? w.value + Math.floor(Math.random() * 150 + 50) :
                   w.value
          })));

          if (Math.random() > 0.5) {
            setPulses(prev => [...prev, {
              id: Math.random().toString(),
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10
            }]);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    sequence();
  }, []);

  const linePoints = [
    { x: 0, y: 80 },
    { x: 14, y: 75 },
    { x: 28, y: 70 },
    { x: 42, y: 60 },
    { x: 56, y: 55 },
    { x: 70, y: 40 },
    { x: 84, y: 30 },
    { x: 100, y: 20 }
  ];

  const getLinePath = () => {
    const visiblePoints = linePoints.slice(0, Math.ceil((linePoints.length * lineProgress) / 100));
    if (visiblePoints.length < 2) return '';
    return visiblePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-5xl">
        <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
          <div className="bg-slate-900/80 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-slate-800/80 px-4 py-1.5 rounded-lg text-slate-400 text-sm font-mono max-w-xs truncate">
                yourbusiness.com/analytics
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-violet-950/30 to-fuchsia-950/20 relative overflow-hidden" style={{ height: '805px' }}>
            {step === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-slate-400 font-medium">Loading dashboard...</p>
                </div>
              </div>
            )}

            {step >= 1 && (
              <div className="absolute inset-0 p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 transition-all duration-500 ${
                        widget.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-slate-400 text-xs font-medium mb-1">
                            {widget.id === 'visitors' ? 'Total Visitors' :
                             widget.id === 'bookings' ? 'Bookings' :
                             widget.id === 'revenue' ? 'Revenue' :
                             'Reviews'}
                          </div>
                          <div className="text-white text-2xl font-bold">
                            {step >= 6 ? (
                              widget.id === 'revenue' ? `$${widget.value.toLocaleString()}` :
                              widget.id === 'reviews' ? `⭐ ${widget.value}` :
                              widget.value.toLocaleString()
                            ) : (
                              widget.id === 'reviews' ? '⭐ --' : '--'
                            )}
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                          widget.id === 'visitors' ? 'from-violet-400 to-fuchsia-500' :
                          widget.id === 'bookings' ? 'from-blue-400 to-cyan-500' :
                          widget.id === 'revenue' ? 'from-emerald-400 to-teal-500' :
                          'from-amber-400 to-orange-500'
                        } flex items-center justify-center`}>
                          {widget.id === 'visitors' && <Users className="w-5 h-5 text-white" />}
                          {widget.id === 'bookings' && <Calendar className="w-5 h-5 text-white" />}
                          {widget.id === 'revenue' && <TrendingUp className="w-5 h-5 text-white" />}
                          {widget.id === 'reviews' && <Star className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                      {step >= 6 && (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{widget.id === 'revenue' ? '12' : widget.id === 'visitors' ? '8' : '5'}% this week</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className={`col-span-2 bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 transition-all duration-500 ${
                    step >= 2 ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="text-slate-400 text-xs font-medium mb-4">Visitor Trends (7 Days)</div>
                    <div className="relative h-32">
                      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#e879f9" />
                          </linearGradient>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {step >= 2 && (
                          <>
                            <path
                              d={`${getLinePath()} L 100 100 L 0 100 Z`}
                              fill="url(#areaGradient)"
                            />
                            <path
                              d={getLinePath()}
                              stroke="url(#lineGradient)"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </>
                        )}
                      </svg>
                    </div>
                  </div>

                  <div className={`bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 transition-all duration-500 ${
                    step >= 3 ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="text-slate-400 text-xs font-medium mb-4">Weekly Bookings</div>
                    <div className="flex items-end justify-between h-32 gap-1.5">
                      {barHeights.map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-300"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {botPosition.active && (
                  <div
                    className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center transition-all duration-300 pointer-events-none"
                    style={{
                      left: `${botPosition.x}%`,
                      top: `${botPosition.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                )}

                {pulses.map(pulse => (
                  <div
                    key={pulse.id}
                    className="absolute w-4 h-4 rounded-full bg-violet-400/50 animate-ping pointer-events-none"
                    style={{
                      left: `${pulse.x}%`,
                      top: `${pulse.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}

                {step === 6 && (
                  <div className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-2xl border border-violet-500/50 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 animate-ping opacity-75" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Auto-Updating</div>
                        <div className="text-fuchsia-400 text-xs">Real-time insights</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

