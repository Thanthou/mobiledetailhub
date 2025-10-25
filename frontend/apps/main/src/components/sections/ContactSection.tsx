import { Mail, MessageSquare, Phone, Facebook, Twitter, Youtube } from 'lucide-react';

interface ContactSectionProps {
  onGetStarted?: () => void;
}

export default function ContactSection({ onGetStarted }: ContactSectionProps) {
  return (
    <section id="contact" className="min-h-screen bg-gray-900 py-24 px-4 snap-start snap-always flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions? We're here to help you get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-6 mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
            <a href="mailto:support@thatsmartsite.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              support@thatsmartsite.com
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-pink-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-6 mx-auto">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
            <button className="text-pink-400 hover:text-pink-300 transition-colors">
              Start a conversation
            </button>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 mx-auto">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
            <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 transition-colors">
              (123) 456-7890
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-16">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
          >
            <Facebook className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:border-sky-500 hover:bg-sky-500/10 transition-all group"
          >
            <Twitter className="w-6 h-6 text-gray-400 group-hover:text-sky-500 transition-colors" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 transition-all group"
          >
            <Youtube className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:border-pink-500 hover:bg-pink-500/10 transition-all group"
          >
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
            </svg>
          </a>
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-6">Ready to transform your online presence?</p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-full text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}

