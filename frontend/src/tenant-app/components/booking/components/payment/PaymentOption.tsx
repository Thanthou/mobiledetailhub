import React from 'react';

import { PaymentIcons } from '@/shared/ui/icons/PaymentIcons';

type PaymentOptionProps = {
  id: 'card' | 'apple-pay' | 'google-pay' | 'paypal';
  label: string;
  selected: boolean;
  onSelect: (id: PaymentOptionProps['id']) => void;
  icon: string;
};

export const PaymentOption: React.FC<PaymentOptionProps> = ({ 
  id, 
  label, 
  selected, 
  onSelect, 
  icon 
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        onSelect(id);
      }}
      className={[
        'px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-3 min-h-[48px] w-full',
        selected 
          ? 'border-orange-500 bg-orange-500/20' 
          : 'border-stone-600 hover:border-stone-500'
      ].join(' ')}
      aria-pressed={selected}
      aria-label={label}
    >
      <div className={`${icon.startsWith('/') ? 'h-6 w-6' : 'h-5 w-5'} flex items-center justify-center flex-shrink-0`}>
        {icon.startsWith('/') ? (
          <img 
            src={icon} 
            alt={label} 
            className="h-6 w-auto max-w-full"
          />
        ) : icon in PaymentIcons ? (
          React.createElement(PaymentIcons[icon as keyof typeof PaymentIcons], { 
            className: "h-5 w-5" 
          })
        ) : (
          <span className="text-lg">{icon}</span>
        )}
      </div>
      <span className="text-white text-sm font-medium truncate">{label}</span>
    </button>
  );
};
