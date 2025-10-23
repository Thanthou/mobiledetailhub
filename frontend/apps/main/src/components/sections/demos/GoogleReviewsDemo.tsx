import { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';

interface Review {
  name: string;
  text: string;
  visible: boolean;
}

export default function GoogleReviewsDemo() {
  const [starsFilled, setStarsFilled] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([
    { name: 'Sarah M.', text: 'Amazing service! Highly recommend.', visible: false },
    { name: 'John D.', text: 'Professional and fast turnaround.', visible: false },
    { name: 'Emily R.', text: 'Exceeded all my expectations!', visible: false }
  ]);
  const [syncBadgeVisible, setSyncBadgeVisible] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStarsFilled(0);
        setReviews(prev => prev.map(r => ({ ...r, visible: false })));
        setSyncBadgeVisible(false);
        setPulseActive(false);

        await new Promise(resolve => setTimeout(resolve, 800));
        setPulseActive(true);

        await new Promise(resolve => setTimeout(resolve, 600));

        for (let i = 1; i <= 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setStarsFilled(i);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
        setPulseActive(false);

        for (let i = 0; i < reviews.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setReviews(prev => prev.map((r, idx) =>
            idx === i ? { ...r, visible: true } : r
          ));
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        setSyncBadgeVisible(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        for (let i = reviews.length - 1; i >= 0; i--) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setReviews(prev => prev.map((r, idx) =>
            idx === i ? { ...r, visible: false } : r
          ));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
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
                yoursite.com/reviews
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-green-950 relative overflow-hidden flex items-center justify-center" style={{ height: '805px' }}>
            <div className="relative w-full max-w-2xl px-8">
              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className={`flex gap-3 transition-all duration-300 ${pulseActive ? 'scale-110' : 'scale-100'}`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="relative">
                        <Star
                          className={`w-16 h-16 transition-all duration-300 ${
                            star <= starsFilled
                              ? 'fill-yellow-400 text-yellow-400 scale-100 opacity-100'
                              : 'text-slate-600 scale-90 opacity-40'
                          }`}
                          style={{
                            filter: star <= starsFilled ? 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' : 'none'
                          }}
                        />
                        {/* Individual star ping during filling (1-4) */}
                        {star === starsFilled && starsFilled < 5 && (
                          <div className="absolute inset-0 animate-ping">
                            <Star className="w-16 h-16 text-yellow-400 opacity-75" />
                          </div>
                        )}
                        {/* All stars ping when complete (5) */}
                        {starsFilled === 5 && star <= 5 && (
                          <div className="absolute inset-0 animate-ping">
                            <Star className="w-16 h-16 text-yellow-400 opacity-75" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {pulseActive && (
                    <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-blue-500/20 via-yellow-500/20 to-green-500/20 blur-2xl animate-pulse" />
                  )}
                </div>

                <div className="w-full space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 transform ${
                        review.visible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-sm">{review.name}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm">{review.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`transition-all duration-500 transform ${
                    syncBadgeVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 via-green-500/20 to-yellow-500/20 border border-blue-400/30 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-blue-200">
                      Synced automatically from Google
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

