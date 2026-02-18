# 🎬 CineSync - Your Personal Movie Watchlist

![CineSync Logo](assets/icon.png)

CineSync is a web application that helps movie enthusiasts discover trending films, search for specific titles, and maintain a personal watchlist. It integrates with two external APIs to provide comprehensive movie information and streaming availability data.

🔗 **Live Demo:** [https://santiago1707.github.io/cinesync/](https://santiago1707.github.io/cinesync/)

---

## 📋 **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [APIs Used](#apis-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Rubric Requirements Met](#rubric-requirements-met)
- [Challenges & Limitations](#challenges--limitations)
- [Future Improvements](#future-improvements)
- [Credits](#credits)

---

## ✨ **Features**

| Feature | Description |
|---------|-------------|
| **Trending Movies** | View current trending movies from TMDB API |
| **Search Movies** | Search for any movie by title |
| **Movie Details** | Detailed view with synopsis, cast, ratings, and runtime |
| **Streaming Info** | See where to watch (Netflix, Prime Video, etc.) |
| **User Authentication** | Register and login to save your personal watchlist |
| **Personal Watchlist** | Add/remove movies to your saved list |
| **Demo Account** | Pre-configured demo account for testing |
| **Responsive Design** | Works on desktop, tablet, and mobile |
| **CSS Animations** | Smooth transitions and loading effects |

---

## 🛠️ **Technologies Used**

- **HTML5** - Semantic markup, SEO-friendly structure
- **CSS3** - Flexbox, Grid, animations, media queries
- **Vanilla JavaScript** - ES6+ modules, async/await, no frameworks
- **LocalStorage** - User data and watchlist persistence
- **GitHub Pages** - Hosting and deployment

---

## 🔌 **APIs Used**

### **1. The Movie Database (TMDB) API**
- **Purpose:** Fetch movie information (titles, posters, descriptions, cast, ratings)
- **Endpoints used:**
  - `/trending/movie/week` - Weekly trending movies
  - `/search/movie` - Search by title
  - `/movie/{id}` - Detailed movie information
  - `/movie/{id}/credits` - Cast and crew
  - `/genre/movie/list` - Movie genres
- **Documentation:** [https://developers.themoviedb.org/3](https://developers.themoviedb.org/3)

### **2. Watchmode API**
- **Purpose:** Fetch streaming availability (Netflix, Prime Video, Disney+, etc.)
- **Endpoints used:**
  - `/search/?apiKey={key}&search_field=id_tmdb` - Find movie by TMDB ID
  - `/title/{id}/sources/` - Get streaming providers
- **Documentation:** [https://api.watchmode.com/](https://api.watchmode.com/)

---

## 📁 **Project Structure**
cinesync/
├── index.html # Homepage with trending movies
├── search.html # Movie search page
├── watchlist.html # User's saved movies
├── movie.html # Individual movie details
├── login.html # User login
├── register.html # User registration
├── css/
│ ├── style.css # Main styles
│ ├── animations.css # CSS animations
│ ├── movie-detail.css # Movie details page styles
│ └── auth.css # Login/register styles
├── js/
│ ├── main.js # Homepage logic
│ ├── api.js # API calls (TMDB + Watchmode)
│ ├── ui.js # UI rendering functions
│ ├── auth.js # Authentication logic
│ ├── login.js # Login page logic
│ ├── register.js # Registration page logic
│ ├── logout.js # Logout functionality
│ ├── watchlist.js # Watchlist localStorage functions
│ ├── watchlist-page.js # Watchlist page logic
│ ├── search.js # Search page logic
│ └── movie-detail.js # Movie details page logic
└── assets/ # Images and icons

📖 Usage
Demo Account
Email: demo@cinesync.com

Password: demo123

User Flow
Browse trending movies on the homepage

Search for specific titles

Click any movie to see details

Add movies to your watchlist

View your watchlist at any time

Remove movies individually or clear all

Login/Register to persist your watchlist