# 🌊 SeaSphere - Next-Gen Collaboration Platform

**SeaSphere** is a high-performance, aesthetically stunning modular workspace designed for both personal and business collaboration. Built with **React.js** and **Supabase**, it offers a seamless experience for managing tasks, teams, and projects through a beautiful, responsive, and metrics-driven interface.

---

## 🌐 Live Demo
🚀 **Access SeaSphere here**: [https://sea-sphere.netlify.app/](https://sea-sphere.netlify.app/)

---

## 🚀 Key Features

### 👤 Personal Workspace: THE DEEP DIVE
- **Dynamic Dashboard**: Real-time stats on your tasks, projects, and collaboration hours.
    - *Under the hood*: Uses specialized `useEffect` hooks and the `api.js` layer to fetch counts from Supabase.
- **Updates Feed**: A social-style feed to share progress with **Public**, **Teams**, or **Close Friends** visibility options.
    - *Visibility Logic*: Each post carries a `visibility` metadata tag that determines its accessibility and badge color.
- **World Clocks Widget**: Monitor timezones for global collaboration.
    - *Multi-Sync*: Simultaneously tracks three key timezones with analog and digital displays.
- **Focus Tracking**: Log and visualize your deep work hours.
    - *Persistence*: Uses `localStorage` combined with Supabase for dual-layer data persistence.

### 💼 Business Ecosystem
- **Business Dashboard**: High-level metrics for departments, team leads, and overall efficiency.
    - *Architecture*: Grid-based layout for multi-metric visualization.
- **Department Management**: Specialized tables for managing engineering, design, and marketing units.
- **Metrics Display**: Built-in tracking for project health, team count, and progress.

### 🎨 Design & UX
- **Modern Aesthetics**: Sleek dark modes, **Glassmorphism** (backdrop-filter: blur), and vibrant HSL-tailored colors.
- **Fully Responsive**: Optimized for both high-end desktop screens and compact mobile devices.
- **Intuitive Navigation**: Dual-sidebar system for quick access to tools and insights.

---

## 📂 Project Structure & File Guide

### 📂 Root Directory
- `frontend/`: The core React application space.
- `README.md`: This comprehensive project guide.
- `SUPABASE_SETUP.md`: Detailed instructions for the database schema.

### 📂 frontend/src/pages
- **`Home.jsx`**: The high-converting landing page with features, stats, and a professional multi-column footer.
- **`SignIn.jsx / SignUp.jsx`**: Secure authentication pages with mobile-responsive layouts and social login support.
- **`personal/PersonalDashboard.jsx`**: The central hub for individual users to track daily stats and recent updates.
- **`personal/PersonalHome.jsx`**: The social feed where users can share updates with flexible visibility (Public/Teams/Friends).

### 📂 frontend/src/components
- **`PersonalSidebar.jsx`**: Tailored navigation for personal users (Planner, Work Progress, Profile).
- **`BusinessSidebar.jsx`**: Metrics-focused navigation for business accounts (Departments, Projects, Settings).
- **`RightSidebar.jsx`**: Persistent utility sidebar featuring the world clock and team insights.
- **`WorldClocksWidget.jsx`**: A dynamic analog/digital clock system for tracking remote team timezones.

### 📂 frontend/src/context
- **`UserContext.jsx`**: Manages global user state and profile settings using React's `useContext`.
- **`PostsContext.jsx`**: Orchestrates the updates feed, handling new posts and visibility metadata.

### 📂 frontend/src/lib
- **`supabase.js`**: Configuration for the Supabase (Postgres) backend, handling real-time data and auth.

### 📂 Styling
- **`index.css`**: The central design system containing variables, typography, glassmorphism tokens, and responsive media queries.

---

## 🛠 Tech Stack
- **Frontend**: React.js 18+ (Vite)
- **Database/Auth**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS (CSS3 Variables & Grid)
- **Icons**: FontAwesome 6+ Pro
- **Typography**: Poppins (Google Fonts)

---

## 🔧 Setup & Installation

1. **Clone & Install**:
   ```bash
   cd frontend
   npm install
   ```
2. **Environment Configuration**: Update `supabase.js` with your project URL and ANON key.
3. **Database Setup**: Execute the SQL commands in `SUPABASE_SETUP.md` within your Supabase SQL Editor.
4. **Development Mode**:
   ```bash
   npm run dev
   ```

---
*Built with precision for the future of remote work by Giridhar2787.*
