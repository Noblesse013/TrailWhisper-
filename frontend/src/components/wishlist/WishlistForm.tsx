import React, { useState } from 'react';
import { X, MapPin, Calendar, DollarSign, Star, Camera, Upload } from 'lucide-react';
import { WishlistItem } from '../../types';

interface WishlistFormProps {
  item?: WishlistItem | null;
  onSave: (
    destination: string,
    description?: string,
    plannedDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    estimatedBudget?: number,
    notes?: string,
    imageUrl?: string
  ) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export const WishlistForm: React.FC<WishlistFormProps> = ({
  item,
  onSave,
  onClose,
  loading
}) => {
  const [destination, setDestination] = useState(item?.destination || '');
  const [description, setDescription] = useState(item?.description || '');
  const [plannedDate, setPlannedDate] = useState(
    item?.plannedDate ? new Date(item.plannedDate).toISOString().split('T')[0] : ''
  );
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(item?.priority || 'Medium');
  const [estimatedBudget, setEstimatedBudget] = useState(item?.estimatedBudget?.toString() || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageUrl('');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destination.trim()) {
      alert('Please enter a destination');
      return;
    }

    try {
      let finalImageUrl = imageUrl;
      
      // If we have a new image file, convert to base64
      if (imageFile) {
        const reader = new FileReader();
        finalImageUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      await onSave(
        destination.trim(),
        description.trim() || undefined,
        plannedDate ? new Date(plannedDate) : undefined,
        priority,
        estimatedBudget ? parseFloat(estimatedBudget) : undefined,
        notes.trim() || undefined,
        finalImageUrl || undefined
      );
    } catch (error) {
      console.error('Error saving wishlist item:', error);
      alert('Failed to save wishlist item. Please try again.');
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary-800">
            {item ? 'Edit Wishlist Item' : 'Add to Wishlist'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Destination *
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Where do you want to go?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="What makes this destination special?"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="h-4 w-4 inline mr-1" />
              Destination Image
            </label>
            <div className="flex items-center space-x-4">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <label htmlFor="wishlistImage" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {imageUrl ? 'Change Image' : 'Upload Image'}
                    </span>
                  </div>
                </label>
                <input
                  id="wishlistImage"
                  name="wishlistImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Priority and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-1" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Planned Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Planned Date
              </label>
              <input
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Estimated Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Estimated Budget
            </label>
            <input
              type="number"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional budget estimate"
              min="0"
              step="0.01"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any additional notes or ideas..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (item ? 'Update Item' : 'Add to Wishlist')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
