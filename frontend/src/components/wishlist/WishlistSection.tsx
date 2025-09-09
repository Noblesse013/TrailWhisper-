import React, { useState, useEffect, useMemo } from 'react';
import { WishlistItem } from '../../types';
import { WishlistCard } from './WishlistCard';
import { WishlistForm } from './WishlistForm';
import { wishlistService } from '../../services/WishlistService';
import { Plus, MapPin, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export const WishlistSection: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalBudget: 0,
    upcomingTrips: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [upcomingOnly, setUpcomingOnly] = useState<boolean>(false);

  const uniquePlannedDates = useMemo(() => {
    const labels: string[] = [];
    const seen = new Set<string>();
    for (const item of wishlistItems) {
      if (!item.plannedDate) continue;
      const d = new Date(item.plannedDate);
      const label = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      if (!seen.has(label)) {
        seen.add(label);
        labels.push(label);
      }
    }
    return labels;
  }, [wishlistItems]);

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

  const filteredWishlist = useMemo(() => {
    const q = searchQuery.trim();
    let results = wishlistItems.slice();
    if (q) {
      const dateCandidate = parseUsDate(q);
      if (dateCandidate) {
        const start = new Date(dateCandidate.getFullYear(), dateCandidate.getMonth(), dateCandidate.getDate(), 0, 0, 0, 0);
        const end = new Date(dateCandidate.getFullYear(), dateCandidate.getMonth(), dateCandidate.getDate(), 23, 59, 59, 999);
        results = results.filter(item => {
          if (!item.plannedDate) return false;
          const d = new Date(item.plannedDate).getTime();
          return d >= start.getTime() && d <= end.getTime();
        });
      } else {
        const lower = q.toLowerCase();
        results = results.filter(item =>
          (item.destination && item.destination.toLowerCase().includes(lower)) ||
          (item.description && item.description.toLowerCase().includes(lower)) ||
          (item.notes && item.notes.toLowerCase().includes(lower))
        );
      }
    }
    // Budget filter
    const min = minBudget ? parseFloat(minBudget) : undefined;
    const max = maxBudget ? parseFloat(maxBudget) : undefined;
    if (min !== undefined) {
      results = results.filter(item => (item.estimatedBudget ?? 0) >= min);
    }
    if (max !== undefined) {
      results = results.filter(item => (item.estimatedBudget ?? 0) <= max);
    }
    // Upcoming filter (plannedDate today or later)
    if (upcomingOnly) {
      const today = new Date();
      today.setHours(0,0,0,0);
      results = results.filter(item => {
        if (!item.plannedDate) return false;
        return new Date(item.plannedDate).getTime() >= today.getTime();
      });
    }
    return results;
  }, [searchQuery, wishlistItems, minBudget, maxBudget, upcomingOnly]);

  // Load wishlist items
  const loadWishlistItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wishlistService.getWishlistItems();
      const items = response.wishlistItems;
      setWishlistItems(items);
      
      // Calculate stats
      const totalItems = items.length;
      const totalBudget = items.reduce((sum: number, item: WishlistItem) => sum + (item.estimatedBudget || 0), 0);
      const upcomingTrips = items.filter((item: WishlistItem) => {
        if (!item.plannedDate) return false;
        const plannedDate = new Date(item.plannedDate);
        const now = new Date();
        const sixMonthsFromNow = new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000));
        return plannedDate >= now && plannedDate <= sixMonthsFromNow;
      }).length;
      
      setStats({ totalItems, totalBudget, upcomingTrips });
    } catch (err) {
      console.error('Error loading wishlist items:', err);
      setError('Failed to load wishlist items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load items on component mount
  useEffect(() => {
    loadWishlistItems();
  }, []);

  // Handle add/edit item
  const handleSaveItem = async (
    destination: string,
    description?: string,
    plannedDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    estimatedBudget?: number,
    notes?: string,
    imageUrl?: string
  ) => {
    try {
      setSaving(true);
      setError(null);
      
      if (editingItem) {
        // Update existing item
        const response = await wishlistService.updateWishlistItem(
          editingItem._id!,
          destination,
          description,
          plannedDate,
          priority,
          estimatedBudget,
          notes,
          imageUrl
        );
        setWishlistItems(prev => 
          prev.map(item => item._id === editingItem._id ? response.wishlistItem : item)
        );
      } else {
        // Add new item
        const response = await wishlistService.addWishlistItem(
          destination,
          description,
          plannedDate,
          priority,
          estimatedBudget,
          notes,
          imageUrl
        );
        setWishlistItems(prev => [response.wishlistItem, ...prev]);
      }
      
      setShowForm(false);
      setEditingItem(null);
      
      // Reload to update stats
      await loadWishlistItems();
    } catch (err) {
      console.error('Error saving wishlist item:', err);
      setError('Failed to save wishlist item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (item: WishlistItem) => {
    if (!window.confirm(`Are you sure you want to remove "${item.destination}" from your wishlist?`)) {
      return;
    }

    try {
      setError(null);
      await wishlistService.deleteWishlistItem(item._id!);
      setWishlistItems(prev => prev.filter(i => i._id !== item._id));
      
      // Update stats
      const newItems = wishlistItems.filter(i => i._id !== item._id);
      const totalItems = newItems.length;
      const totalBudget = newItems.reduce((sum, i) => sum + (i.estimatedBudget || 0), 0);
      const upcomingTrips = newItems.filter(i => {
        if (!i.plannedDate) return false;
        const plannedDate = new Date(i.plannedDate);
        const now = new Date();
        const sixMonthsFromNow = new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000));
        return plannedDate >= now && plannedDate <= sixMonthsFromNow;
      }).length;
      
      setStats({ totalItems, totalBudget, upcomingTrips });
    } catch (err) {
      console.error('Error deleting wishlist item:', err);
      setError('Failed to delete wishlist item. Please try again.');
    }
  };

  // Handle edit item
  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary-800 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-primary-600" />
            My Travel Wishlist
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Destination</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="flex bg-white rounded-xl border border-secondary-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowDateSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDateSuggestions(false), 150)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') {/* filtering happens via state */} }}
              placeholder="Search by destination, notes, or date (M/D/YYYY)"
              className="flex-[2] px-4 py-3 outline-none min-w-0"
            />
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="Min budget"
              className="px-3 py-3 outline-none w-28 border-l border-secondary-200"
            />
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="Max budget"
              className="px-3 py-3 outline-none w-28 border-l border-secondary-200"
            />
            <label className="px-4 py-3 border-l border-secondary-200 inline-flex items-center gap-2 select-none">
              <input type="checkbox" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />
              <span className="text-sm text-secondary-700">Upcoming</span>
            </label>
            <button
              onClick={() => { setSearchQuery(''); setMinBudget(''); setMaxBudget(''); setUpcomingOnly(false); }}
              className="px-4 text-secondary-700 hover:bg-secondary-100"
            >
              Reset
            </button>
          </div>
          {showDateSuggestions && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-secondary-200 rounded-lg shadow-lg max-h-56 overflow-auto">
              {uniquePlannedDates
                .filter(label => {
                  const q = searchQuery.trim().toLowerCase();
                  return q.length === 0 || label.toLowerCase().includes(q);
                })
                .slice(0, 8)
                .map(label => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => { setSearchQuery(label); setShowDateSuggestions(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-secondary-50"
                  >
                    {label}
                  </button>
                ))}
              {uniquePlannedDates.length === 0 && (
                <div className="px-4 py-2 text-secondary-500 text-sm">No dates available</div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-primary-600">Total Destinations</p>
                <p className="text-2xl font-bold text-primary-800">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Total Budget</p>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(stats.totalBudget)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-800">{stats.upcomingTrips}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Form Modal/Section */}
      {showForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingItem ? 'Edit Destination' : 'Add New Destination'}
          </h3>
          <WishlistForm
            item={editingItem}
            onSave={handleSaveItem}
            onClose={handleCancelForm}
            loading={saving}
          />
        </div>
      )}

      {/* Wishlist Items */}
      <div className="p-6">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No destinations in your wishlist yet</h3>
            <p className="text-gray-400 mb-6">Start planning your next adventure by adding destinations you'd love to visit!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Your First Destination
            </button>
          </div>
        ) : (
          filteredWishlist.length === 0 ? (
            <div className="text-center py-12 text-secondary-600">No matching wishlist items found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWishlist.map((item) => (
                <WishlistCard
                  key={item._id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
