import { WishlistItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class WishlistService {
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

  async addWishlistItem(
    destination: string,
    description?: string,
    plannedDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    estimatedBudget?: number,
    notes?: string,
    imageUrl?: string
  ): Promise<{ error: boolean; message: string; wishlistItem: WishlistItem }> {
    const response = await fetch(`${API_BASE_URL}/add-wishlist-item`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        destination,
        description,
        plannedDate: plannedDate?.getTime().toString(),
        priority: priority || 'Medium',
        estimatedBudget,
        notes,
        imageUrl
      }),
    });
    return this.handleResponse(response);
  }

  async getWishlistItems(): Promise<{ error: boolean; wishlistItems: WishlistItem[] }> {
    const response = await fetch(`${API_BASE_URL}/get-wishlist-items`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateWishlistItem(
    wishlistId: string,
    destination: string,
    description?: string,
    plannedDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    estimatedBudget?: number,
    notes?: string,
    imageUrl?: string
  ): Promise<{ error: boolean; message: string; wishlistItem: WishlistItem }> {
    const response = await fetch(`${API_BASE_URL}/update-wishlist-item/${wishlistId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        destination,
        description,
        plannedDate: plannedDate?.getTime().toString(),
        priority: priority || 'Medium',
        estimatedBudget,
        notes,
        imageUrl
      }),
    });
    return this.handleResponse(response);
  }

  async deleteWishlistItem(wishlistId: string): Promise<{ error: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete-wishlist-item/${wishlistId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getWishlistStats(): Promise<{ 
    error: boolean; 
    stats: { 
      totalItems: number; 
      priorityBreakdown: any[]; 
      averageBudget: number; 
    } 
  }> {
    const response = await fetch(`${API_BASE_URL}/get-wishlist-stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;
