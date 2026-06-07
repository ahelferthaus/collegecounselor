import { HashRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { ProfilePage } from './pages/ProfilePage';
import { PlanPage } from './pages/PlanPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<CampusMapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/plan" element={<PlanPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </HashRouter>
  );
}

export default App;
