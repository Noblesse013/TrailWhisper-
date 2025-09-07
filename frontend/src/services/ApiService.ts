const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
  locationTags?: string[];
  imageUrl?: string;
  images?: TravelStoryImage[];
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

export interface UserWithStats extends User {
  createnOn: string;
  storyCount: number;
  favoriteStoryCount: number;
}

export interface UserStatistics {
  users: UserWithStats[];
  statistics: {
    totalUsers: number;
    activeUsers: number;
    totalStories: number;
    totalFavorites: number;
    averageStoriesPerUser: string;
  };
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

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Auth endpoints
  async createAccount(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async createAccountWithImage(fullName: string, email: string, password: string, profileImage?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, profileImage }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async getUser(): Promise<{ user: User }> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/get-user`, {
      headers: this.getAuthHeaders(),
    }, 5000); // 5 second timeout for user data
    return this.handleResponse<{ user: User }>(response);
  }

  async updateProfileImage(imageBase64: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/update-profile-image`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ profileImage: imageBase64 }),
    });
    return this.handleResponse<{ user: User }>(response);
  }

  // Admin endpoints
  async getAllUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE_URL}/get-all-users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ users: User[] }>(response);
  }

  async getUserStats(): Promise<UserStatistics> {
    const response = await fetch(`${API_BASE_URL}/get-user-stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserStatistics>(response);
  }

  async deleteSpecificUser(userId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete-user/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Travel Story endpoints
  async addTravelStory(storyData: {
    title: string;
    story: string;
    visitedLocation: string;
    locationTags?: string[];
    imageUrl?: string;
    images?: TravelStoryImage[];
    visitedDate: string; // Date in milliseconds as string
  }): Promise<ApiResponse<TravelStory>> {
    const response = await fetch(`${API_BASE_URL}/add-travel-story`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(storyData),
    });
    return this.handleResponse<ApiResponse<TravelStory>>(response);
  }

  async getAllStories(): Promise<{ stories: TravelStory[] }> {
    const response = await fetch(`${API_BASE_URL}/get-all-stories`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ stories: TravelStory[] }>(response);
  }

  async editStory(id: string, storyData: {
    title: string;
    story: string;
    visitedLocation: string;
    locationTags?: string[];
    imageUrl?: string;
    images?: TravelStoryImage[];
    visitedDate: string;
  }): Promise<ApiResponse<TravelStory>> {
    const response = await fetch(`${API_BASE_URL}/edit-story/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(storyData),
    });
    return this.handleResponse<ApiResponse<TravelStory>>(response);
  }

  async deleteStory(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete-story/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async updateIsFavourite(id: string, isFavourite: boolean): Promise<ApiResponse<TravelStory>> {
    const response = await fetch(`${API_BASE_URL}/update-is-favourite/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isFavourite }),
    });
    return this.handleResponse<ApiResponse<TravelStory>>(response);
  }

  async searchStories(query: string): Promise<{ stories: TravelStory[] }> {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ stories: TravelStory[] }>(response);
  }

  async filterStories(startDate: Date, endDate: Date): Promise<{ stories: TravelStory[] }> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    const response = await fetch(`${API_BASE_URL}/travel-stories/filter?startDate=${start}&endDate=${end}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ stories: TravelStory[] }>(response);
  }

  async advancedSearch(params: { query?: string; startDate?: Date; endDate?: Date; tags?: string[] }): Promise<{ stories: TravelStory[] }> {
    const q = params.query ? `query=${encodeURIComponent(params.query)}` : '';
    const s = params.startDate ? `startDate=${params.startDate.getTime()}` : '';
    const e = params.endDate ? `endDate=${params.endDate.getTime()}` : '';
    const t = params.tags && params.tags.length > 0 ? `tags=${encodeURIComponent(params.tags.join(','))}` : '';
    const parts = [q, s, e, t].filter(Boolean).join('&');
    const url = parts.length > 0 ? `${API_BASE_URL}/travel-stories/advanced-search?${parts}` : `${API_BASE_URL}/travel-stories/advanced-search`;
    const response = await fetch(url, { headers: this.getAuthHeaders() });
    return this.handleResponse<{ stories: TravelStory[] }>(response);
  }

  // Image upload endpoints
  async uploadImage(imageBase64: string): Promise<{ imageUrl: string; publicId: string }> {
    const response = await fetch(`${API_BASE_URL}/image-upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ image: imageBase64 }),
    });
    return this.handleResponse<{ imageUrl: string; publicId: string }>(response);
  }

  async deleteImage(publicId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete-image`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ publicId }),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Authentication helpers
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiService = new ApiService();
export default apiService;
