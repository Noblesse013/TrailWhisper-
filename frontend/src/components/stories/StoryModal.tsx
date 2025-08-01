import React from 'react';
import { X, Calendar } from 'lucide-react';
import { TravelStory } from '../../types';

interface StoryModalProps {
  story: TravelStory;
  onClose: () => void;
}

export function StoryModal({ story, onClose }: StoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 bg-primary-50">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-secondary-400" />
            <span className="text-sm text-secondary-600">
              Visited on {new Date(story.visitedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • 📍 {story.visitedLocation}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {story.imageUrl && (
            <div className="h-64 bg-gradient-to-br from-primary-100 to-accent-100">
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold font-serif text-primary-800 mb-8 leading-tight">
              {story.title}
            </h1>
            
            <div className="prose prose-blue prose-lg max-w-none">
              <div className="text-secondary-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {story.story}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}