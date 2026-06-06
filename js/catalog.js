/* Hyper Advance — Catalog loader & render helpers */
const Catalog = (() => {
  let data = null;

  async function load() {
    if (data) return data;
    const res = await fetch('data/catalog.json');
    if (!res.ok) throw new Error('Failed to load catalog');
    data = await res.json();
    return data;
  }

  function getSystem(id) {
    return data?.systems.find(s => s.id === id) || null;
  }

  function getDistributor(id) {
    return data?.distributors.find(d => d.id === id) || null;
  }

  function getDistributorForSystem(systemId) {
    const sys = getSystem(systemId);
    return sys ? getDistributor(sys.distributorId) : null;
  }

  function getSystemForDistributor(distId) {
    const dist = getDistributor(distId);
    return dist ? getSystem(dist.systemId) : null;
  }

  function getProjectsForSystem(systemId) {
    return data?.projects.filter(p => p.systemId === systemId) || [];
  }

  function getProjectsForDistributor(distId) {
    return data?.projects.filter(p => p.distributorId === distId) || [];
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
  }

  function projectMetaHtml(p) {
    const rows = [
      { icon: 'fa-file-contract', label: 'Contract', value: p.contractAmount },
      { icon: 'fa-microchip', label: 'Model', value: p.model },
      { icon: 'fa-calendar-check', label: 'Completed', value: p.completionDate },
    ];
    return `<dl class="proj-meta">${rows.map(r => `
      <div class="proj-meta-row">
        <dt><i class="fa-solid ${r.icon}"></i> ${r.label}</dt>
        <dd>${esc(r.value || '—')}</dd>
      </div>`).join('')}</dl>`;
  }

  function refMetaHtml(p) {
    return `<dl class="ref-meta">
      <div class="ref-meta-row"><dt>Contract</dt><dd>${esc(p.contractAmount || '—')}</dd></div>
      <div class="ref-meta-row"><dt>Model</dt><dd>${esc(p.model || '—')}</dd></div>
      <div class="ref-meta-row"><dt>Completed</dt><dd>${esc(p.completionDate || '—')}</dd></div>
    </dl>`;
  }

  /* --- Shared nav --- */
  function renderNav(active = '') {
    const links = [
      { href: 'index_3.html', label: 'Home', key: 'home' },
      { href: 'index_3.html#about', label: 'About', key: 'about' },
      { href: 'index_3.html#systems-list', label: 'Systems', key: 'systems' },
      { href: 'index_3.html#distributors-list', label: 'Distributors', key: 'distributors' },
      { href: 'projects.html', label: 'Projects', key: 'projects' },
      { href: 'index_3.html#contact', label: 'Contact', key: 'contact' },
    ];
    return `
    <nav class="site-nav" id="navbar">
      <div class="container nav-inner">
        <a href="index_3.html" class="nav-logo">
          <img src="https://www.hyper-advance.com/assets/img/HA.png" alt="Hyper Advance"/>
          <div class="nav-logo-text"><strong>Hyper Advance</strong><span>Sdn Bhd</span></div>
        </a>
        <div class="nav-links">
          ${links.map(l => `<a href="${l.href}" class="nav-link${active === l.key ? ' active' : ''}">${l.label}</a>`).join('')}
        </div>
        <a href="index_3.html#contact" class="btn btn-teal nav-cta">Get a Quote</a>
        <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </nav>
    <div class="mobile-nav" id="mobile-nav">
      ${links.map(l => `<a href="${l.href}" class="mob-link">${l.label}</a>`).join('')}
      <a href="index_3.html#contact" class="btn btn-teal" style="margin-top:1.5rem;align-self:flex-start">Get a Quote</a>
    </div>`;
  }

  function initNav() {
    const ham = document.getElementById('hamburger');
    const mNav = document.getElementById('mobile-nav');
    if (!ham || !mNav) return;
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mNav.classList.toggle('open');
      document.body.style.overflow = mNav.classList.contains('open') ? 'hidden' : '';
    });
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(el => ro.observe(el));
  }

  /* --- Systems index --- */
  function renderSystemsGrid(systems, distributors) {
    return systems.map(sys => {
      const dist = distributors.find(d => d.id === sys.distributorId);
      const projCount = data.projects.filter(p => p.systemId === sys.id).length;
      return `
      <a href="system.html?id=${sys.id}" class="cat-card reveal">
        <div class="cat-card-icon"><i class="fa-solid ${sys.icon}"></i></div>
        <div class="cat-card-body">
          <span class="cat-card-eyebrow">${esc(sys.category)}</span>
          <h3>${esc(sys.name)}</h3>
          <p>${esc(sys.description.slice(0, 120))}…</p>
          <div class="cat-card-meta">
            <span><i class="fa-solid fa-building"></i> ${esc(dist?.name || '')}</span>
            <span><i class="fa-solid fa-folder-open"></i> ${projCount} refs</span>
          </div>
        </div>
        <span class="cat-card-arrow"><i class="fa-solid fa-arrow-right"></i></span>
      </a>`;
    }).join('');
  }

  /* --- Distributors index --- */
  function renderDistributorsGrid(distributors, systems) {
    return distributors.map(dist => {
      const sys = systems.find(s => s.id === dist.systemId);
      const prodCount = dist.products.length;
      return `
      <a href="distributor.html?id=${dist.id}" class="cat-card reveal">
        <div class="cat-card-logo"><img src="${dist.logo}" alt="${esc(dist.name)}"/></div>
        <div class="cat-card-body">
          <span class="cat-card-eyebrow">${esc(dist.country)} · Est. ${esc(dist.since)}</span>
          <h3>${esc(dist.name)}</h3>
          <p>${esc(dist.description.slice(0, 110))}…</p>
          <div class="cat-card-meta">
            <span><i class="fa-solid fa-layer-group"></i> ${esc(sys?.shortName || '')}</span>
            <span><i class="fa-solid fa-box"></i> ${prodCount} products</span>
          </div>
        </div>
        <span class="cat-card-arrow"><i class="fa-solid fa-arrow-right"></i></span>
      </a>`;
    }).join('');
  }

  /* --- System detail --- */
  function renderSystemDetail(sys) {
    const dist = getDistributor(sys.distributorId);
    const projects = getProjectsForSystem(sys.id);
    return `
    <div class="detail-hero">
      <div class="container">
        <a href="systems.html" class="breadcrumb"><i class="fa-solid fa-arrow-left"></i> All Systems</a>
        <div class="detail-hero-grid reveal">
          <div>
            <span class="detail-eyebrow"><i class="fa-solid ${sys.icon}"></i> ${esc(sys.category)}</span>
            <h1>${esc(sys.name)}</h1>
            <p class="detail-lead">${esc(sys.description)}</p>
            <div class="detail-actions">
              <a href="distributor.html?id=${dist.id}" class="btn btn-teal"><i class="fa-solid fa-building"></i> View Distributor — ${esc(dist.name)}</a>
              ${sys.sourceUrl ? `<a href="${sys.sourceUrl}" target="_blank" rel="noopener" class="btn btn-ghost"><i class="fa-solid fa-external-link"></i> Manufacturer Site</a>` : ''}
            </div>
          </div>
          <div class="detail-side-card">
            <img src="${dist.logo}" alt="${esc(dist.name)}"/>
            <h4>Authorised Distributor</h4>
            <p><strong>${esc(dist.fullName)}</strong></p>
            <p class="detail-side-note">1:1 system partnership — Hyper Advance is the sole authorised integrator for this system category in Malaysia.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container detail-content">
      <div class="detail-grid">
        <section class="detail-panel reveal">
          <h2><i class="fa-solid fa-tag"></i> Brands & Models</h2>
          <div class="tag-row">${sys.brands.map(b => `<span class="tag tag-brand">${esc(b)}</span>`).join('')}</div>
          <div class="model-list">
            ${sys.models.map(m => `<div class="model-item"><i class="fa-solid fa-microchip"></i> ${esc(m)}</div>`).join('')}
          </div>
        </section>
        <section class="detail-panel reveal d1">
          <h2><i class="fa-solid fa-handshake"></i> Partners</h2>
          <p class="panel-note">Project partners — not distributors.</p>
          ${sys.partners.map(p => `
            <div class="partner-item">
              <strong>${esc(p.name)}</strong>
              <span>${esc(p.role)}</span>
            </div>`).join('')}
        </section>
      </div>
      <section class="detail-panel reveal">
        <h2><i class="fa-solid fa-folder-open"></i> Project References</h2>
        <p class="panel-note">Malaysia deployments with contract value, model, and completion date.</p>
        <div class="ref-grid">
          ${projects.map(p => `
            <div class="ref-card">
              <img src="${p.image}" alt="${esc(p.name)}" loading="lazy"/>
              <div class="ref-card-body">
                <h4>${esc(p.name)}</h4>
                <span class="ref-sector">${esc(p.sector)}</span>
                ${refMetaHtml(p)}
              </div>
            </div>`).join('')}
        </div>
      </section>
      <section class="detail-panel reveal">
        <h2><i class="fa-solid fa-box"></i> Products by ${esc(dist.name)}</h2>
        <div class="product-table">
          ${dist.products.map(pr => `
            <div class="product-row">
              <div class="product-row-name">${esc(pr.name)}</div>
              <div class="product-row-type">${esc(pr.type)}</div>
              <div class="product-row-desc">${esc(pr.description)}</div>
            </div>`).join('')}
        </div>
      </section>
    </div>`;
  }

  /* --- Distributor detail --- */
  function renderDistributorDetail(dist) {
    const sys = getSystem(dist.systemId);
    const projects = getProjectsForDistributor(dist.id);
    return `
    <div class="detail-hero">
      <div class="container">
        <a href="distributors.html" class="breadcrumb"><i class="fa-solid fa-arrow-left"></i> All Distributors</a>
        <div class="detail-hero-grid reveal">
          <div>
            <img src="${dist.logo}" alt="${esc(dist.name)}" class="detail-dist-logo"/>
            <span class="detail-eyebrow">${esc(dist.country)} · Since ${esc(dist.since)}</span>
            <h1>${esc(dist.fullName)}</h1>
            <p class="detail-lead">${esc(dist.description)}</p>
            <div class="detail-actions">
              <a href="system.html?id=${sys.id}" class="btn btn-teal"><i class="fa-solid fa-layer-group"></i> Related System — ${esc(sys.name)}</a>
              ${dist.website ? `<a href="${dist.website}" target="_blank" rel="noopener" class="btn btn-ghost"><i class="fa-solid fa-external-link"></i> Official Website</a>` : ''}
            </div>
          </div>
          <div class="detail-side-card">
            <div class="detail-side-icon"><i class="fa-solid ${sys.icon}"></i></div>
            <h4>Linked System</h4>
            <p><strong>${esc(sys.name)}</strong></p>
            <p class="detail-side-note">Each distributor maps to exactly one ELV system. Click above to view full system specifications and project references.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container detail-content">
      <section class="detail-panel reveal">
        <h2><i class="fa-solid fa-box"></i> Product Range</h2>
        <div class="product-table">
          ${dist.products.map(pr => `
            <div class="product-row">
              <div class="product-row-name">${esc(pr.name)}</div>
              <div class="product-row-type">${esc(pr.type)}</div>
              <div class="product-row-desc">${esc(pr.description)}</div>
            </div>`).join('')}
        </div>
      </section>
      <section class="detail-panel reveal">
        <h2><i class="fa-solid fa-folder-open"></i> Project References</h2>
        <div class="ref-grid">
          ${projects.map(p => `
            <div class="ref-card">
              <img src="${p.image}" alt="${esc(p.name)}" loading="lazy"/>
              <div class="ref-card-body">
                <h4>${esc(p.name)}</h4>
                ${refMetaHtml(p)}
              </div>
            </div>`).join('')}
        </div>
      </section>
    </div>`;
  }

  /* --- Projects page --- */
  function renderProjectsPage() {
    const systems = data.systems;
    const sectors = [...new Set(data.projects.map(p => p.sector))];
    const featured = data.projects.filter(p => p.featured);
    const rest = data.projects.filter(p => !p.featured);

    const filters = ['all', ...systems.map(s => s.id)];
    const filterBtns = filters.map(f => {
      const label = f === 'all' ? 'All' : (systems.find(s => s.id === f)?.shortName || f);
      return `<button class="proj-tab${f === 'all' ? ' active' : ''}" data-filter="${f}">${esc(label)}</button>`;
    }).join('');

    const card = (p) => {
      const sys = getSystem(p.systemId);
      const dist = getDistributor(p.distributorId);
      const hero = p.featured ? ' proj-card--hero' : '';
      return `
      <article class="proj-card${hero} reveal" data-system="${p.systemId}" data-sector="${p.sector}">
        <a class="proj-card-link" href="system.html?id=${p.systemId}">
          <div class="proj-card-media">
            <img src="${p.image}" alt="${esc(p.name)}" loading="lazy"/>
            <span class="proj-card-tag">${esc(p.tag)}</span>
          </div>
          <div class="proj-card-info">
            <h3 class="proj-card-title">${esc(p.name)}</h3>
            <p class="proj-card-sys">${esc(dist.name)}</p>
            ${projectMetaHtml(p)}
            <span class="proj-card-arrow"><i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </a>
      </article>`;
    };

    return `
    <div class="page-hero">
      <div class="container reveal">
        <span class="page-eyebrow">Portfolio</span>
        <h1>Our Projects</h1>
        <p>${data.projects.length} landmark developments across Malaysia — contract amount, model used, and completion date for every reference.</p>
      </div>
    </div>
    <div class="container">
      <div class="proj-toolbar reveal">
        <div class="proj-tabs" id="projTabs">${filterBtns}</div>
        <span class="proj-count" id="projCount">${data.projects.length} projects</span>
      </div>
      <div class="projects-grid" id="projectsGrid">
        ${featured.map(card).join('')}
        ${rest.map(card).join('')}
      </div>
    </div>`;
  }

  function resolveIndustryEntry(entry) {
    if (entry.projectId) {
      const p = data.projects.find(x => x.id === entry.projectId);
      if (!p) return null;
      return { name: p.name, links: [{ systemId: p.systemId, distributorId: p.distributorId }] };
    }
    if (entry.links) return { name: entry.name, links: entry.links };
    if (entry.systemId && entry.distributorId) {
      return { name: entry.name, links: [{ systemId: entry.systemId, distributorId: entry.distributorId }] };
    }
    return null;
  }

  function renderIndustryLinkPair(link) {
    const sys = getSystem(link.systemId);
    const dist = getDistributor(link.distributorId);
    return `<a href="system.html?id=${link.systemId}" class="ind-proj-link">${esc(sys?.shortName || '')}</a><span class="ind-proj-sep">·</span><a href="distributor.html?id=${link.distributorId}" class="ind-proj-link">${esc(dist?.name || '')}</a>`;
  }

  function renderIndustryProjects(sector) {
    const entries = data.industryProjects?.[sector] || [];
    return entries.map(entry => {
      const item = resolveIndustryEntry(entry);
      if (!item) return '';
      const linksHtml = item.links.map(renderIndustryLinkPair).join('<span class="ind-proj-sep">|</span>');
      return `<div class="ind-proj-item">
        <div class="ind-proj-name">${esc(item.name)}</div>
        <div class="ind-proj-links">${linksHtml}</div>
      </div>`;
    }).join('');
  }

  function initIndustryProjects() {
    ['healthcare', 'hospitality', 'commercial', 'residential'].forEach(sector => {
      const el = document.getElementById('indProj-' + sector);
      if (el) el.innerHTML = renderIndustryProjects(sector);
    });
  }

  function initProjectsFilter() {
    const tabs = document.getElementById('projTabs');
    const grid = document.getElementById('projectsGrid');
    const count = document.getElementById('projCount');
    if (!tabs || !grid) return;
    tabs.addEventListener('click', e => {
      const btn = e.target.closest('.proj-tab');
      if (!btn) return;
      tabs.querySelectorAll('.proj-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      let visible = 0;
      grid.querySelectorAll('.proj-card').forEach(card => {
        const show = f === 'all' || card.dataset.system === f;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      count.textContent = visible + (visible === 1 ? ' project' : ' projects');
    });
  }

  return {
    load, getSystem, getDistributor, getParam, esc,
    renderNav, initNav, initReveal,
    renderSystemsGrid, renderDistributorsGrid,
    renderSystemDetail, renderDistributorDetail,
    renderProjectsPage, initProjectsFilter, initIndustryProjects,
    projectMetaHtml, refMetaHtml,
    get data() { return data; }
  };
})();
