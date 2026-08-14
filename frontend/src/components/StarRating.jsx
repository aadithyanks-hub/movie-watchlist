import React, { useState } from 'react';

export default function StarRating({ rating = 0, onRatingChange, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starValue) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(starValue);
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="star-rating-container" title={`Rating: ${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span
          key={starValue}
          className={`star ${starValue <= activeRating ? 'star-filled' : 'star-empty'} ${readOnly ? 'read-only' : ''}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => !readOnly && setHoverRating(starValue)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          role={readOnly ? 'img' : 'button'}
          aria-label={`${starValue} Star`}
        >
          {starValue <= activeRating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
