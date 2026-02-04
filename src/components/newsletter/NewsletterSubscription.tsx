import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, AlertCircle, Sparkles } from 'lucide-react';

interface NewsletterSubscriptionProps {
  variant?: 'default' | 'minimal' | 'sidebar';
  className?: string;
}

export function NewsletterSubscription({ variant = 'default', className = '' }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // Simulate API call - replace with actual newsletter service
    try {
      // Example: integrate with ConvertKit, Mailchimp, or custom service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll simulate success
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
      
      // Track subscription event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_subscription', {
          email_address: email,
          source: variant
        });
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sinai-cyan focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-sinai-magenta hover:bg-sinai-maroon-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {status === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : status === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 text-sm ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`bg-gradient-to-br from-sinai-navy/5 to-sinai-violet/5 rounded-xl p-6 ${className}`}
      >
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-sinai-magenta rounded-xl mb-3">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-sinai-navy mb-2">Stay Updated</h3>
          <p className="text-sm text-gray-600">
            Get the latest insights on healthcare AI and agentic development
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === 'loading'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sinai-cyan focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-sinai-cyan hover:bg-sinai-navy disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subscribing...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-3 rounded-lg flex items-start gap-2 text-sm ${
              status === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status === 'success' ? (
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Default variant - full section
  return (
    <section className={`bg-gradient-to-r from-sinai-navy to-sinai-violet py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay at the Forefront of Healthcare AI
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading clinicians and developers who get exclusive insights on agentic AI, 
            secure healthcare development, and cutting-edge medical technology delivered weekly.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === 'loading'}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-sinai-magenta hover:bg-sinai-maroon-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Subscribe
                  </>
                )}
              </button>
            </div>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                status === 'success'
                  ? 'bg-green-500/20 text-green-100 border border-green-500/30'
                  : 'bg-red-500/20 text-red-100 border border-red-500/30'
              }`}>
                {status === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            </motion.div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            No spam, ever. Unsubscribe at any time. Read our{' '}
            <a href="/privacy" className="text-sinai-cyan hover:underline">
              privacy policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}