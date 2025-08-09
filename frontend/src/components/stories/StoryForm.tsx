import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Plus } from 'lucide-react';
import { TravelStory, TravelStoryImage } from '../../types';
import { apiService } from '../../services/ApiService';

interface StoryFormProps {
  story?: TravelStory | null;
  onSave: (title: string, content: string, visitedLocation: string, visitedDate: Date, coverImage?: string, images?: TravelStoryImage[]) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function StoryForm({ story, onSave, onClose, loading = false }: StoryFormProps) {
  const [title, setTitle] = useState(story?.title || '');
  const [content, setContent] = useState(story?.story || '');
  const [visitedLocation, setVisitedLocation] = useState(story?.visitedLocation || '');
  const [visitedDate, setVisitedDate] = useState(
    story?.visitedDate ? new Date(story.visitedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [coverImage, setCoverImage] = useState(story?.imageUrl || '');
  const [images, setImages] = useState<TravelStoryImage[]>(story?.images || []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.story);
      setVisitedLocation(story.visitedLocation || '');
      setVisitedDate(story.visitedDate ? new Date(story.visitedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setCoverImage(story.imageUrl || '');
      setImages(story.images || []);
      
      // Initialize previews with existing images
      const existingPreviews = story.images?.map(img => img.url) || [];
      if (story.imageUrl && !existingPreviews.includes(story.imageUrl)) {
        existingPreviews.unshift(story.imageUrl);
      }
      setImagePreviews(existingPreviews);
    } else {
      // Reset form for new story
      setTitle('');
      setContent('');
      setVisitedLocation('');
      setVisitedDate(new Date().toISOString().split('T')[0]);
      setCoverImage('');
      setImages([]);
      setImagePreviews([]);
      setImageFiles([]);
      setUploadingImages([]);
    }
  }, [story]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} is too large. Size must be less than 5MB`);
        return;
      }
      
      // Add file to the list
      setImageFiles(prev => [...prev, file]);
      setUploadingImages(prev => [...prev, false]);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (fileIndex: number): Promise<TravelStoryImage | null> => {
    const file = imageFiles[fileIndex];
    if (!file) return null;
    
    try {
      setUploadingImages(prev => prev.map((uploading, i) => i === fileIndex ? true : uploading));
      
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const base64 = await base64Promise;
      const response = await apiService.uploadImage(base64);
      
      return {
        url: response.imageUrl,
        publicId: response.publicId,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImages(prev => prev.map((uploading, i) => i === fileIndex ? false : uploading));
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setUploadingImages(prev => prev.filter((_, i) => i !== index));
    
    // Also remove from existing images if it's from the story
    if (story?.images && index < story.images.length) {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !visitedLocation.trim()) return;
    
    try {
      // Upload all new images
      const newImages: TravelStoryImage[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const uploadedImage = await handleImageUpload(i);
        if (uploadedImage) {
          newImages.push(uploadedImage);
        }
      }
      
      // Combine existing images with new ones
      const allImages = [...images, ...newImages];
      
      // Use first image as cover image for backward compatibility
      const finalCoverImage = allImages.length > 0 ? allImages[0].url : coverImage;
      
      await onSave(
        title.trim(), 
        content.trim(), 
        visitedLocation.trim(), 
        new Date(visitedDate), 
        finalCoverImage,
        allImages
      );
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 bg-primary-50">
          <h2 className="text-2xl font-bold font-serif text-primary-800">
            {story ? 'Edit Story' : 'Create New Story'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
              Story Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your story title..."
              required
            />
          </div>

          <div>
            <label htmlFor="visitedLocation" className="block text-sm font-medium text-secondary-700 mb-2">
              Visited Location *
            </label>
            <input
              id="visitedLocation"
              type="text"
              value={visitedLocation}
              onChange={(e) => setVisitedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Where did you travel?"
              required
            />
          </div>

          <div>
            <label htmlFor="visitedDate" className="block text-sm font-medium text-secondary-700 mb-2">
              Visit Date *
            </label>
            <input
              id="visitedDate"
              type="date"
              value={visitedDate}
              onChange={(e) => setVisitedDate(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Story Images
            </label>
            
            {/* Images Grid */}
            <div className="space-y-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-secondary-200"
                      />
                      {uploadingImages[index] && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 px-2 py-1 bg-primary-500 text-white text-xs rounded">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Images Button */}
              <div 
                className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="py-4">
                  <Plus className="mx-auto h-8 w-8 text-secondary-400 mb-2" />
                  <p className="text-secondary-600">
                    {imagePreviews.length === 0 ? 'Add story images' : 'Add more images'}
                  </p>
                  <p className="text-sm text-secondary-400 mt-1">PNG, JPG, GIF up to 5MB each</p>
                </div>
              </div>
              
              {uploadingImages.some(uploading => uploading) && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                  <span className="ml-2 text-sm text-secondary-600">Uploading images...</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
              Story Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none font-serif leading-relaxed"
              placeholder="Tell your story..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-secondary-700 hover:bg-secondary-100 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages.some(uploading => uploading) || !title.trim() || !content.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>
                {uploadingImages.some(uploading => uploading) ? 'Uploading...' : loading ? 'Saving...' : 'Save Story'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}