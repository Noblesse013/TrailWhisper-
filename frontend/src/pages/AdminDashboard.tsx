import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Users, Trash2, Mail, Calendar, User as UserIcon, Shield, AlertTriangle, BookOpen, Heart, BarChart3 } from 'lucide-react';
import { apiService, UserWithStats, UserStatistics } from '../services/ApiService';

interface AdminUser extends UserWithStats {
  createnOn: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics['statistics'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserStats();
      setUsers(response.users as AdminUser[]);
      setStatistics(response.statistics);
    } catch (err) {
      setError('Failed to load user statistics. Please try again.');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(userId);
      await apiService.deleteSpecificUser(userId);
      
      setUsers(users.filter(u => u._id !== userId));
      // Refresh stats after deletion
      await fetchUserStats();
    } catch (err) {
      alert('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.email !== 'trailwhisper_admin') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-full">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-serif text-primary-800">Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-primary-800">{statistics?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{statistics?.activeUsers || 0}</p>
              </div>
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Total Stories</p>
                <p className="text-2xl font-bold text-blue-600">{statistics?.totalStories || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Favorites</p>
                <p className="text-2xl font-bold text-pink-600">{statistics?.totalFavorites || 0}</p>
              </div>
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Avg Stories/User</p>
                <p className="text-2xl font-bold text-purple-600">{statistics?.averageStoriesPerUser || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-primary-800">User Management</h2>
              </div>
              
              <button
                onClick={fetchUserStats}
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : users.filter(u => u.email !== 'trailwhisper_admin').length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-secondary-600">No regular users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-primary-800">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-800">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-800">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-800">Stories</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-800">Favorites</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(userData => userData.email !== 'trailwhisper_admin').map((userData) => (
                      <tr key={userData._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {userData.profileImage ? (
                              <img
                                src={userData.profileImage}
                                alt={userData.fullName}
                                className="h-10 w-10 rounded-full object-cover border-2 border-primary-200"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-primary-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-primary-800">{userData.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 text-secondary-600">
                            <Mail className="h-4 w-4" />
                            <span>{userData.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 text-secondary-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(userData.createnOn)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-600">{userData.storyCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-pink-600" />
                            <span className="font-medium text-pink-600">{userData.favoriteStoryCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteUser(userData._id, userData.fullName)}
                            disabled={deleteLoading === userData._id}
                            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{deleteLoading === userData._id ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
