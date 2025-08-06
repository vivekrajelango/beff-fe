'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle early access signup
    console.log('Early access signup:', email);
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i * 0.1) % 3}s`
            }}
          />
        ))}
      </div>

      {/* Planets */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-sm opacity-70" />
      <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-sm opacity-60" />
      <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-sm opacity-50" />
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-green-400 to-teal-500 rounded-full blur-sm opacity-40" />

      <Navigation currentPage="landing" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Launch Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              SaaS Adventure
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The ultimate platform for building, scaling, and managing your SaaS business. 
            Join thousands of entrepreneurs who trust StellarSaaS.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
             <Link 
               href="/auth"
               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
             >
               Start Free Trial
             </Link>
            <button className="border border-white/30 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>

          {/* Early Access Form */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
            <h3 className="text-white text-xl font-semibold mb-4">
              Get Early Access
            </h3>
            {!isSubscribed ? (
              <form onSubmit={handleEarlyAccess} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-green-400 text-lg font-semibold mb-2">✓ You're on the list!</div>
                <p className="text-white/70 text-sm">We'll notify you when we launch.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose StellarSaaS?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Fast Launch</h3>
              <p className="text-gray-300">
                Get your SaaS up and running in minutes, not months. Our platform handles the heavy lifting.
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Analytics</h3>
              <p className="text-gray-300">
                Comprehensive analytics and insights to help you make data-driven decisions.
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Secure</h3>
              <p className="text-gray-300">
                Enterprise-grade security with GDPR compliance and data protection built-in.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-white text-xl font-bold mb-4 md:mb-0">
            StellarSaaS
          </div>
          <div className="flex space-x-6 text-gray-300">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}