'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate passwords match for signup
      if (isSignUp && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const endpoint = isSignUp 
        ? 'https://beff-be.onrender.com/auth/signup'
        : 'https://beff-be.onrender.com/auth/login';

      const payload = isSignUp 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Navigate to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
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

      <div className="relative z-10 min-h-screen flex">


        {/* Main Form Section */}
        <div className="w-full flex items-center justify-center p-6">
          <div className="bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-white/10 w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold mb-2">
                {isSignUp ? 'SIGN UP' : 'SIGN IN'}
              </h2>
              <p className="text-white/70 text-sm">
                {isSignUp ? 'Create your account' : 'Sign in with email address'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Yourname@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                  required
                />
              </div>
              
              {isSignUp && (
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignUp ? 'Signing up...' : 'Signing in...'}
                  </>
                ) : (
                  isSignUp ? 'Sign up' : 'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-white/50 text-sm">Or continue with</p>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-3 px-4 transition-colors flex items-center justify-center">
                  <span className="text-white text-sm font-medium">LINE</span>
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-3 px-4 transition-colors flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Google</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            <div className="mt-6 text-center flex flex-row items-center justify-center">
              <button
                type="submit"
                onClick={()=>router.push('/')}
                className="w-1/3 bg-purple-400 hover:bg-purple-300 text-white font-semibold py-1 rounded-lg transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>

            {isSignUp && (
              <div className="mt-4 text-center">
                <p className="text-white/50 text-xs">
                  By registering you agree to our{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms and Conditions
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}