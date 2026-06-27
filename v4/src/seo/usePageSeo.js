import { useEffect } from 'react';
import { SITE } from './seoConfig';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * @param {{
 *   title: string;
 *   description: string;
 *   keywords?: string[];
 *   path?: string;
 *   image?: string;
 *   jsonLd?: object | object[];
 *   noindex?: boolean;
 * }} seo
 */
export function usePageSeo(seo) {
  useEffect(() => {
    if (!seo?.title) return;

    const url = `${SITE.url}${seo.path || ''}`;
    const image = seo.image?.startsWith('http') ? seo.image : `${SITE.url}${seo.image || '/assets/brand/hyper-advance-logo.png'}`;
    const keywords = (seo.keywords || []).join(', ');

    document.title = seo.title;
    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', seo.noindex ? 'noindex,nofollow' : 'index,follow');
    upsertMeta('name', 'author', SITE.name);
    upsertMeta('name', 'geo.region', 'MY-10');
    upsertMeta('name', 'geo.placename', 'Petaling Jaya');

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:locale', SITE.locale);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', image);

    upsertLink('canonical', url);

    const ld = Array.isArray(seo.jsonLd) ? seo.jsonLd : seo.jsonLd ? [seo.jsonLd] : [];
    upsertJsonLd('seo-jsonld-primary', ld[0]);
    upsertJsonLd('seo-jsonld-secondary', ld[1]);

    return () => {
      document.getElementById('seo-jsonld-primary')?.remove();
      document.getElementById('seo-jsonld-secondary')?.remove();
    };
  }, [seo]);
}
