
export interface Story {
  id: string;
  title: string;
  content: string;
  cover_image?: string;
  user_id: string;
  author_email?: string;
  created_at: string;
  updated_at: string;
}

export interface TravelStoryImage {
  url: string;
  publicId: string;
  uploadedAt: Date;
}

export interface TravelStory {
  _id: string;
  title: string;
  story: string;
  visitedLocation: string; 
  imageUrl?: string; 
  images?: TravelStoryImage[]; 
  visitedDate: Date;
  userId: string;
  isFavourite: boolean;
  createdOn: Date;
}

// Wishlist interfaces
export interface WishlistItem {
  _id: string;
  destination: string;
  description?: string;
  plannedDate?: Date;
  priority: 'Low' | 'Medium' | 'High';
  estimatedBudget?: number;
  notes?: string;
  imageUrl?: string;
  userId: string;
  createdOn: Date;
  updatedOn: Date;
}

// Favorite interfaces
export interface Favorite {
  _id: string;
  itemType: 'TravelStory' | 'Destination';
  itemId: string;
  userId: string;
  createdOn: Date;
  notes?: string;
  tags?: string[];
  item?: any; // The actual favorited item (TravelStory, etc.)
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export interface AuthResponse {
  error: boolean;
  message: string;
  user?: User;
  accessToken?: string;
}

export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  story?: T;
  stories?: T[];
  user?: User;
}