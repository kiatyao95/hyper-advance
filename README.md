# Hyper Advance

Corporate website for Hyper Advance Sdn Bhd — ELV contractor and authorised distributor in Malaysia.

## v4 (React)

```bash
npm install --prefix v4
npm run dev --prefix v4
```

Local dev: http://localhost:5173/

Production build:

```bash
npm run build --prefix v4
```

## Live site (GitHub Pages)

After pushing to `main`, GitHub Actions builds and deploys v4 automatically.

**URL:** https://kiatyao95.github.io/hyper-advance/

If the site does not load on first deploy, open the repo **Settings → Pages** and set **Source** to **GitHub Actions**.

## Repository layout

- `v4/` — React + Vite site (primary)
- `v3/` — Legacy static HTML catalog site
