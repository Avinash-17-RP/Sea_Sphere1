import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostsProvider } from './context/PostsContext';
import { UserProvider } from './context/UserContext';

// Auth & Landing
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Personal Pages
import PersonalHome from './pages/personal/PersonalHome';
import PersonalDashboard from './pages/personal/PersonalDashboard';
import MyTeams from './pages/personal/MyTeams';
import JoinTeam from './pages/personal/JoinTeam';
import CreateTeam from './pages/personal/CreateTeam';
import WorkProgress from './pages/personal/WorkProgress';
import WorkManagement from './pages/personal/WorkManagement';
import Planner from './pages/personal/Planner';
import Explore from './pages/personal/Explore';
import Profile from './pages/personal/Profile';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import BusinessTeams from './pages/business/BusinessTeams';
import Projects from './pages/business/Projects';
import Messages from './pages/business/Messages';
import Analytics from './pages/business/Analytics';
import Settings from './pages/business/Settings';
import BusinessProfile from './pages/business/BusinessProfile';
import BusinessPlanner from './pages/business/BusinessPlanner';

import './index.css';

function App() {
  return (
    <UserProvider>
      <PostsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          
          {/* Personal Routes */}
          <Route path="/personal/home" element={<PersonalHome />} />
          <Route path="/personal/dashboard" element={<PersonalDashboard />} />
          <Route path="/personal/my-teams" element={<MyTeams />} />
          <Route path="/personal/join-team" element={<JoinTeam />} />
          <Route path="/personal/create-team" element={<CreateTeam />} />
          <Route path="/personal/work-progress" element={<WorkProgress />} />
          <Route path="/personal/work-management" element={<WorkManagement />} />
          <Route path="/personal/planner" element={<Planner />} />
          <Route path="/personal/explore" element={<Explore />} />
          <Route path="/personal/profile" element={<Profile />} />

          {/* Business Routes */}
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business/teams" element={<BusinessTeams />} />
          <Route path="/business/projects" element={<Projects />} />
          <Route path="/business/messages" element={<Messages />} />
          <Route path="/business/analytics" element={<Analytics />} />
          <Route path="/business/settings" element={<Settings />} />
          <Route path="/business/profile" element={<BusinessProfile />} />
          <Route path="/business/planner" element={<BusinessPlanner />} />
        </Routes>
      </Router>
    </PostsProvider>
    </UserProvider>
  );
}

export default App;
