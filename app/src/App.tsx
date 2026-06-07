import { HashRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { ProfilePage } from './pages/ProfilePage';
import { PlanPage } from './pages/PlanPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { RankingsPage } from './pages/RankingsPage';
import { ComparePage } from './pages/ComparePage';
import { AidPage } from './pages/AidPage';
import { RequireAuth } from './components/RequireAuth';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Private tools — require an allowlisted login */}
        <Route path="/map" element={<RequireAuth><CampusMapPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/plan" element={<RequireAuth><PlanPage /></RequireAuth>} />
        <Route path="/discover" element={<RequireAuth><DiscoverPage /></RequireAuth>} />
        <Route path="/rankings" element={<RequireAuth><RankingsPage /></RequireAuth>} />
        <Route path="/compare" element={<RequireAuth><ComparePage /></RequireAuth>} />
        <Route path="/aid" element={<RequireAuth><AidPage /></RequireAuth>} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </HashRouter>
  );
}

export default App;
