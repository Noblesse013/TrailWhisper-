import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { TravelStory } from '../../types';
import { useState, useEffect } from 'react';

interface StoryModalProps {
  story: TravelStory;
  onClose: () => void;
}

export function StoryModal({ story, onClose }: StoryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  
  const allImages = story.images && story.images.length > 0 
    ? story.images.map(img => img.url)
    : story.imageUrl 
    ? [story.imageUrl]
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (allImages.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [allImages.length, prevImage, nextImage]);

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
          
          {allImages.length > 0 && (
            <div className="relative bg-black">
              {/* Main Image */}
              <div className="relative h-96">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${story.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                
                {allImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>
              
              
              {allImages.length > 1 && (
                <div className="flex justify-center space-x-2 p-4 bg-black/90">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-primary-400 opacity-100' 
                          : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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