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

After pushing to `main`, GitHub Actions builds v4 and publishes it to the `docs/` folder.

**URL:** https://kiatyao95.github.io/hyper-advance/docs/

The repo root (`/hyper-advance/`) redirects to the v4 site automatically.

Legacy v3 static site (source only): `v3/index.html` — not served on Pages by default.

## Repository layout

- `v4/` — React + Vite site (primary)
- `v3/` — Legacy static HTML catalog site
