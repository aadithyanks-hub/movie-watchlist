import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

export default function MediaForm({ initialData = null, onSubmit, onCancel, isSubmitting = false }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Movie');
  const [status, setStatus] = useState('Unwatched');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'Movie');
      setStatus(initialData.status || 'Unwatched');
      setRating(initialData.rating || 0);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      type,
      status,
      rating,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? '✏️ Edit Media' : '➕ Add New Media'}</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="media-form">
          <div className="form-group">
            <label htmlFor="media-title">Title</label>
            <input
              id="media-title"
              type="text"
              placeholder="e.g. Inception, Breaking Bad..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="media-type">Type</label>
              <select
                id="media-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Movie">🎬 Movie</option>
                <option value="TV">📺 TV Show</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="media-status">Status</label>
              <select
                id="media-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Unwatched">⏳ Unwatched</option>
                <option value="Watched">✓ Watched</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <StarRating rating={rating} onRatingChange={(val) => setRating(val)} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Update Media' : 'Add Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
