import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { uniqueProjectsBySite } from '../utils/uniqueProjects';
import { projectSlug } from '../utils/projectSlug';
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

  const allProjects = useMemo(
    () => [...(data?.projects || []), ...(data?.haMeditech?.projects || [])],
    [data],
  );

  const getSystem = useCallback(
    (id) => {
      if (!id || !data) return null;
      const main = data.systems.find((s) => s.id === id);
      if (main) return main;

      const meditech = data.haMeditech?.systems?.find((s) => s.systemId === id);
      if (!meditech) return null;

      return {
        id: meditech.systemId,
        name: meditech.name,
        shortName: 'IPS',
        category: 'Healthcare ELV',
        icon: 'fa-bolt',
        distributorId: meditech.distributorId,
        description: meditech.description,
        brands: [meditech.brands],
        models: [],
        partners: [],
      };
    },
    [data],
  );

  const getDistributor = useCallback(
    (id) => data?.distributors.find((d) => d.id === id) || null,
    [data],
  );

  const uniqueProjects = useMemo(
    () => uniqueProjectsBySite(allProjects),
    [allProjects],
  );

  const getProjectsForSystem = useCallback(
    (systemId) => uniqueProjectsBySite(allProjects.filter((p) => p.systemId === systemId)),
    [allProjects],
  );

  const getProjectsForDistributor = useCallback(
    (distId) => uniqueProjectsBySite(allProjects.filter((p) => p.distributorId === distId)),
    [allProjects],
  );

  const resolveIndustryEntry = useCallback(
    (entry) => {
      if (!data) return null;
      if (entry.projectId) {
        const p = allProjects.find((x) => x.id === entry.projectId);
        if (!p) return null;
        return { name: p.name, links: [{ systemId: p.systemId, distributorId: p.distributorId }] };
      }
      if (entry.links) return { name: entry.name, links: entry.links };
      if (entry.systemId && entry.distributorId) {
        return { name: entry.name, links: [{ systemId: entry.systemId, distributorId: entry.distributorId }] };
      }
      return null;
    },
    [data, allProjects],
  );

  const getIndustryProjects = useCallback(
    (sector) => {
      const entries = data?.industryProjects?.[sector] || [];
      return entries.map(resolveIndustryEntry).filter(Boolean);
    },
    [data, allProjects, resolveIndustryEntry],
  );

  const getProjectBySlug = useCallback(
    (slug) => {
      if (!slug || !allProjects.length) return null;
      return uniqueProjectsBySite(allProjects).find(
        (p) => (p.slug || projectSlug(p.name)) === slug,
      ) || null;
    },
    [allProjects],
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
      getProjectBySlug,
    }),
    [data, loading, error, uniqueProjects, getSystem, getDistributor, getProjectsForSystem, getProjectsForDistributor, getIndustryProjects, getProjectBySlug],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
