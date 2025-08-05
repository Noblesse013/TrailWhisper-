// Legacy Story interface (kept for compatibility)
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

// Backend-compatible interfaces
export interface TravelStory {
  _id: string;
  title: string;
  story: string;
  visitedLocation: string; // Changed from array to string to match backend model
  imageUrl?: string; // Made optional to match backend model
  visitedDate: Date;
  userId: string;
  isFavourite: boolean;
  createdOn: Date;
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