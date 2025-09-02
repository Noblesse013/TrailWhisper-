import React from 'react';
import { MapPin, Calendar, DollarSign, Star, Edit, Trash2, Eye } from 'lucide-react';
import { WishlistItem } from '../../types';

interface WishlistCardProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (item: WishlistItem) => void;
  onView?: (item: WishlistItem) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onEdit,
  onDelete,
  onView
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      {item.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.destination}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        {/* Header with Priority */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-primary-800 flex-1">
            <MapPin className="h-4 w-4 inline mr-1 text-primary-600" />
            {item.destination}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
            {item.priority}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          {/* Planned Date */}
          {item.plannedDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-primary-500" />
              <span>Planned: {formatDate(item.plannedDate)}</span>
            </div>
          )}

          {/* Budget */}
          {item.estimatedBudget && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              <span>Budget: {formatBudget(item.estimatedBudget)}</span>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center text-sm text-gray-500">
            <Star className="h-4 w-4 mr-2" />
            <span>Added {formatDate(item.createdOn)}</span>
          </div>
        </div>

        {/* Notes Preview */}
        {item.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700 italic line-clamp-2">
              "{item.notes}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(item)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </button>
          )}
          
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => onDelete(item)}
            className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
