import { useEffect, useState } from 'react';
import { Check, Lock, CreditCard, Calendar, Clock, Mail, Sparkles } from 'lucide-react';

export default function SecureBookingDemo() {
  const [step, setStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStep(0);
        setCursorPos({ x: 0, y: 0, visible: false });
        setSelectedService('');
        setSelectedDate('');
        setSelectedTime('');
        setCardNumber('');
        setButtonState('idle');
        setShowConfirmation(false);

        await new Promise(resolve => setTimeout(resolve, 800));
        setStep(1);

        await new Promise(resolve => setTimeout(resolve, 600));
        setCursorPos({ x: 30, y: 28, visible: true });

        await new Promise(resolve => setTimeout(resolve, 400));
        setStep(2);
        setSelectedService('Full Detail');

        await new Promise(resolve => setTimeout(resolve, 400));
        setCursorPos({ x: 30, y: 38, visible: true });

        await new Promise(resolve => setTimeout(resolve, 400));
        setStep(3);
        setSelectedDate('Tue, Oct 24');

        await new Promise(resolve => setTimeout(resolve, 400));
        setCursorPos({ x: 70, y: 38, visible: true });

        await new Promise(resolve => setTimeout(resolve, 400));
        setStep(4);
        setSelectedTime('2:00 PM');

        await new Promise(resolve => setTimeout(resolve, 400));
        setCursorPos({ x: 50, y: 52, visible: true });

        await new Promise(resolve => setTimeout(resolve, 300));
        setStep(5);

        const cardDigits = '•••• •••• •••• 4242';
        for (let i = 0; i <= cardDigits.length; i++) {
          setCardNumber(cardDigits.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 40));
        }

        await new Promise(resolve => setTimeout(resolve, 600));
        setCursorPos({ x: 50, y: 68, visible: true });

        await new Promise(resolve => setTimeout(resolve, 400));
        setStep(6);
        setButtonState('loading');

        await new Promise(resolve => setTimeout(resolve, 1500));
        setButtonState('success');

        await new Promise(resolve => setTimeout(resolve, 600));
        setShowConfirmation(true);
        setCursorPos({ x: 0, y: 0, visible: false });

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
                yourbusiness.com/book
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-emerald-950/20 to-green-950/10 relative overflow-hidden" style={{ height: '805px' }}>
            {!showConfirmation ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-6 animate-fade-in">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white">Book Appointment</h2>
                    <p className="text-slate-400 text-sm">Choose your service and schedule online</p>
                  </div>

                  <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 space-y-5">
                    <div className="space-y-2">
                      <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Select Service
                      </label>
                      <div className={`bg-slate-800/80 border rounded-lg px-4 py-3 transition-all duration-300 ${
                        step >= 2 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-600'
                      }`}>
                        <div className="text-white font-medium">
                          {selectedService || 'Choose a service...'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          Date
                        </label>
                        <div className={`bg-slate-800/80 border rounded-lg px-4 py-3 transition-all duration-300 ${
                          step >= 3 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-600'
                        }`}>
                          <div className="text-white text-sm">
                            {selectedDate || 'Pick a date'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-violet-400" />
                          Time
                        </label>
                        <div className={`bg-slate-800/80 border rounded-lg px-4 py-3 transition-all duration-300 ${
                          step >= 4 ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-600'
                        }`}>
                          <div className="text-white text-sm">
                            {selectedTime || 'Pick a time'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                        Payment Information
                      </label>
                      <div className={`bg-slate-800/80 border rounded-lg px-4 py-3 transition-all duration-300 ${
                        step >= 5 ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-600'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="text-white font-mono text-sm">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Lock className="w-3 h-3" />
                            Secure
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
                          <div className="text-white text-[8px] font-bold">S</div>
                        </div>
                        <span>Powered by Stripe</span>
                      </div>
                    </div>

                    <button
                      className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                        buttonState === 'idle' ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25' :
                        buttonState === 'loading' ? 'bg-gradient-to-r from-emerald-600 to-green-700' :
                        'bg-gradient-to-r from-emerald-600 to-green-700'
                      }`}
                    >
                      {buttonState === 'idle' && (
                        <>
                          <Lock className="w-5 h-5" />
                          Book Now - $85
                        </>
                      )}
                      {buttonState === 'loading' && (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      )}
                      {buttonState === 'success' && (
                        <>
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center animate-scale-in">
                            <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                          </div>
                          Payment Confirmed
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 animate-fade-in">
                <div className="w-full max-w-md text-center space-y-6">
                  <div className="relative inline-flex">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center animate-scale-in">
                      <Check className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 animate-ping opacity-20" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-white">Appointment Confirmed!</h3>
                    <p className="text-slate-300">Your booking has been successfully scheduled</p>
                  </div>

                  <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Service</span>
                      <span className="text-white font-medium">Full Detail</span>
                    </div>
                    <div className="h-px bg-slate-700/50" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Date & Time</span>
                      <span className="text-white font-medium">Tue, Oct 24 at 2:00 PM</span>
                    </div>
                    <div className="h-px bg-slate-700/50" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Amount Paid</span>
                      <span className="text-emerald-400 font-bold text-lg">$85.00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>Confirmation sent to your email</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-semibold">SECURE CHECKOUT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {cursorPos.visible && (
              <div
                className="absolute pointer-events-none transition-all duration-500 ease-out"
                style={{
                  left: `${cursorPos.x}%`,
                  top: `${cursorPos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                  <path
                    d="M5 3L19 12L12 13L9 19L5 3Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-green-500/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

