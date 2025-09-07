import { useState, useEffect, useMemo } from 'react';
import { Plus, BookOpen, Heart } from 'lucide-react';
import { TravelStory, TravelStoryImage } from '../types';
import { StoryGrid } from '../components/stories/StoryGrid';
import { StoryForm } from '../components/stories/StoryForm';
import { StoryModal } from '../components/stories/StoryModal';
import { FavoritesSection } from '../components/stories/FavoritesSection';
import { WishlistSection } from '../components/wishlist/WishlistSection';
import { Navbar } from '../components/layout/Navbar';
import { storyService } from '../services/StoryService';

export function DashboardPage() {
  const [stories, setStories] = useState<TravelStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<TravelStory | null>(null);
  const [viewingStory, setViewingStory] = useState<TravelStory | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'wishlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);
  const uniqueVisitedDates = useMemo(() => {
    const labels: string[] = [];
    const seen = new Set<string>();
    for (const s of stories) {
      const d = new Date(s.visitedDate);
      const label = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
      if (!seen.has(label)) {
        seen.add(label);
        labels.push(label);
      }
    }
    return labels;
  }, [stories]);
  

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

  const parseUsDate = (value: string): Date | null => {
    const match = value.trim().match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
    if (!match) return null;
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return d;
  };

  const runAdvancedSearch = async () => {
    try {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        await loadStories();
        return;
      }
      const dateCandidate = parseUsDate(trimmed);
      if (dateCandidate) {
        const start = new Date(dateCandidate.getFullYear(), dateCandidate.getMonth(), dateCandidate.getDate(), 0, 0, 0, 0);
        const end = new Date(dateCandidate.getFullYear(), dateCandidate.getMonth(), dateCandidate.getDate(), 23, 59, 59, 999);
        const results = await storyService.filterStoriesByDate(start, end);
        setStories(results);
        return;
      }
      const results = await storyService.searchStories(trimmed);
      setStories(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Unified search handles date; keep helper for onChange triggers if needed

  const handleReset = async () => {
    setSearchQuery('');
    setShowDateSuggestions(false);
    await loadStories();
  };

  const handleSaveStory = async (title: string, content: string, visitedLocation: string, visitedDate: Date, coverImage?: string, images?: TravelStoryImage[], locationTags?: string[]) => {
    setFormLoading(true);
    try {
      if (editingStory) {
        
        const updatedStory = await storyService.updateStory(editingStory._id, {
          title,
          content,
          visitedLocation,
          visitedDate,
          cover_image: coverImage,
          images,
          locationTags
        });
        setStories(prev => prev.map(s => s._id === updatedStory._id ? updatedStory : s));
        setEditingStory(null);
      } else {
        
        const newStory = await storyService.createStory(title, content, visitedLocation, visitedDate, coverImage, images, locationTags);
        setStories(prev => [newStory, ...prev]);
      }
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

  const handleDeleteStory = async (story: TravelStory) => {
    if (!window.confirm(`Are you sure you want to delete "${story.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await storyService.deleteStory(story._id);
      setStories(prev => prev.filter(s => s._id !== story._id));
    } catch (error) {
      console.error('Failed to delete story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const handleViewStory = (story: TravelStory) => {
    setViewingStory(story);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStory(null);
  };

  const handleEditStory = (story: TravelStory) => {
    setEditingStory(story);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setShowForm(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 pt-16">
        <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex-1 relative">
            <div className="flex bg-white rounded-xl border border-secondary-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowDateSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDateSuggestions(false), 150)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runAdvancedSearch(); }}
                placeholder="Search by title, content, location, tag, or date (M/D/YYYY)"
                className="flex-1 px-4 py-3 outline-none"
              />
              <button onClick={runAdvancedSearch} className="px-6 bg-primary-500 text-white hover:bg-primary-600">Search</button>
            </div>
            {showDateSuggestions && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-secondary-200 rounded-lg shadow-lg max-h-56 overflow-auto">
                {uniqueVisitedDates
                  .filter(label => {
                    const q = searchQuery.trim().toLowerCase();
                    return q.length === 0 || label.toLowerCase().includes(q);
                  })
                  .slice(0, 8)
                  .map(label => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => { setSearchQuery(label); setShowDateSuggestions(false); setTimeout(() => runAdvancedSearch(), 0); }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary-50"
                    >
                      {label}
                    </button>
                  ))}
                {uniqueVisitedDates.length === 0 && (
                  <div className="px-4 py-2 text-secondary-500 text-sm">No dates available</div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleReset} className="px-4 py-3 text-secondary-700 hover:bg-secondary-100 rounded-lg">Reset</button>
        </div>

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

       
        <div className="mb-8">
         
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
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center space-x-2 pb-3 px-1 whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'wishlist'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
              >
                <span className="font-medium text-sm sm:text-base">
                  Wishlist
                </span>
              </button>
            </div>
          </div>

          {activeTab === 'all' && (
            <StoryGrid
              stories={stories}
              onView={handleViewStory}
              onEdit={handleEditStory}
              onCreateNew={handleCreateNew}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteStory}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesSection
              stories={stories}
              onView={handleViewStory}
              onDelete={handleDeleteStory}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'wishlist' && (
            <WishlistSection />
          )}
        </div>
      </div>
      </div>
      
    
      {showForm && (
        <StoryForm
          story={editingStory}
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