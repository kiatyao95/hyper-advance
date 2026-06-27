import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SystemsPage from './pages/SystemsPage';
import SystemDetailPage from './pages/SystemDetailPage';
import DistributorsPage from './pages/DistributorsPage';
import DistributorDetailPage from './pages/DistributorDetailPage';
import LegacyRedirect from './components/LegacyRedirect';
import PageSeo from './components/seo/PageSeo';

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <PageSeo />
      <ScrollToHash />
      <LegacyRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:slug" element={<ProjectDetailPage />} />
        <Route path="/projects.html" element={<Navigate to="/projects" replace />} />
        <Route path="/systems" element={<SystemsPage />} />
        <Route path="/systems.html" element={<Navigate to="/systems" replace />} />
        <Route path="/system/:id" element={<SystemDetailPage />} />
        <Route path="/distributors" element={<DistributorsPage />} />
        <Route path="/distributors.html" element={<Navigate to="/distributors" replace />} />
        <Route path="/distributor/:id" element={<DistributorDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
