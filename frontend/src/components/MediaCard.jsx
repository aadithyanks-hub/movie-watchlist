import React from 'react';
import StarRating from './StarRating';

export default function MediaCard({ item, onUpdateStatus, onRatingChange, onEdit, onDelete }) {
  const isWatched = item.status === 'Watched';

  return (
    <div className={`media-card ${isWatched ? 'card-watched' : 'card-unwatched'}`}>
      <div className="card-header">
        <span className={`type-badge ${item.type.toLowerCase()}`}>
          {item.type === 'Movie' ? '🎬 Movie' : '📺 TV Show'}
        </span>
        <span className={`status-badge ${item.status.toLowerCase()}`}>
          {isWatched ? '✓ Watched' : '⏳ To Watch'}
        </span>
      </div>

      <h3 className="card-title">{item.title}</h3>

      <div className="card-rating-section">
        <span className="rating-label">Rating:</span>
        <StarRating
          rating={item.rating}
          onRatingChange={(newRating) => onRatingChange(item.id, newRating)}
        />
      </div>

      <div className="card-actions">
        <button
          className={`btn-status ${isWatched ? 'btn-unwatch' : 'btn-watch'}`}
          onClick={() => onUpdateStatus(item.id, isWatched ? 'Unwatched' : 'Watched')}
        >
          {isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
        </button>

        <div className="action-icons">
          <button className="btn-edit" onClick={() => onEdit(item)} title="Edit Media">
            ✏️ Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(item.id)} title="Delete Media">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
