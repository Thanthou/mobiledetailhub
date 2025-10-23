import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="min-h-screen bg-gray-900 py-24 px-4 snap-start snap-always flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions? We're here to help you get started
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-6 mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
            <a href="mailto:support@thatsmartsite.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              support@thatsmartsite.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 mx-auto">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              Start a conversation
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-pink-500/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-6 mx-auto">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
            <a href="tel:+1234567890" className="text-pink-400 hover:text-pink-300 transition-colors">
              (123) 456-7890
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">Ready to transform your online presence?</p>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-full text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}

