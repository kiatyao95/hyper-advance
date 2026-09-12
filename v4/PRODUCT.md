# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 SPA (react-router-dom 7, motion) with static per-route prerendering (`scripts/generate-prerender.mjs`), generated sitemap, JSON-LD structured data, and IIS packaging (`build-iis.mjs` / `package-iis.mjs`). The existing codebase at `Hyper Advance/v4` answers the stack question; the earlier "Next.js" note is superseded by the codebase reality. SEO is delivered through prerendered HTML, not client-side rendering alone.

## Users

Primary audience is the public: decision-makers at companies and organizations evaluating suppliers — procurement leads, technical reviewers, M&E consultants, and executives deciding whether to invite this company to tender or award it work. Their job is risk assessment: can this company actually deliver? They compare multiple candidates and need fast, credible evidence.

## Product Purpose

The site introduces the company — Hyper Advance Sdn Bhd: who it is, what it offers, and — above all — what it has already delivered. It exists so prospects can assess capability and track record, making it easier for the company to be invited to tender and to win work. Success means a visitor leaves confident enough to start a conversation or issue an invitation to tender.

## Positioning

The core claim is the delivered track record. Unlike claims about capability or quality, delivered projects are evidence a neighboring company cannot truthfully copy. The site's job is to present past deliveries — scope, outcomes, photos — as the primary proof of the company's ability.

## Operating Context

Visitors arrive from tender documents, referrals, or search, often mid-evaluation while comparing several suppliers. They need to quickly find: what the company does, what it has delivered, and how to make contact. Real project imagery and concrete project facts (scope, outcomes, client, year) are the material of the evaluation, not decorative content. Google discoverability is a stated goal: strong SEO (per-route prerendered meta, sitemap, structured data) is a hard requirement of the revamp.

## Capabilities and Constraints

- Company domain: engineering / hardware — extra low voltage (ELV) systems: CCTV, card access, intruder alarm, intercom (Aiphone), nurse call (Austco), public address (Amperes), SMATV (Fagor/Ikusi), lighting control (Lutron), master clock (Bodet), AV/conference, hospital IPS (Esa Grimma via HA Meditech).
- Services: design, supply, installation, testing & commissioning, maintenance, training.
- Primary showcase: project case studies (150+ real delivered projects; ~50 with photo folders).
- The site must remain truthful: no invented projects, testimonials, certifications, or claims.
- Existing routes and URLs must survive: /, /projects, /project/:slug, /systems, /system/:id, /distributors, /distributor/:id (150+ indexable URLs, sitemap, redirects).

## Brand Commitments

- Company name: Hyper Advance Sdn Bhd (confirmed from codebase, seoConfig, index.html).
- Logo: `public/assets/brand/hyper-advance-logo.png` (wordmark + mark) — keep and reuse.
- Established 1995, Petaling Jaya, Selangor, Malaysia (MY-10). Phones +603-7498-0827 / +603-7877-6537 / +603-7877-0289, email admin@hyper-advance.com.
- Authorised distributor for Aiphone, AJB, Austco, Amperes, Lutron, Fagor, Bodet, Esa Grimma; supporting brands Dahua, HIKVision, ZKTeco, Bosch, Paradox, AMX, etc.
- The incumbent visual identity (navy + cyan "tech" look) is NOT a binding commitment; the revamp replaces the visual world while keeping name, logo, content, routes, and SEO machinery.

## Evidence on Hand

- Real assets in repo (`Hyper Advance/v4/public/assets/`): brand logo, 20 office photos, ~50 project photo folders (KLCC, Four Seasons KL, W Hotel, Sunway, Mid Valley, hospitals, mosques, malls), client logos (Gleneagles, IGB, IOI, JKR, KKM, KLCC, KPJ, PNB, Sunway, Park City Medical Centre), 8 brand logos, 4 reference PDFs.
- Catalog data (`public/data/catalog.json`): company facts (30 staff, 10+ systems, 8 brands, 31 years), 150 projects with sector/date/client/systems, 10 system profiles, 8 distributors with products, success stories (Four Seasons KL — Lutron; KLCC — Aiphone IX, 280 door stations; Hospital UTAR — full ELV).
- Absent: nothing needed for the revamp; new copy must derive from catalog facts, never fabricate.

## Product Principles

1. Proof over claims: delivered projects lead every surface; capability statements support, never substitute for, evidence.
2. Truthfulness is a business asset: no invented projects, testimonials, numbers, or credentials.
3. Evaluation speed: a tender evaluator must find what the company does, what it has delivered, and how to act within seconds.
4. The real assets govern: real project photos and logos are the material; placeholders are clearly marked and never presented as final.
5. Durable facts live in this record; visual decisions live in DESIGN.md, decided deliberately later.
6. SEO is a product feature: every surface ships with prerendered meta, structured data, and crawlable content.
