import { TravelStory } from '../../types';
import { StoryCard } from './StoryCard';
import { Heart } from 'lucide-react';

interface FavoritesSectionProps {
  stories: TravelStory[];
  onView?: (story: TravelStory) => void;
  onDelete?: (story: TravelStory) => void;
  onToggleFavorite?: (story: TravelStory) => void;
}

export function FavoritesSection({ stories, onView, onDelete, onToggleFavorite }: FavoritesSectionProps) {
  const favoriteStories = stories.filter(story => story.isFavourite);

  if (favoriteStories.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold font-serif text-primary-800 mb-2">
            No Favorite Stories Yet
          </h3>
          <p className="text-secondary-600 text-sm">
            Mark stories as your favorites to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-bold font-serif text-primary-800">
            Your Favorite Stories ({favoriteStories.length})
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteStories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              onView={onView}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
