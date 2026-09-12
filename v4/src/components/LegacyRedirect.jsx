import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LegacyRedirect() {
  const location = useLocation();

  useEffect(() => {
    const { pathname, search, hash } = location;
    const params = new URLSearchParams(search);

    // window.location is used deliberately: the catch-all route ("*" -> "/")
    // also redirects on mount and would otherwise beat router-side navigation.
    if (pathname === '/system.html' || pathname.endsWith('/system.html')) {
      const id = params.get('id');
      window.location.replace(id ? `/system/${id}` : '/systems');
    } else if (pathname === '/distributor.html' || pathname.endsWith('/distributor.html')) {
      const id = params.get('id');
      window.location.replace(id ? `/distributor/${id}` : '/distributors');
    } else if (pathname === '/index_3.html' || pathname.endsWith('/index_3.html')) {
      window.location.replace(`/${hash || ''}`);
    }
  }, [location]);

  return null;
}
