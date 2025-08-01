import React from 'react';
import { MapPin } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif text-primary-800">TrailWhisper</span>
              <p className="text-xs text-secondary-500 font-medium">Share Your Stories</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}