import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { uniqueProjectsBySite } from '../utils/uniqueProjects';
import { publicPath, resolveCatalogPaths } from '../utils/publicPath';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(publicPath('/data/catalog.json'))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load catalog');
        return res.json();
      })
      .then((json) => {
        setData(resolveCatalogPaths(json));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getSystem = useCallback(
    (id) => data?.systems.find((s) => s.id === id) || null,
    [data],
  );

  const getDistributor = useCallback(
    (id) => data?.distributors.find((d) => d.id === id) || null,
    [data],
  );

  const uniqueProjects = useMemo(
    () => uniqueProjectsBySite(data?.projects || []),
    [data],
  );

  const getProjectsForSystem = useCallback(
    (systemId) => uniqueProjectsBySite(data?.projects.filter((p) => p.systemId === systemId) || []),
    [data],
  );

  const getProjectsForDistributor = useCallback(
    (distId) => uniqueProjectsBySite(data?.projects.filter((p) => p.distributorId === distId) || []),
    [data],
  );

  const resolveIndustryEntry = useCallback(
    (entry) => {
      if (!data) return null;
      if (entry.projectId) {
        const p = data.projects.find((x) => x.id === entry.projectId);
        if (!p) return null;
        return { name: p.name, links: [{ systemId: p.systemId, distributorId: p.distributorId }] };
      }
      if (entry.links) return { name: entry.name, links: entry.links };
      if (entry.systemId && entry.distributorId) {
        return { name: entry.name, links: [{ systemId: entry.systemId, distributorId: entry.distributorId }] };
      }
      return null;
    },
    [data],
  );

  const getIndustryProjects = useCallback(
    (sector) => {
      const entries = data?.industryProjects?.[sector] || [];
      return entries.map(resolveIndustryEntry).filter(Boolean);
    },
    [data, resolveIndustryEntry],
  );

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      uniqueProjects,
      getSystem,
      getDistributor,
      getProjectsForSystem,
      getProjectsForDistributor,
      getIndustryProjects,
    }),
    [data, loading, error, uniqueProjects, getSystem, getDistributor, getProjectsForSystem, getProjectsForDistributor, getIndustryProjects],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
