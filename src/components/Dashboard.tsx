'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from './Navigation';
import AnalyticsCharts from './AnalyticsCharts';

// Mock data for dashboard
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  plan: 'Pro',
  joinDate: '2024-01-15',
  stats: {
    totalUsers: 1247,
    monthlyRevenue: 12450,
    activeSubscriptions: 89,
    conversionRate: 3.2
  },
  recentActivity: [
    { id: 1, action: 'New user registered', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Payment received', time: '4 hours ago', type: 'payment' },
    { id: 3, action: 'Feature request submitted', time: '6 hours ago', type: 'feature' },
    { id: 4, action: 'Support ticket resolved', time: '1 day ago', type: 'support' }
  ]
};

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token || !storedUserData) {
      router.push('/auth');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [router]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const StatCard = ({ title, value, change, icon }: { title: string; value: string | number; change: string; icon: string }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <span className="text-green-400 text-sm font-medium">{change}</span>
      </div>
      <h3 className="text-white text-2xl font-bold mb-1">{value}</h3>
      <p className="text-gray-300 text-sm">{title}</p>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: typeof mockUserData.recentActivity[0] }) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'user': return '👤';
        case 'payment': return '💰';
        case 'feature': return '✨';
        case 'support': return '🎧';
        default: return '📝';
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
        <div className="text-xl">{getIcon(activity.type)}</div>
        <div className="flex-1">
          <p className="text-white text-sm">{activity.action}</p>
          <p className="text-gray-400 text-xs">{activity.time}</p>
        </div>
      </div>
    );
  };

  const dashboardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'Users' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation 
        currentPage="dashboard"
        showTabs={true}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={dashboardTabs}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userData.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-300">
            Here's what's happening with your SaaS business today.
          </p>
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <h3 className="text-white font-semibold mb-2">Your Account Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-300">Name: </span>
                <span className="text-white">{userData.name}</span>
              </div>
              <div>
                <span className="text-gray-300">Email: </span>
                <span className="text-white">{userData.email}</span>
              </div>
              <div>
                <span className="text-gray-300">Member since: </span>
                <span className="text-white">{new Date(userData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={mockUserData.stats.totalUsers.toLocaleString()}
                change="+12%"
                icon="👥"
              />
              <StatCard
                title="Monthly Revenue"
                value={`$${mockUserData.stats.monthlyRevenue.toLocaleString()}`}
                change="+8%"
                icon="💰"
              />
              <StatCard
                title="Active Subscriptions"
                value={mockUserData.stats.activeSubscriptions}
                change="+5%"
                icon="📊"
              />
              <StatCard
                title="Conversion Rate"
                value={`${mockUserData.stats.conversionRate}%`}
                change="+0.3%"
                icon="📈"
              />
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h2 className="text-white text-xl font-semibold mb-6">Recent Activity</h2>
                  <div className="space-y-2">
                    {mockUserData.recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h2 className="text-white text-xl font-semibold mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
                      📧 Send Newsletter
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
                      👥 Invite Team Member
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
                      📊 Generate Report
                    </button>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
                      ⚙️ Manage Settings
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h2 className="text-white text-xl font-semibold mb-4">Account Info</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Plan:</span>
                      <span className="text-white font-medium">{mockUserData.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Member since:</span>
                      <span className="text-white font-medium">
                        {new Date(mockUserData.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className="text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Manage Account
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-white text-2xl font-semibold mb-2">Analytics Dashboard</h2>
              <p className="text-gray-300">Comprehensive insights into your SaaS performance and user behavior.</p>
            </div>
            <AnalyticsCharts />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
            <h2 className="text-white text-2xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-300 mb-6">Manage your users, permissions, and access controls.</p>
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-400">User management features will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
}