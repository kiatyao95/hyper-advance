function normalizeSiteName(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function projectScore(project) {
  let score = 0;
  if (project.featured) score += 100;
  if (project.contractAmount) score += 50;
  if (project.source === 'xlsx') score += 30;
  if (project.completionDate) score += 10;
  if (project.unitCount) score += 5;
  if (project.images?.length) score += 20;
  if (project.image && !project.image.includes('placeholder')) score += 5;
  return score;
}

/** One card per unique site name; prefers featured / richest catalog entry. */
export function uniqueProjectsBySite(projects = []) {
  const best = new Map();

  for (const project of projects) {
    const key = normalizeSiteName(project.name);
    if (!key) continue;
    const existing = best.get(key);
    if (!existing || projectScore(project) > projectScore(existing)) {
      best.set(key, project);
    }
  }

  return Array.from(best.values());
}
