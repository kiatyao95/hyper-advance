import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LegacyRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search } = location;
    const params = new URLSearchParams(search);

    if (pathname === '/system.html' || pathname.endsWith('/system.html')) {
      const id = params.get('id');
      navigate(id ? `/system/${id}` : '/systems', { replace: true });
    } else if (pathname === '/distributor.html' || pathname.endsWith('/distributor.html')) {
      const id = params.get('id');
      navigate(id ? `/distributor/${id}` : '/distributors', { replace: true });
    } else if (pathname === '/index_3.html' || pathname.endsWith('/index_3.html')) {
      window.location.replace(`/v3/index.html${location.hash || ''}`);
    }
  }, [location, navigate]);

  return null;
}
