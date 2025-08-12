import { BookOpen, Plus } from 'lucide-react';
import { TravelStory } from '../../types';
import { StoryCard } from './StoryCard';

interface StoryGridProps {
  stories: TravelStory[];
  onView?: (story: TravelStory) => void;
  onEdit?: (story: TravelStory) => void;
  onCreateNew?: () => void;
  onToggleFavorite?: (story: TravelStory) => void;
}

export function StoryGrid({ stories, onView, onEdit, onCreateNew, onToggleFavorite }: StoryGridProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold font-serif text-primary-800 mb-4">
            No Stories Yet
          </h3>
          <p className="text-secondary-600 mb-6">
            Start your storytelling journey by creating your first story.
          </p>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-200 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Story</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            onView={onView}
            onEdit={onEdit}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}