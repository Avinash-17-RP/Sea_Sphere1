# SeaSphere Supabase Configuration & Guide

This document outlines the database schema and frontend-only architecture for the SeaSphere project.

## 🚀 Setup Instructions

### 1. Database Schema (Supabase SQL Editor)
Run the following SQL in your Supabase SQL Editor to create the necessary tables and enable Row Level Security (RLS).

```sql
-- Create Tables
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'Public',
  lead TEXT,
  members INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Active',
  category TEXT DEFAULT 'personal', -- 'personal' or 'business'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  category TEXT DEFAULT 'personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  category TEXT DEFAULT 'business',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Development Policies (Allow All)
DROP POLICY IF EXISTS "Allow all on teams" ON teams;
DROP POLICY IF EXISTS "Allow all on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all on projects" ON projects;
DROP POLICY IF EXISTS "Allow all on posts" ON posts;

CREATE POLICY "Allow all on teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on posts" ON posts FOR ALL USING (true) WITH CHECK (true);
```

### 2. Frontend Configuration
Ensure `src/lib/supabase.js` has your correct credentials:
- **Project URL**: `https://ijyveyflpvtumwekfgjb.supabase.co`
- **Anon Key**: Your Supabase public anon key.

## 🛠 Features Overview

| Page | Capability | Database Table |
|---|---|---|
| **Personal Dashboard** | View real counts of teams, tasks, and projects. | `teams`, `tasks`, `projects` |
| **Business Dashboard** | View business-specific metrics and departments. | `teams`, `projects` |
| **My Teams** | View your teams, delete teams, and link to creation. | `teams` |
| **Create/Join Team** | Dedicated pages to add new collaboration spaces. | `teams` |
| **Planner** | Rich text editor with "Post Now" to save content. | `posts` |
| **Business Projects** | Full CRUD for engineering/design projects. | `projects` |

## 🔐 Google Direct Login Setup (Google Console + Supabase)

Follow these steps once to enable the Google buttons in Sign In / Sign Up.

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Go to **APIs & Services → OAuth consent screen**.
4. Configure consent screen:
  - User type: External (for public testing)
  - App name, support email, developer email
  - Add test users while app is in testing mode
5. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
6. Choose **Web application** and add:
  - Authorized JavaScript origin:
    - `http://localhost:5173`
  - Authorized redirect URI:
    - `https://ijyveyflpvtumwekfgjb.supabase.co/auth/v1/callback`
7. Copy the generated **Client ID** and **Client Secret**.

In Supabase:

1. Open your project dashboard.
2. Go to **Authentication → Providers → Google**.
3. Enable Google provider and paste Client ID + Client Secret from Google Console.
  - Client ID: `266477823019-dn401lojsiur1g9ohcqgf55nu8b6js89.apps.googleusercontent.com`
4. Go to **Authentication → URL Configuration** and add site URLs:
  - `http://localhost:5173`
  - (optional production URL when deployed)
5. Add redirect URLs:
  - `http://localhost:5173/personal/dashboard`
  - `http://localhost:5173/business/dashboard`

After this, clicking Google login in the app will redirect to Google and return users directly to the selected dashboard.

## 📦 Running Locally
1. `cd frontend`
2. `npm install`
3. `npm run dev`
*(Note: No backend server is required)*
