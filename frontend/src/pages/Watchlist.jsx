import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import MediaCard from '../components/MediaCard';
import MediaForm from '../components/MediaForm';

export default function Watchlist({ currentUser }) {
  const [mediaList, setMediaList] = useState([]);
  const [activeTab, setActiveTab] = useState('Unwatched'); // 'Unwatched' or 'Watched'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Movie', 'TV'
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await api.getMediaList();
      setMediaList(data);
      setError('');
    } catch (err) {
      setError('Failed to load watchlist items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMedia();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="auth-prompt-card">
        <h2>🍿 Welcome to CineTrack</h2>
        <p>Please log in or create an account to view and manage your watchlist.</p>
        <div className="auth-prompt-actions">
          <Link to="/login" className="btn-primary">Sign In</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>
      </div>
    );
  }

  // Handle Add Media
  const handleAddMedia = async (formData) => {
    try {
      setIsSubmitting(true);
      const newItem = await api.createMedia(formData);
      setMediaList((prev) => [newItem, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to add media');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Media
  const handleEditMedia = async (formData) => {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      const updated = await api.updateMedia(editingItem.id, formData);
      setMediaList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingItem(null);
    } catch (err) {
      alert(err.message || 'Failed to update media');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Status Toggle (Unwatched <-> Watched)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const updated = await api.patchMedia(id, { status: newStatus });
      setMediaList((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Handle Rating Change (Updates Django DB directly!)
  const handleRatingChange = async (id, newRating) => {
    try {
      const updated = await api.patchMedia(id, { rating: newRating });
      setMediaList((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      alert('Failed to update rating');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this title?')) return;
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  // Filter items by status, type, and search query
  const unwatchedItems = mediaList.filter((item) => item.status === 'Unwatched');
  const watchedItems = mediaList.filter((item) => item.status === 'Watched');

  const currentTabItems = activeTab === 'Unwatched' ? unwatchedItems : watchedItems;

  const filteredItems = currentTabItems.filter((item) => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="watchlist-page">
      {/* Top Header / Actions */}
      <div className="watchlist-header">
        <div className="watchlist-title-section">
          <h2>My Watchlist</h2>
          <p className="subtitle">Track movies & TV shows you plan to watch or have finished</p>
        </div>

        <button className="btn-add-media" onClick={() => setIsAddModalOpen(true)}>
          ➕ Add Media
        </button>
      </div>

      {/* Main Tabs: [ To Watch ] [ Watched ] */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'Unwatched' ? 'active' : ''}`}
          onClick={() => setActiveTab('Unwatched')}
        >
          ⏳ To Watch <span className="badge">{unwatchedItems.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'Watched' ? 'active' : ''}`}
          onClick={() => setActiveTab('Watched')}
        >
          ✓ Watched <span className="badge">{watchedItems.length}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search titles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="type-filter-group">
          <button
            className={`filter-chip ${filterType === 'All' ? 'active' : ''}`}
            onClick={() => setFilterType('All')}
          >
            All
          </button>
          <button
            className={`filter-chip ${filterType === 'Movie' ? 'active' : ''}`}
            onClick={() => setFilterType('Movie')}
          >
            🎬 Movies
          </button>
          <button
            className={`filter-chip ${filterType === 'TV' ? 'active' : ''}`}
            onClick={() => setFilterType('TV')}
          >
            📺 TV Shows
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-spinner">Loading your media collection...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">{activeTab === 'Unwatched' ? '🎬' : '⭐'}</span>
          <h3>
            {searchQuery || filterType !== 'All'
              ? 'No matching media found'
              : activeTab === 'Unwatched'
              ? 'Your "To Watch" list is empty!'
              : 'You haven\'t marked any media as "Watched" yet!'}
          </h3>
          <p>
            {activeTab === 'Unwatched'
              ? 'Click "Add Media" above to start populating your watchlist.'
              : 'Items you mark as watched will appear here along with your ratings.'}
          </p>
        </div>
      ) : (
        <div className="media-grid">
          {filteredItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onUpdateStatus={handleUpdateStatus}
              onRatingChange={handleRatingChange}
              onEdit={(mediaItem) => setEditingItem(mediaItem)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <MediaForm
          onSubmit={handleAddMedia}
          onCancel={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Media Modal */}
      {editingItem && (
        <MediaForm
          initialData={editingItem}
          onSubmit={handleEditMedia}
          onCancel={() => setEditingItem(null)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
