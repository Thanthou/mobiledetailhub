import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function IndustryTemplatesDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStep(0);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStep(1);
        await new Promise(resolve => setTimeout(resolve, 1200));

        setStep(2);
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
                {step === 0 ? 'cluttered-site.com' : 'yourbusiness.com'}
              </div>
            </div>
          </div>

          <div className="bg-white relative overflow-hidden" style={{ height: '805px' }}>
            {step === 0 && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 animate-fade-in">
                <div className="absolute inset-0 p-4 overflow-hidden">
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded rotate-[-2deg] animate-bounce shadow-lg z-10">
                    SALE! 50% OFF
                  </div>

                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    NEW!
                  </div>

                  <div className="absolute top-16 left-4 w-48 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg opacity-80 shadow-lg transform rotate-3">
                    <div className="p-3 text-white text-sm font-bold">Featured Product</div>
                  </div>

                  <div className="absolute top-20 right-8 w-40 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-90 shadow-md transform -rotate-2">
                    <div className="p-2 text-white text-xs">Subscribe Now!</div>
                  </div>

                  <div className="absolute bottom-32 left-8 w-56 h-28 bg-orange-400 rounded-lg opacity-85 shadow-lg transform rotate-[-5deg]">
                    <div className="p-3 text-white font-bold">Limited Time Offer!</div>
                  </div>

                  <div className="absolute bottom-24 right-12 w-44 h-36 bg-gradient-to-t from-green-500 to-teal-400 rounded-lg opacity-75 shadow-md transform rotate-6">
                    <div className="p-2 text-white text-sm">Join Today</div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-white/90 rounded-lg shadow-2xl border-4 border-red-500 z-20 animate-pulse">
                    <div className="p-3 text-center">
                      <p className="text-red-600 font-black text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        CLICK HERE NOW!!!
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 h-16 bg-slate-700 opacity-70 rounded flex items-center justify-around px-4">
                    <div className="text-white text-xs opacity-60">Link 1</div>
                    <div className="text-white text-xs opacity-60">Link 2</div>
                    <div className="text-white text-xs opacity-60">Link 3</div>
                    <div className="text-white text-xs opacity-60">Link 4</div>
                    <div className="text-white text-xs opacity-60">Link 5</div>
                    <div className="text-white text-xs opacity-60">Link 6</div>
                  </div>

                  <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-yellow-300 rounded-full animate-ping opacity-50" />
                  <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-pink-400 rounded-full animate-bounce opacity-60" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
                  <div className="absolute inset-0 p-4 overflow-hidden opacity-80 blur-sm">
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded rotate-[-2deg] shadow-lg z-10">
                      SALE! 50% OFF
                    </div>
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW!
                    </div>
                    <div className="absolute top-16 left-4 w-48 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg transform rotate-3" />
                    <div className="absolute top-20 right-8 w-40 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md transform -rotate-2" />
                    <div className="absolute bottom-32 left-8 w-56 h-28 bg-orange-400 rounded-lg shadow-lg transform rotate-[-5deg]" />
                    <div className="absolute bottom-24 right-12 w-44 h-36 bg-gradient-to-t from-green-500 to-teal-400 rounded-lg shadow-md transform rotate-6" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-white/90 rounded-lg shadow-2xl border-4 border-red-500 z-20" />
                    <div className="absolute bottom-4 left-4 right-4 h-16 bg-slate-700 rounded" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-rose-500/30 to-red-500/20 animate-sweep" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center animate-pulse shadow-2xl">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-rose-500 animate-ping opacity-75" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="absolute inset-0 bg-white animate-fade-in">
                <div className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-20">
                  <div className="text-xl font-bold text-slate-900">
                    Elite Detailing
                  </div>
                  <div className="flex gap-6 text-sm text-slate-600 font-medium">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Services</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Reviews</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Gallery</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Contact</span>
                  </div>
                </div>

                <div className="pt-16 h-full flex flex-col">
                  <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 px-12 py-16 flex items-center justify-center">
                    <div className="max-w-2xl text-center space-y-6 animate-slide-up">
                      <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                        Premium Mobile Detailing
                      </h1>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        Professional car care that comes to you. Book online in 60 seconds.
                      </p>
                      <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
                        Book Now
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border-t border-slate-200 px-12 py-8">
                    <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
                      <div className="text-center space-y-2 p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm">Interior Detail</h3>
                        <p className="text-xs text-slate-600">Deep clean & protection</p>
                      </div>

                      <div className="text-center space-y-2 p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm">Exterior Polish</h3>
                        <p className="text-xs text-slate-600">Paint correction & wax</p>
                      </div>

                      <div className="text-center space-y-2 p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm">Full Package</h3>
                        <p className="text-xs text-slate-600">Complete transformation</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 px-8 py-4 text-center">
                    <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                      <span>© 2024 Elite Detailing</span>
                      <span>•</span>
                      <span>(555) 123-4567</span>
                      <span>•</span>
                      <span>info@elitedetailing.com</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-24 right-8 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-red-500/50 animate-fade-in z-30">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-xs">Conversion-Optimized</div>
                      <div className="text-rose-400 text-xs">Built for your industry</div>
                    </div>
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

