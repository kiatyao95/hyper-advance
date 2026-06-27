import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import {
  DISTRIBUTOR_SEO,
  PAGE_SEO,
  SITE,
  SYSTEM_SEO,
  organizationJsonLd,
  serviceJsonLd,
} from '../../seo/seoConfig';
import { usePageSeo } from '../../seo/usePageSeo';

export default function PageSeo() {
  const { pathname } = useLocation();
  const params = useParams();
  const { getSystem, getDistributor, getProjectBySlug } = useCatalog();

  const seo = useMemo(() => {
    const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

    if (path === '/' || path === '/index.html') {
      return {
        ...PAGE_SEO.home,
        path: '/',
        jsonLd: [organizationJsonLd(), serviceJsonLd()],
      };
    }

    if (path === '/projects') {
      return { ...PAGE_SEO.projects, path: '/projects' };
    }

    if (path === '/systems') {
      return { ...PAGE_SEO.systems, path: '/systems' };
    }

    if (path === '/distributors') {
      return { ...PAGE_SEO.distributors, path: '/distributors' };
    }

    if (path.startsWith('/project/') && params.slug) {
      const project = getProjectBySlug(params.slug);
      if (!project) {
        return { title: 'Project | Hyper Advance', description: PAGE_SEO.projects.description, path, noindex: true };
      }
      const systems = project.systemsCovered?.join(', ') || project.tag;
      return {
        title: `${project.name} ELV Project | ${systems} — Hyper Advance`,
        description: `${project.name} — ${systems} installation in Malaysia by Hyper Advance. ${project.sector} ELV project reference${project.completionDate ? ` completed ${project.completionDate}` : ''}.`,
        keywords: [project.name, systems, 'ELV contractor Malaysia', project.sector],
        path,
        image: project.image,
      };
    }

    if (path.startsWith('/system/') && params.id) {
      const sys = getSystem(params.id);
      const override = SYSTEM_SEO[params.id];
      if (!sys) {
        return { title: 'System | Hyper Advance', description: PAGE_SEO.systems.description, path, noindex: true };
      }
      return {
        title: override?.title || `${sys.name} Malaysia | Hyper Advance`,
        description: override?.description || sys.description,
        keywords: override?.keywords || [sys.shortName, 'ELV Malaysia', ...(sys.brands || [])],
        path,
      };
    }

    if (path.startsWith('/distributor/') && params.id) {
      const dist = getDistributor(params.id);
      const override = DISTRIBUTOR_SEO[params.id];
      if (!dist) {
        return { title: 'Distributor | Hyper Advance', description: PAGE_SEO.distributors.description, path, noindex: true };
      }
      return {
        title: override?.title || `${dist.fullName} Authorised Distributor Malaysia`,
        description: override?.description || dist.description,
        keywords: override?.keywords || [dist.name, 'authorised distributor', 'ELV Malaysia'],
        path,
        image: dist.logo,
      };
    }

    return {
      title: `${SITE.name} | ELV Contractor Malaysia`,
      description: PAGE_SEO.home.description,
      path,
    };
  }, [pathname, params.slug, params.id, getProjectBySlug, getSystem, getDistributor]);

  usePageSeo(seo);
  return null;
}
