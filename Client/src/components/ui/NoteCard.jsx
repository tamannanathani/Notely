import React from 'react';
import Badge from './Badge';

const NoteCard = ({ 
  title, 
  content, 
  date, 
  tags = [],
  actions,
  onClick,
  className = '',
  ...props 
}) => {
  const truncateText = (text, maxLength = 150) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-600 transition-all duration-250 hover:shadow-lg cursor-pointer hover:-translate-y-1 ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 truncate">{title}</h3>
        {actions && (
          <div className="flex gap-2 ml-2" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {/* Content Preview */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {truncateText(content, 150)}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="primary" size="sm">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="gray" size="sm">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-xs text-gray-500">
        <span>{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
