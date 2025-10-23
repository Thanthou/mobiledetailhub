import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SearchResult {
  position: number;
  isYours: boolean;
  title: string;
  url: string;
  description: string;
}

export default function AutomatedSEODemo() {
  const [step, setStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [optimizingPosition, setOptimizingPosition] = useState<number | null>(null);

  const fullQuery = 'car detailing near me';

  const initialResults: SearchResult[] = [
    { position: 1, isYours: false, title: 'Premium Auto Spa - Professional Detailing', url: 'premiumautospa.com', description: 'Professional car detailing services with 20 years experience...' },
    { position: 2, isYours: false, title: 'Elite Car Care - Best in Town', url: 'elitecarcare.com', description: 'Top rated car detailing services. Book online today...' },
    { position: 3, isYours: false, title: 'Shine & Detail Pro Services', url: 'shinedetailpro.com', description: 'Expert car detailing and wash services. Affordable prices...' },
    { position: 4, isYours: false, title: 'Mobile Detailing Express', url: 'mobiledetailingexpress.com', description: 'We come to you. Professional mobile car detailing...' },
    { position: 5, isYours: false, title: 'Auto Wash & Detail Center', url: 'autowashdetail.com', description: 'Full service car wash and detailing. Open 7 days...' },
    { position: 6, isYours: false, title: 'Luxury Car Detailing Studio', url: 'luxurycardetailing.com', description: 'Premium detailing for luxury vehicles. Expert care...' },
    { position: 7, isYours: false, title: 'Quick Shine Mobile Detail', url: 'quickshinemobile.com', description: 'Fast and affordable mobile detailing services...' },
    { position: 8, isYours: true, title: 'Your Car Detailing Business', url: 'yoursite.com', description: 'Professional mobile car detailing services in your area...' },
  ];

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStep(0);
        setSearchQuery('');
        setResults([]);
        setOptimizingPosition(null);

        await new Promise(resolve => setTimeout(resolve, 800));
        setStep(1);

        for (let i = 0; i <= fullQuery.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setSearchQuery(fullQuery.substring(0, i));
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        setStep(2);
        setResults(initialResults);

        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(3);

        for (let pos = 8; pos >= 1; pos--) {
          setResults(prev => {
            const newResults = [...prev];
            const yourIndex = newResults.findIndex(r => r.isYours);

            setOptimizingPosition(yourIndex + 1);

            if (yourIndex > 0) {
              [newResults[yourIndex], newResults[yourIndex - 1]] = [newResults[yourIndex - 1], newResults[yourIndex]];
              newResults[yourIndex].position = yourIndex + 1;
              newResults[yourIndex - 1].position = yourIndex;
            }

            return newResults;
          });

          await new Promise(resolve => setTimeout(resolve, 600));
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        setOptimizingPosition(null);
        setStep(4);

        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    };

    sequence();
  }, []);

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
                google.com/search
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden" style={{ height: '805px' }}>
            {step === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-slate-900">Google</div>
                  <div className="w-[500px] h-12 bg-white rounded-full shadow-lg border border-slate-300" />
                </div>
              </div>
            )}

            {step >= 1 && (
              <div className="absolute inset-0">
                <div className="bg-white h-16 flex items-center px-8 shadow-sm border-b border-slate-200">
                  <div className="text-xl font-bold text-slate-900 mr-8">Google</div>
                  <div className="flex-1 max-w-2xl">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        readOnly
                        className="w-full px-4 py-2 bg-slate-50 rounded-full border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none"
                      />
                      {step === 1 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
                  {results.map((result, index) => {
                    const isOptimizing = optimizingPosition === result.position;
                    const isYourResult = result.isYours;

                    return (
                      <div
                        key={index}
                        className={`relative transition-all duration-300 ${
                          isOptimizing ? 'scale-105' : ''
                        } ${
                          step === 4 && isYourResult ? 'animate-pulse-glow' : ''
                        }`}
                        style={{
                          transform: `translateY(${index * 0}px)`,
                        }}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          isYourResult && step >= 3
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400'
                            : 'bg-white'
                        }`}>
                          <div className="flex items-start gap-2">
                            <div className={`text-sm font-bold shrink-0 w-8 ${
                              isYourResult && step >= 3 ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                              #{result.position}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0">
                                <div className="text-xs text-slate-600 truncate">{result.url}</div>
                              </div>
                              <h3 className={`text-sm font-medium mb-0 ${
                                isYourResult && step >= 3 ? 'text-blue-700' : 'text-blue-600'
                              } hover:underline cursor-pointer truncate`}>
                                {result.title}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-1">
                                {result.description}
                              </p>
                            </div>

                            {isOptimizing && (
                              <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}

                            {isYourResult && step === 4 && (
                              <div className="absolute -right-2 -top-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                                #1
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {step >= 3 && optimizingPosition !== null && (
                  <div className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-2xl border border-blue-500/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 animate-ping opacity-75" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Optimizing SEO...</div>
                        <div className="text-cyan-400 text-xs">Improving rankings</div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="relative">
                      {[...Array(3)].map((_, i) => (
                        <Sparkles
                          key={i}
                          className="absolute w-8 h-8 text-blue-500 animate-sparkle"
                          style={{
                            left: `${Math.cos((i * 2 * Math.PI) / 3) * 100}px`,
                            top: `${Math.sin((i * 2 * Math.PI) / 3) * 100}px`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
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

