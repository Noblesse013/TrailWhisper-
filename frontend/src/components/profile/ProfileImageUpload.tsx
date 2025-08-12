import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, X, User as UserIcon } from 'lucide-react';
import { apiService } from '../../services/ApiService';

export const ProfileImageUpload: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profileImage, setProfileImage] = useState<string>(user?.profileImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  useEffect(() => {
    setProfileImage(user?.profileImage || '');
  }, [user?.profileImage]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);

    try {
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        try {
          // Upload to server
          const response = await apiService.updateProfileImage(base64Image);
          setProfileImage(response.user.profileImage || '');
          setSuccess('Profile image updated successfully!');
          
          // Refresh user data in AuthContext to update navbar
          await refreshUser();
          setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to update profile image');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Failed to process image');
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    setIsUploading(true);
    try {
      await apiService.updateProfileImage('');
      setProfileImage('');
      setSuccess('Profile image removed successfully!');
      
      // Refresh user data in AuthContext to update navbar
      await refreshUser();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to remove profile image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="flex items-center space-x-6">
        {/* Profile Image Display */}
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {profileImage && !isUploading && (
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <label htmlFor="profileImageUpdate" className="cursor-pointer">
              <div className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                ) : (
                  <Upload className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700">
                  {isUploading ? 'Uploading...' : profileImage ? 'Change Photo' : 'Upload Photo'}
                </span>
              </div>
            </label>
            <input
              id="profileImageUpdate"
              name="profileImageUpdate"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, GIF up to 5MB. Recommended: 200x200px
          </p>
        </div>
      </div>
    </div>
  );
};
