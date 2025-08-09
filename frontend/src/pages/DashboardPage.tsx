import { useState, useEffect } from 'react';
import { Plus, BookOpen, Heart } from 'lucide-react';
import { TravelStory } from '../types';
import { StoryGrid } from '../components/stories/StoryGrid';
import { StoryForm } from '../components/stories/StoryForm';
import { StoryModal } from '../components/stories/StoryModal';
import { FavoritesSection } from '../components/stories/FavoritesSection';
import { Navbar } from '../components/layout/Navbar';
import { storyService } from '../services/StoryService';

export function DashboardPage() {
  const [stories, setStories] = useState<TravelStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingStory, setViewingStory] = useState<TravelStory | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const loadedStories = await storyService.getStories();
      setStories(loadedStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const handleSaveStory = async (title: string, content: string, visitedLocation: string, visitedDate: Date, coverImage?: string) => {
    setFormLoading(true);
    try {
      const newStory = await storyService.createStory(title, content, visitedLocation, visitedDate, coverImage);
      setStories(prev => [newStory, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save story:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleFavorite = async (story: TravelStory) => {
    try {
      const updatedStory = await storyService.toggleFavorite(story._id, !story.isFavourite);
      setStories(prev => 
        prev.map(s => s._id === story._id ? updatedStory : s)
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleViewStory = (story: TravelStory) => {
    setViewingStory(story);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleCreateNew = () => {
    setShowForm(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 pt-16">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold font-serif text-primary-800 mb-2">
              Welcome to TrailWhisper!
            </h1>
            <p className="text-secondary-600">
              {stories.length === 0 
                ? 'Ready to share your first story?' 
                : `You have ${stories.length} ${stories.length === 1 ? 'story' : 'stories'} to share`
              }
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 animate-bounce-gentle shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>New Story</span>
          </button>
        </div>

        {/* Stories Section with Tabs */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6 border-b border-secondary-200">
            <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center space-x-2 pb-3 px-1 whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'all'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">
                  All Stories ({stories.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center space-x-2 pb-3 px-1 whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'favorites'
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-secondary-600 hover:text-red-600'
                }`}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">
                  Favorites ({stories.filter(s => s.isFavourite).length})
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'all' && (
            <StoryGrid
              stories={stories}
              onView={handleViewStory}
              onCreateNew={handleCreateNew}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesSection
              stories={stories}
              onView={handleViewStory}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
      </div>
      </div>
      
      {/* Modals outside the main container */}
      {showForm && (
        <StoryForm
          story={null}
          onSave={handleSaveStory}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}

      {viewingStory && (
        <StoryModal
          story={viewingStory}
          onClose={() => setViewingStory(null)}
        />
      )}
    </>
  );
}