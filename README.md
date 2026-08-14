# 🍿 CineTrack - Movie & TV Show Watchlist

A full-stack Movie and TV Show Watchlist application built with Django REST Framework and React. Users can add movies/shows, track watched and unwatched content, and rate watched media using a 5-star rating system.

---

## ✨ Features

- **User Authentication**: Secure token authentication, signup, login, and session management.
- **Data Isolation**: Each user can strictly view and manage only their own media watchlist.
- **Two Watchlist Tabs**:
  - `[ To Watch ]`: Movies and TV shows queued for watching.
  - `[ Watched ]`: Completed titles with ratings.
- **Interactive 5-Star Rating**: Clickable 5-star rating system directly integrated with the Django REST API to update ratings in SQLite real-time.
- **Media Management**: Add, edit, delete, and toggle watch status (`Watched` / `Unwatched`) seamlessly.
- **Search & Filtering**: Real-time title search and filter by type (`Movie` / `TV Show`).
- **Responsive Dark Design**: Dynamic dark UI with polished glassmorphism cards and smooth micro-animations.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Python 3.12, Django 5.1 / 6.1
- **API**: Django REST Framework (DRF)
- **Database**: SQLite3
- **CORS**: `django-cors-headers`

### Frontend
- **Framework**: React 19, JavaScript
- **Tooling**: Vite
- **Routing**: `react-router-dom`
- **Styling**: Vanilla CSS (Dark theme design system)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/aadithyanks-hub/movie-watchlist.git
cd movie-watchlist
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt # or install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver
```
*(Backend runs at `http://127.0.0.1:8000/`)*

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs at `http://localhost:5173/`)*

---

## 🔒 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register/` | Register new user & obtain token | ❌ |
| `POST` | `/api/auth/login/` | Authenticate & obtain token | ❌ |
| `GET` | `/api/auth/me/` | Fetch current user profile | ✅ |
| `GET` | `/api/media/` | List user's watchlist | ✅ |
| `POST` | `/api/media/` | Add new movie/show | ✅ |
| `GET` | `/api/media/<id>/` | View media detail | ✅ |
| `PUT` | `/api/media/<id>/` | Update media detail | ✅ |
| `PATCH` | `/api/media/<id>/` | Update status/rating | ✅ |
| `DELETE` | `/api/media/<id>/` | Remove media | ✅ |
