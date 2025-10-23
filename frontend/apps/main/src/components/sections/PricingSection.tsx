import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const tiers = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for new businesses',
      features: [
        'Professional website',
        'Mobile responsive',
        'Basic SEO optimization',
        'Contact forms',
        'Google Maps integration',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Metro',
      price: '$199',
      period: '/month',
      description: 'Most popular for growing businesses',
      features: [
        'Everything in Starter',
        'Advanced SEO tools',
        'Google Reviews integration',
        'Booking system',
        'Analytics dashboard',
        'Priority support',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Pro',
      price: '$299',
      period: '/month',
      description: 'For established businesses',
      features: [
        'Everything in Metro',
        'Custom domain',
        'Advanced analytics',
        'API access',
        'White-label options',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="min-h-screen bg-gray-950 py-24 px-4 snap-start snap-always flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 ${
                tier.highlighted
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105'
                  : 'border-gray-800'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full">
                  <span className="text-white font-semibold text-sm">Most Popular</span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-gray-400 mb-6">{tier.description}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">{tier.price}</span>
                <span className="text-gray-400 text-lg">{tier.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

