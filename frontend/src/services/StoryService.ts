import { TravelStory, TravelStoryImage } from '../types';
import { apiService } from './ApiService';

class StoryService {
  async createStory(
    title: string, 
    content: string, 
    visitedLocation: string,
    visitedDate: Date,
    coverImage?: string,
    images?: TravelStoryImage[],
    locationTags?: string[]
  ): Promise<TravelStory> {
    const storyData = {
      title,
      story: content,
      visitedLocation,
      locationTags: locationTags || [],
      visitedDate: visitedDate.getTime().toString(),
      imageUrl: coverImage,
      images: images || [],
    };

    const response = await apiService.addTravelStory(storyData);
    if (response.error || !response.story) {
      throw new Error(response.message || 'Failed to create story');
    }
    
    return response.story;
  }

  async getStories(): Promise<TravelStory[]> {
    const response = await apiService.getAllStories();
    return response.stories;
  }

  async updateStory(
    id: string, 
    updates: { 
      title?: string; 
      content?: string; 
      visitedLocation?: string;
      visitedDate?: Date;
      cover_image?: string;
      images?: TravelStoryImage[];
      locationTags?: string[];
    }
  ): Promise<TravelStory> {
    const storyData = {
      title: updates.title || '',
      story: updates.content || '',
      visitedLocation: updates.visitedLocation || '',
      locationTags: updates.locationTags || [],
      visitedDate: updates.visitedDate?.getTime().toString() || new Date().getTime().toString(),
      imageUrl: updates.cover_image,
      images: updates.images || [],
    };

    const response = await apiService.editStory(id, storyData);
    if (response.error || !response.story) {
      throw new Error(response.message || 'Failed to update story');
    }
    
    return response.story;
  }

  async deleteStory(id: string): Promise<void> {
    await apiService.deleteStory(id);
  }

  async toggleFavorite(id: string, isFavourite: boolean): Promise<TravelStory> {
    const response = await apiService.updateIsFavourite(id, isFavourite);
    if (response.error || !response.story) {
      throw new Error(response.message || 'Failed to toggle favorite');
    }
    
    return response.story;
  }

  async searchStories(query: string): Promise<TravelStory[]> {
    const response = await apiService.searchStories(query);
    return response.stories;
  }

  async advancedSearch(params: { query?: string; startDate?: Date; endDate?: Date; tags?: string[] }): Promise<TravelStory[]> {
    const response = await apiService.advancedSearch(params);
    return response.stories;
  }

  async filterStoriesByDate(startDate: Date, endDate: Date): Promise<TravelStory[]> {
    const response = await apiService.filterStories(startDate, endDate);
    return response.stories;
  }

  async uploadImage(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result as string;
          const response = await apiService.uploadImage(base64String);
          resolve(response.imageUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(imageFile);
    });
  }

  async getStoryById(id: string): Promise<TravelStory | null> {
    try {
      const stories = await this.getStories();
      return stories.find(s => s._id === id) || null;
    } catch (error) {
      console.error('Error fetching story by ID:', error);
      return null;
    }
  }
}

export const storyService = new StoryService();