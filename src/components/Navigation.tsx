'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  currentPage?: 'dashboard' | 'profile' | 'landing';
  showTabs?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: Array<{ id: string; label: string }>;
}

export default function Navigation({ 
  currentPage = 'dashboard', 
  showTabs = false, 
  activeTab, 
  onTabChange,
  tabs = []
}: NavigationProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsAuthenticated(true);
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
    router.push('/auth');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  // Landing page navigation (different layout)
  if (currentPage === 'landing') {
    return (
      <nav className="relative z-10 flex justify-between items-center p-6">
        <button 
          onClick={handleLogoClick}
          className="text-white text-2xl font-bold hover:text-purple-300 transition-colors cursor-pointer"
        >
          StellarSaaS
        </button>
        <div className="flex space-x-4">
          {!isClient ? (
            <div className="w-24 h-8 bg-white/10 rounded animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-purple-300 transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="text-white hover:text-purple-300 transition-colors">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-white hover:text-purple-300 transition-colors">
                Sign In
              </Link>
              <button 
                onClick={handleGetStarted}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>
    );
  }

  // Dashboard/Profile navigation (glassmorphism layout)
  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={handleLogoClick}
              className="text-white text-xl font-bold hover:text-purple-300 transition-colors cursor-pointer"
            >
              StellarSaaS
            </button>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              {currentPage === 'dashboard' ? (
                <>
                  {showTabs && tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange?.(tab.id)}
                      className={`text-sm font-medium transition-colors ${
                        activeTab === tab.id ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </>
              ) : (
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentPage !== 'profile' && (
              <Link
                href="/profile"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Profile
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Logout
            </button>
            {userData && (
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userData.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}