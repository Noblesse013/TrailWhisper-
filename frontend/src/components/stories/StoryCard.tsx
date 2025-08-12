
import { Calendar, Eye, Heart, Images } from 'lucide-react';
import { TravelStory } from '../../types';

import { Pencil } from 'lucide-react';

interface StoryCardProps {
  story: TravelStory;
  onView?: (story: TravelStory) => void;
  onEdit?: (story: TravelStory) => void;
  onToggleFavorite?: (story: TravelStory) => void;
}

export function StoryCard({ story, onView, onEdit, onToggleFavorite }: StoryCardProps) {
  
  const coverImage = story.imageUrl || (story.images && story.images.length > 0 ? story.images[0].url : null);
  
  
  const hasMultipleImages = (story.images && story.images.length > 1) || 
                           (story.images && story.images.length > 0 && story.imageUrl);
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      
      <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-serif text-primary-300">
              {story.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        
        {hasMultipleImages && (
          <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <Images className="h-3 w-3" />
            <span>{story.images?.length || 0}</span>
          </div>
        )}
        
        
        {story.isFavourite && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-4 w-4 text-white fill-current" />
          </div>
        )}
      </div>

      {/* Story Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold font-serif text-primary-800 line-clamp-1">
            {story.title}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-secondary-500">
            <Calendar className="h-3 w-3" />
            <span>{new Date(story.visitedDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-sm text-primary-600 font-medium">📍 {story.visitedLocation}</span>
        </div>

        <div className="prose prose-blue max-w-none mb-4">
          <p className="text-secondary-600 leading-relaxed line-clamp-3 text-sm">
            {story.story}
          </p>
        </div>

        
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
          <div className="flex space-x-2">
            {onView && (
              <button
                onClick={() => onView(story)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                <Eye className="h-3 w-3" />
                <span>Read</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(story)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-secondary-200 text-primary-700 text-sm rounded-lg hover:bg-secondary-300 transition-colors duration-200"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(story)}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                story.isFavourite
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-secondary-100 text-secondary-400 hover:bg-secondary-200 hover:text-red-500'
              }`}
              title={story.isFavourite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                className={`h-4 w-4 ${story.isFavourite ? 'fill-current' : ''}`} 
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}