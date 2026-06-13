const LOCAL_ASSET = /^\/(?:assets|data)\//;

export function publicPath(path = '') {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) return path;

  const base = import.meta.env.BASE_URL || '/';
  if (path.startsWith(base)) return path;

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}

export function resolveCatalogPaths(value) {
  if (typeof value === 'string' && LOCAL_ASSET.test(value)) {
    return publicPath(value);
  }

  if (Array.isArray(value)) {
    return value.map(resolveCatalogPaths);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, resolveCatalogPaths(nested)]),
    );
  }

  return value;
}
