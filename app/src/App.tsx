import { HashRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { ProfilePage } from './pages/ProfilePage';
import { PlanPage } from './pages/PlanPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { RankingsPage } from './pages/RankingsPage';
import { ComparePage } from './pages/ComparePage';
import { AidPage } from './pages/AidPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<CampusMapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/aid" element={<AidPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </HashRouter>
  );
}

export default App;
