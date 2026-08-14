import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import './App.css';

function Navigation({ currentUser, onLogout }) {
  return (
    <header className="app-header">
      <Link to="/" className="logo-link">
        <div className="logo">
          <span className="logo-icon">🍿</span>
          <h1>CineTrack</h1>
        </div>
      </Link>

      <nav className="nav-links">
        <Link to="/">Watchlist</Link>
        {currentUser ? (
          <div className="user-nav">
            <span className="user-greeting">👋 Hi, <strong>{currentUser.username}</strong></span>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-register-btn">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navigation currentUser={currentUser} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Watchlist currentUser={currentUser} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
