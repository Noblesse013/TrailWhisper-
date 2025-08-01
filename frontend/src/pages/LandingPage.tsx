import { Link } from 'react-router-dom';
import { BookOpen, PenTool, Camera, MapPin, ArrowRight, Mountain, Heart } from 'lucide-react';
import { LandingNavbar } from '../components/layout/LandingNavbar';

export function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Link to="/" className="flex items-center justify-center mb-6 hover:opacity-80 transition-opacity">
              
              <h1 className="text-5xl lg:text-7xl font-bold font-serif text-primary-800">
                TrailWhisper
              </h1>
            </Link>
            
            <p className="text-xl lg:text-2xl text-secondary-600 mb-8 leading-relaxed">
            Your trail. Your tale. The world is listening.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="group flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <PenTool className="h-5 w-5" />
                <span className="font-semibold">Start Writing</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="flex items-center space-x-2 border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">Explore Stories</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-primary-800 mb-4">
              Your Personal Travel Journal
            </h2>
            <p className="text-lg text-secondary-600">
              Keep your travel memories safe and beautifully organized with photos and stories from every adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors">
                <PenTool className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold font-serif text-primary-800 mb-3">
                Easy Story Creation
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Craft beautiful stories with our intuitive editor. Add images, format text, and bring your adventures to life with ease.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-6 group-hover:bg-accent-200 transition-colors">
                <Camera className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold font-serif text-primary-800 mb-3">
                Photo Memories
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Upload and organize your travel photos alongside your journal entries. Every picture tells a story.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-6 group-hover:bg-secondary-200 transition-colors">
                <MapPin className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold font-serif text-primary-800 mb-3">
                Location Tracking
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Record where each memory was made. Keep track of all the amazing places you've visited on your journeys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-white mb-4">
              Ready to Start Your Travel Journal?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Every journey deserves to be remembered. Create your personal travel diary with beautiful photos and memories.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-primary-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
            >
              <PenTool className="h-5 w-5" />
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            
            <span className="text-lg font-serif font-bold text-white">TrailWhisper</span>
          </div>
          <p className="text-primary-300 text-sm">
            © 2025 TrailWhisper. Every journey has a story worth sharing.
          </p>
        </div>
      </footer>
    </div>
  );
}
