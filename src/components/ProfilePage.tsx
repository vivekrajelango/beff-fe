'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from './Navigation';


interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  joinDate: string;
  lastLogin: string;
  createdAt?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    dataProcessing: boolean;
  };
  dataUsage: {
    storageUsed: string;
    apiCalls: string;
    lastBackup: string;
  };
}

// Mock user data
const mockUserData: UserData = {
  id: 'user_123456',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  company: 'Stellar SaaS',
  plan: 'Pro',
  joinDate: '2024-01-15',
  lastLogin: '2024-12-20T10:30:00Z',
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    dataProcessing: true
  },
  dataUsage: {
    storageUsed: '2.3 GB',
    apiCalls: '15,420',
    lastBackup: '2024-12-19'
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [showDataExport, setShowDataExport] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'ready'>('idle');

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
      // Merge with mock data structure for profile features
      const enhancedUserData = {
        ...parsedUserData,
        phone: '+44 (786) 123-456', // Mock data for demo
        company: 'Stellar SaaS', // Mock data for demo
        plan: 'Pro', // Mock data for demo
        joinDate: parsedUserData.createdAt,
        lastLogin: new Date().toISOString(),
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
          dataProcessing: true
        },
        dataUsage: {
          storageUsed: '2.3 GB',
          apiCalls: '15,420',
          lastBackup: '2024-12-19'
        }
      };
      setUserData(enhancedUserData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/auth');
  };

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

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://beff-be.onrender.com/auth/profile/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Success - force logout to refresh user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Show success message briefly before redirect
      setShowSuccessModal(true);
      
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleDataExport = () => {
    setExportStatus('processing');
    // Simulate export process
    setTimeout(() => {
      setExportStatus('ready');
    }, 3000);
  };

  const handleDownloadData = () => {
    // Create and download JSON file with user data
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${userData.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log('Account deletion requested');
    alert('Account deletion request submitted. You will receive a confirmation email.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation currentPage="profile" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account settings and privacy preferences.</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 mb-8">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'privacy'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Privacy & Data
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Error Message */}
                {saveError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                    <p className="text-red-200 text-sm">{saveError}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <h2 className="text-white text-xl font-semibold">Personal Information</h2>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSaving && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={userData.company}
                      onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-300">User ID:</span>
                      <span className="text-white ml-2 font-mono">{userData.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Plan:</span>
                      <span className="text-white ml-2">{userData.plan}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Member since:</span>
                      <span className="text-white ml-2">
                        {new Date(userData.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-300">Last login:</span>
                      <span className="text-white ml-2">
                        {new Date(userData.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8">
                {/* GDPR Feature 1: Data Export */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-semibold mb-2">📥 Data Export</h3>
                      <p className="text-gray-300 text-sm">
                        Download a copy of all your personal data stored in our system. 
                        This includes your profile information, usage data, and preferences.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-gray-300">
                      <p><strong>Data included:</strong></p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Profile information and account details</li>
                        <li>Usage statistics and activity logs</li>
                        <li>Preferences and settings</li>
                        <li>Communication history</li>
                      </ul>
                    </div>
                    
                    {exportStatus === 'idle' && (
                      <button
                        onClick={handleDataExport}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Request Data Export
                      </button>
                    )}
                    
                    {exportStatus === 'processing' && (
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                        <span className="text-blue-400">Preparing your data export...</span>
                      </div>
                    )}
                    
                    {exportStatus === 'ready' && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-green-400">
                          <span>✓</span>
                          <span>Your data export is ready!</span>
                        </div>
                        <button
                          onClick={handleDownloadData}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          Download Data (JSON)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* GDPR Feature 2: Account Deletion */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-white text-lg font-semibold mb-2">🗑️ Delete Account</h3>
                    <p className="text-gray-300 text-sm">
                      Permanently delete your account and all associated data. 
                      This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-gray-300">
                      <p><strong>What will be deleted:</strong></p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Your profile and account information</li>
                        <li>All usage data and analytics</li>
                        <li>Stored preferences and settings</li>
                        <li>Communication and support history</li>
                      </ul>
                    </div>
                    
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-red-800/30 border border-red-600/50 rounded-lg p-4">
                          <p className="text-red-200 text-sm font-medium mb-3">
                            ⚠️ Are you absolutely sure you want to delete your account?
                          </p>
                          <p className="text-red-300 text-xs mb-4">
                            This will permanently delete all your data and cannot be undone. 
                            Type &quot;DELETE&quot; below to confirm.
                          </p>
                          <input
                            type="text"
                            placeholder="Type DELETE to confirm"
                            className="w-full bg-red-900/30 border border-red-600/50 rounded px-3 py-2 text-white text-sm mb-3"
                          />
                          <div className="flex space-x-3">
                            <button
                              onClick={handleDeleteAccount}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                            >
                              Confirm Deletion
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Usage Information */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">📊 Data Usage</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300">Storage Used:</span>
                      <span className="text-white ml-2 font-medium">{userData.dataUsage.storageUsed}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">API Calls:</span>
                      <span className="text-white ml-2 font-medium">{userData.dataUsage.apiCalls}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Last Backup:</span>
                      <span className="text-white ml-2 font-medium">{userData.dataUsage.lastBackup}</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Preferences */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">🔒 Privacy Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive important updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userData.preferences.emailNotifications}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: { ...userData.preferences, emailNotifications: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Marketing Communications</p>
                        <p className="text-gray-400 text-sm">Receive product updates and offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userData.preferences.marketingEmails}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: { ...userData.preferences, marketingEmails: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-white text-xl font-semibold">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">🔐 Password</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Last changed: 30 days ago
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">🔑 Two-Factor Authentication</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Add an extra layer of security to your account.
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">📱 Active Sessions</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Manage devices that are currently signed in to your account.
                    </p>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Profile Updated Successfully!</h3>
              <p className="text-gray-300 mb-6">Your profile has been updated. Please log in again to see the changes.</p>
              <button
                onClick={handleModalConfirm}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}