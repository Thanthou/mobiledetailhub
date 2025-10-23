import { useEffect, useState } from 'react';
import { MousePointer2, Check } from 'lucide-react';

export default function InstantLaunchDemo() {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const fullUrl = 'www.yoursite.com';

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStep(0);
        setUrl('');
        setSelectedPlan(null);
        setMousePos({ x: 0, y: 0 });

        await new Promise(resolve => setTimeout(resolve, 500));
        setStep(1);

        for (let progress = 0; progress <= 100; progress += 2) {
          await new Promise(resolve => setTimeout(resolve, 15));
          const x = (progress / 100) * 50;
          const y = (progress / 100) * 50;
          setMousePos({ x, y });
        }

        await new Promise(resolve => setTimeout(resolve, 200));
        setStep(2);

        await new Promise(resolve => setTimeout(resolve, 1200));
        setStep(3);

        for (let progress = 0; progress <= 100; progress += 2) {
          await new Promise(resolve => setTimeout(resolve, 10));
          const x = -30 + (progress / 100) * 30;
          const y = -20 + (progress / 100) * 20;
          setMousePos({ x, y });
        }

        await new Promise(resolve => setTimeout(resolve, 200));
        setSelectedPlan(1);
        setStep(4);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(5);

        for (let i = 0; i <= fullUrl.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 80));
          setUrl(fullUrl.substring(0, i));
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        setStep(6);

        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    };

    sequence();
  }, []);

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      features: ['5 Pages', 'Basic SEO', 'Mobile Responsive']
    },
    {
      name: 'Professional',
      price: '$79',
      features: ['15 Pages', 'Advanced SEO', 'Priority Support']
    },
    {
      name: 'Enterprise',
      price: '$149',
      features: ['Unlimited Pages', 'Custom Features', '24/7 Support']
    }
  ];

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
                {step >= 5 ? url || 'browser.com' : 'chooseyourplan.com'}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden" style={{ height: '805px' }}>
            {step === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg transition-shadow">
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-full shadow-lg scale-95">
                    Get Started
                  </button>
                  <MousePointer2
                    className="absolute w-6 h-6 text-white transition-all duration-75"
                    style={{
                      left: `calc(50% + ${mousePos.x}px)`,
                      top: `calc(50% + ${mousePos.y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="absolute inset-0 bg-white animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-8">
                  <div className="w-full max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Choose Your Plan</h2>
                    <div className="grid grid-cols-3 gap-6">
                      {pricingPlans.map((plan, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 transition-all duration-300"
                        >
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                          <div className="text-3xl font-bold text-slate-900 mb-4">{plan.price}<span className="text-sm text-slate-600">/mo</span></div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="absolute inset-0 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-8">
                  <div className="w-full max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Choose Your Plan</h2>
                    <div className="grid grid-cols-3 gap-6 relative">
                      {pricingPlans.map((plan, index) => (
                        <div
                          key={index}
                          className={`bg-white rounded-xl p-6 shadow-lg border transition-all duration-300 ${
                            index === 1 ? 'border-yellow-400 scale-105' : 'border-slate-200'
                          }`}
                        >
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                          <div className="text-3xl font-bold text-slate-900 mb-4">{plan.price}<span className="text-sm text-slate-600">/mo</span></div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button className={`w-full py-2 rounded-lg font-medium transition-colors relative ${
                            index === 1
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}>
                            Select
                          </button>
                        </div>
                      ))}
                      <MousePointer2
                        className="absolute w-6 h-6 text-slate-900 transition-all duration-75 pointer-events-none"
                        style={{
                          left: `calc(50% + ${mousePos.x}px)`,
                          top: `calc(50% + ${mousePos.y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="absolute inset-0 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-8">
                  <div className="w-full max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Choose Your Plan</h2>
                    <div className="grid grid-cols-3 gap-6">
                      {pricingPlans.map((plan, index) => (
                        <div
                          key={index}
                          className={`bg-white rounded-xl p-6 shadow-lg border transition-all duration-300 ${
                            index === selectedPlan ? 'border-green-500 scale-105' : 'border-slate-200 opacity-50'
                          }`}
                        >
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                          <div className="text-3xl font-bold text-slate-900 mb-4">{plan.price}<span className="text-sm text-slate-600">/mo</span></div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            index === selectedPlan
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {index === selectedPlan ? 'Selected ✓' : 'Select'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-slate-700 font-medium">Building your website...</p>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="absolute inset-0 bg-white animate-fade-in">
                <div className="absolute inset-0">
                  <div className="h-full flex flex-col">
                    <div className="absolute top-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
                      <div className="text-xl font-bold text-white drop-shadow-lg">
                        YourBrand
                      </div>
                      <div className="flex gap-6 text-sm text-white font-medium drop-shadow-lg">
                        <span>Home</span>
                        <span>About</span>
                        <span>Services</span>
                        <span>Contact</span>
                      </div>
                    </div>

                    <div className="relative flex-1">
                      <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
                      </div>

                      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center space-y-6 animate-slide-up">
                        <h1 className="text-4xl font-bold text-white drop-shadow-2xl">
                          Welcome to Your Site
                        </h1>
                        <p className="text-white/95 max-w-md drop-shadow-lg">
                          Your professional website is live and ready to grow your business.
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-2xl hover:scale-105 transition-transform">
                          Learn More
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900 px-8 py-6 text-center z-20">
                      <p className="text-slate-400 text-sm">© 2024 YourBrand. All rights reserved.</p>
                    </div>
                  </div>

                  <div className="absolute top-8 right-8 flex gap-2 z-30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white font-medium drop-shadow-lg">LIVE</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

