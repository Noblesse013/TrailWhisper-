import React, { useState, useEffect } from 'react';
import { X, Save, Image } from 'lucide-react';
import { TravelStory } from '../../types';

interface StoryFormProps {
  story?: TravelStory | null;
  onSave: (title: string, content: string, visitedLocation: string, visitedDate: Date, coverImage?: string) => Promise<void>;
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

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.story);
      setVisitedLocation(story.visitedLocation || '');
      setVisitedDate(story.visitedDate ? new Date(story.visitedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setCoverImage(story.imageUrl || '');
    } else {
      // Reset form for new story
      setTitle('');
      setContent('');
      setVisitedLocation('');
      setVisitedDate(new Date().toISOString().split('T')[0]);
      setCoverImage('');
    }
  }, [story]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !visitedLocation.trim()) return;
    
    await onSave(title.trim(), content.trim(), visitedLocation.trim(), new Date(visitedDate), coverImage.trim() || undefined);
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
            <label htmlFor="coverImage" className="block text-sm font-medium text-secondary-700 mb-2">
              Cover Image URL (Optional)
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {coverImage && (
            <div className="rounded-lg overflow-hidden border border-secondary-200">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-48 object-cover"
                onError={() => setCoverImage('')}
              />
            </div>
          )}

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
              disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Story'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}