import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { TravelStory } from '../types';
import { StoryGrid } from '../components/stories/StoryGrid';
import { StoryForm } from '../components/stories/StoryForm';
import { StoryModal } from '../components/stories/StoryModal';
import { Navbar } from '../components/layout/Navbar';
import { storyService } from '../services/StoryService';

export function DashboardPage() {
  const [stories, setStories] = useState<TravelStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingStory, setViewingStory] = useState<TravelStory | null>(null);
  const [formLoading, setFormLoading] = useState(false);

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

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-primary-800">Your Stories</h2>
          </div>

          <StoryGrid
            stories={stories}
            onView={handleViewStory}
            onCreateNew={handleCreateNew}
          />
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