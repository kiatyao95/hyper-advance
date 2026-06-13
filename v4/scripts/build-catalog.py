#!/usr/bin/env python3
"""Rebuild v4/public/data/catalog.json from References/ materials."""

from __future__ import annotations

import json
import re
import shutil
import unicodedata
from datetime import date
from pathlib import Path

import fitz
from openpyxl import load_workbook

try:
    from PIL import Image
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parents[2]
REFS = ROOT / "References"
V4 = ROOT / "v4"
OUT = V4 / "public" / "data" / "catalog.json"
ASSETS = V4 / "public" / "assets"
BASE_CATALOG = OUT

LOCATIONS = {"KL", "SEL", "PJ", "PG", "JB", "SB", "WP", "Johor", "Sabah", "Penang", "Pahang", "KEDAH", "Kuala Lumpur", "Seremban", "Thailand", "Myanmar", "Singapore", "Saudi Arabia", "Kelantan", "Perak", "Putrajaya", "Melaka", "Pahang", "N Sembilan", "Vietnam", "Sri Lanka", "Kuwait", "Terengganu"}

SERIES_SET = {"GF", "GH", "GT", "IX", "IXG", "JO"}

TYPE_KEYWORDS = (
    "Audio Intercom", "B/W Video Intercom", "Color Video Intercom",
    "AUDIO INTERCOM", "AUDIO VIDEO INTERCOM", "Audio Video Intercom",
)

FEATURED_NAMES = {
    "four seasons hotel kl", "four seasons kl", "klcc", "hospital utar",
    "hospital universiti tunku abdul rahman", "k2 data centre", "pnb 118",
    "pnb office", "sunway medical centre damansara", "sunway medical centre velocity",
    "menara tan & tan", "midvalley centrepoint north & south", "gardens mall",
    "prince court medical centre", "istana terengganu", "genting premium outlet",
    "crowne plaza", "hilton kota kinabalu",
}

VERIFIED_AMOUNTS = {
    "four seasons hotel kl": "RM 4.4M",
    "four seasons kl": "RM 4.4M",
    "hospital utar": "RM 3.3M",
    "hospital universiti tunku abdul rahman": "RM 3.3M",
}

EXISTING_IMAGES = {
    "istana terengganu": "https://www.hyper-advance.com/assets/img/projects/Pernah%20Tengok%20Dalaman%20Istana%20Baru%20Diraja%20Terengganu.jpg",
    "prince court medical centre": "https://www.hyper-advance.com/assets/img/projects/2.jpg",
    "island hospital penang": "https://www.hyper-advance.com/assets/img/projects/5.jpg",
    "four seasons hotel kl": "https://www.hyper-advance.com/assets/img/projects/four-seasons-kuala-lumpur-malaysia-16.jpg",
    "eco tropics jb": "https://www.hyper-advance.com/assets/img/projects/7.jpg",
    "princess cove": "https://www.hyper-advance.com/assets/img/projects/8.jpg",
    "hk square": "https://www.hyper-advance.com/assets/img/projects/9.jpg",
    "sunway convention centre": "https://www.hyper-advance.com/assets/img/projects/11.jpg",
    "hosp sultan abdul halim": "https://www.hyper-advance.com/assets/img/projects/12.jpg",
    "mutiara ville cyberjaya": "https://www.hyper-advance.com/assets/img/projects/13.jpg",
    "laguna residences": "https://www.hyper-advance.com/assets/img/projects/14.jpg",
    "koi prima": "https://www.hyper-advance.com/assets/img/projects/15.jpg",
    "star residences klcc": "https://www.hyper-advance.com/assets/img/projects/17.jpg",
    "genting highland p outlet": "https://www.hyper-advance.com/assets/img/projects/18.jpg",
    "help university kl": "https://www.hyper-advance.com/assets/img/projects/19.jpg",
    "iskandar putri hospital": "https://www.hyper-advance.com/assets/img/projects/20.jpg",
    "kpj puteri": "https://www.hyper-advance.com/assets/img/projects/21.jpg",
    "ppum cic": "https://www.hyper-advance.com/assets/img/projects/22.jpg",
    "lai meng school": "https://www.hyper-advance.com/assets/img/projects/23.jpg",
    "kpj dato onn": "https://www.hyper-advance.com/assets/img/projects/24.jpg",
    "hospital cyberjaya": "https://www.hyper-advance.com/assets/img/projects/25.jpg",
    "hosp pengajar upm": "https://www.hyper-advance.com/assets/img/projects/26.jpg",
}

SYSTEM_TAG = {
    "nurse-call": "Nurse Call",
    "public-address": "Public Address",
    "av-intercom": "AV Intercom",
    "building-intercom": "Building Intercom",
    "lighting-control": "Lighting Control",
    "smatv": "SMATV",
    "master-clock": "Master Clock",
    "ips": "IPS System",
}

BRAND_TO_DIST = {
    "austco": ("austco", "nurse-call"),
    "aiphone": ("aiphone", "av-intercom"),
    "ajb": ("ajb", "building-intercom"),
    "amperes": ("amperes", "public-address"),
    "lutron": ("lutron", "lighting-control"),
    "fagor": ("fagor", "smatv"),
    "bodet": ("bodet", "master-clock"),
    "esa grimma": ("esa-grimma", "ips"),
    "bsa grimma": ("esa-grimma", "ips"),
    "entrypass": ("amperes", "public-address"),
    "falco": ("amperes", "public-address"),
}

SYSTEM_KEYWORDS = [
    ("nurse call", "nurse-call", "austco"),
    ("nurse-call", "nurse-call", "austco"),
    ("public address", "public-address", "amperes"),
    ("pa system", "public-address", "amperes"),
    ("pa &", "public-address", "amperes"),
    ("smatv", "smatv", "fagor"),
    ("master clock", "master-clock", "bodet"),
    ("lutron", "lighting-control", "lutron"),
    ("lighting", "lighting-control", "lutron"),
    ("intercom", "av-intercom", "aiphone"),
    ("card access", "public-address", "amperes"),
    ("cctv", "public-address", "amperes"),
    ("ips", "ips", "esa-grimma"),
]


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = s.encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()
    return re.sub(r"\s+", " ", s)


def slugify(name: str, suffix: str = "") -> str:
    base = re.sub(r"[^a-z0-9]+", "-", norm(name))[:60].strip("-")
    return f"{base}-{suffix}" if suffix else base


def is_year(v: str) -> bool:
    return bool(re.fullmatch(r"20\d{2}", v.strip()))


def is_qty(v: str) -> bool:
    v = v.replace(",", "").strip()
    return v.isdigit() and int(v) < 50000


def is_location(v: str) -> bool:
    return v.strip() in LOCATIONS or v.strip().lower() in {x.lower() for x in LOCATIONS}


def is_series(v: str) -> bool:
    return v.strip().upper() in SERIES_SET


def is_type(v: str) -> bool:
    u = v.upper()
    return any(t.upper() in u for t in TYPE_KEYWORDS) or "INTERCOM" in u


def sector_for(name: str, category: str = "") -> str:
    n = norm(name)
    cat = category.upper()
    if "HOSPITAL" in n or "MEDICAL" in n or "KPJ" in n or "CLINIC" in n or "HEALTH" in n:
        return "healthcare"
    if "HOTEL" in n or "RESORT" in n or "HILTON" in n or "MARRIOTT" in n or "FOUR SEASON" in n:
        return "hospitality"
    if "CONDO" in n or "RESIDEN" in n or "VILLA" in n or "APARTMENT" in n or "TOWER" in n and "OFFICE" not in n:
        return "residential"
    if cat in ("HOTELS / RESORTS",):
        return "hospitality"
    if cat in ("EDUCATION & TRAINING", "SCHOOLS"):
        return "commercial"
    if cat in ("GOVERNMENT / PUBLIC", "SECURITY"):
        return "commercial"
    return "commercial"


def resolve_image(name: str, sector: str) -> str:
    key = norm(name)
    if key in EXISTING_IMAGES:
        return EXISTING_IMAGES[key]
    return f"/assets/projects/placeholder-{sector}.jpg"


def parse_systems_text(text: str) -> list[tuple[str, str, str]]:
    """Return list of (systemId, distributorId, label) from xlsx systems column."""
    out = []
    t = (text or "").lower()
    for kw, sid, did in SYSTEM_KEYWORDS:
        if kw in t:
            out.append((sid, did, kw))
    return out


def project_record(
    name: str,
    *,
    system_id: str,
    distributor_id: str,
    model: str = "",
    sector: str = "commercial",
    completion: str = "",
    amount: str | None = None,
    unit_count: int | None = None,
    intercom_type: str = "",
    location: str = "",
    source: str = "",
    featured: bool = False,
    additional_systems: list[str] | None = None,
    suffix: str = "",
) -> dict:
    sid = slugify(name, suffix) if suffix else slugify(name)
    rec = {
        "id": sid,
        "name": name.strip(),
        "systemId": system_id,
        "distributorId": distributor_id,
        "model": model or "",
        "sector": sector,
        "tag": SYSTEM_TAG.get(system_id, system_id),
        "featured": featured,
        "image": resolve_image(name, sector),
        "source": source,
    }
    if completion:
        rec["completionDate"] = completion if completion.lower() in ("on-going", "ongoing") else str(completion)
    if amount:
        rec["contractAmount"] = amount
    if unit_count:
        rec["unitCount"] = unit_count
    if intercom_type:
        rec["intercomType"] = intercom_type
    if location:
        rec["location"] = location
    if additional_systems:
        rec["additionalSystems"] = additional_systems
    return rec


def parse_aiphone_q3() -> list[dict]:
    doc = fitz.open(REFS / "Aiphone Project References-Q32024.pdf")
    lines = [l.strip() for l in "".join(p.get_text() for p in doc).split("\n") if l.strip()]

    # skip headers until COMPLETED PROJECTS
    start = 0
    for i, l in enumerate(lines):
        if l == "COMPLETED PROJECTS":
            start = i + 1
            break

    projects = []
    i = start
    while i < len(lines):
        if not re.fullmatch(r"\d+(?:\.\d+)?", lines[i]):
            i += 1
            continue
        num = lines[i]
        i += 1
        if i >= len(lines):
            break
        name = lines[i]
        i += 1

        # optional location
        location = ""
        if i < len(lines) and is_location(lines[i]):
            location = lines[i]
            i += 1

        # may have second location line skipped
        series = ""
        if i < len(lines) and is_series(lines[i]):
            series = lines[i]
            i += 1

        qty = None
        if i < len(lines) and is_qty(lines[i]):
            qty = int(lines[i].replace(",", ""))
            i += 1

        intercom_type = ""
        if i < len(lines) and is_type(lines[i]):
            intercom_type = lines[i]
            i += 1

        year = ""
        if i < len(lines) and is_year(lines[i]):
            year = lines[i]
            i += 1

        # handle dual qty/type rows (e.g. ARA Bangsar)
        while i < len(lines) and is_qty(lines[i]):
            i += 1
            if i < len(lines) and is_type(lines[i]):
                intercom_type = lines[i] if not intercom_type else intercom_type
                i += 1
            if i < len(lines) and is_year(lines[i]):
                year = lines[i]
                i += 1

        if "Project Referenes" in name or name.startswith("Page "):
            continue

        n = norm(name)
        projects.append(project_record(
            name,
            system_id="av-intercom",
            distributor_id="aiphone",
            model=series or "GF/GH/GT",
            sector="residential",
            completion=year,
            unit_count=qty,
            intercom_type=intercom_type,
            location=location,
            source="aiphone-q3",
            featured=n in FEATURED_NAMES,
            suffix=num.replace(".", "-"),
        ))

    return projects


def parse_aiphone_q4() -> list[dict]:
    doc = fitz.open(REFS / "Aiphone Project References-Q42024(IX Series).pdf")
    lines = [l.strip() for l in "".join(p.get_text() for p in doc).split("\n") if l.strip()]

    projects = []
    i = 0
    while i < len(lines):
        if not re.fullmatch(r"\d+", lines[i]):
            i += 1
            continue
        i += 1
        if i >= len(lines):
            break
        name = lines[i]
        i += 1
        if name.startswith("For enquiry"):
            break
        location = lines[i] if i < len(lines) else ""
        i += 1
        series = lines[i] if i < len(lines) else ""
        i += 1
        qty = int(lines[i].replace(",", "")) if i < len(lines) and is_qty(lines[i]) else None
        i += 1
        intercom_type = lines[i] if i < len(lines) else ""
        i += 1
        year = lines[i] if i < len(lines) and is_year(lines[i]) else ""
        i += 1

        sec = sector_for(name)
        n = norm(name)
        projects.append(project_record(
            name.title() if name.isupper() else name,
            system_id="av-intercom",
            distributor_id="aiphone",
            model=series,
            sector=sec,
            completion=year,
            unit_count=qty,
            intercom_type=intercom_type,
            location=location,
            source="aiphone-q4",
            featured=n in FEATURED_NAMES,
        ))
    return projects


def parse_bodet() -> list[dict]:
    doc = fitz.open(REFS / "BODET INSTALLATION BY HYPER ADVANCE.pdf")
    text = "".join(p.get_text() for p in doc)
    rows = re.findall(
        r"(\d+)\s+(.+?)\s+(20\d{2})\s+([\d,]+\.?\d*)",
        text,
    )
    projects = []
    for _, title, year, amount in rows:
        amt = f"RM {amount.strip().replace(',', '')}"
        if "." in amt.split()[-1]:
            val = float(amt.split()[-1])
            amt = f"RM {int(val):,}" if val >= 1000 else f"RM {val:,.0f}"
        n = norm(title)
        projects.append(project_record(
            title.strip(),
            system_id="master-clock",
            distributor_id="bodet",
            model="Master Clock",
            sector=sector_for(title),
            completion=year,
            amount=amt,
            source="bodet-pdf",
            featured=n in FEATURED_NAMES,
        ))
    return projects


def parse_amperes() -> list[dict]:
    doc = fitz.open(REFS / "Amperes_Ref_2023_compressed.pdf")
    lines = [l.strip() for l in "".join(p.get_text() for p in doc).split("\n") if l.strip()]

    projects = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line in (
            "Project References", "CATEGORY", "INSTALLATION", "LOCATION", "YEAR",
            "Providing dedicated Public Address System since 1999",
            "amperes electronics sdn bhd", "www.ampereselectronics.com",
            "Updated as at Nov 2020", "2014 - 2023",
        ) or line.startswith("The list comprises") or line.startswith("Source:") or line.startswith("Older references"):
            i += 1
            continue

        if line.isupper() and len(line) > 8 and "/" in line or line in (
            "OFFICE TOWERS", "HOTELS / RESORTS", "EDUCATION & TRAINING", "SCHOOLS",
            "ENTERTAINMENT & SHOPPING, COMMERCIAL, MIXED DEV.", "SECURITY",
            "GOVERNMENT / PUBLIC",
        ):
            category = line
            i += 1
            installs = []
            while i < len(lines):
                if lines[i].isupper() and len(lines[i]) > 10:
                    break
                if is_year(lines[i]) or lines[i] in LOCATIONS or lines[i].lower() in {x.lower() for x in LOCATIONS}:
                    break
                if lines[i] in ("Project References", "CATEGORY"):
                    break
                installs.append(lines[i])
                i += 1
            locations = []
            while i < len(lines):
                if is_year(lines[i]):
                    break
                if lines[i].isupper() and len(lines[i]) > 10 and "/" in lines[i]:
                    break
                locations.append(lines[i])
                i += 1
            years = []
            while i < len(lines):
                if not is_year(lines[i]) and lines[i] not in ("2016 / 17",):
                    break
                y = lines[i].replace(" / 17", "").strip()
                if is_year(y):
                    years.append(y)
                i += 1
                if len(years) >= len(installs):
                    break

            count = min(len(installs), len(years))
            for j in range(count):
                name = installs[j]
                loc = locations[j] if j < len(locations) else ""
                year = years[j]
                n = norm(name)
                projects.append(project_record(
                    name,
                    system_id="public-address",
                    distributor_id="amperes",
                    model="PA System",
                    sector=sector_for(name, category),
                    completion=year,
                    location=loc,
                    source="amperes-pdf",
                    featured=n in FEATURED_NAMES,
                    suffix=f"{slugify(category)[:20]}-{j}",
                ))
            continue
        i += 1
    return projects


def parse_xlsx() -> list[dict]:
    wb = load_workbook(REFS / "Project Details.xlsx", data_only=True)
    ws = wb["Project reference"]
    projects = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row[0]:
            continue
        name = str(row[0]).strip()
        model = str(row[1] or "").strip()
        brand = str(row[2] or "").strip().lower()
        systems_text = str(row[3] or "")
        completion = str(row[4] or "").strip()

        brand_key = brand.replace(" ", "")
        dist_id, sys_id = BRAND_TO_DIST.get(brand, (None, None))
        if not dist_id:
            parsed = parse_systems_text(systems_text)
            if parsed:
                sys_id, dist_id, _ = parsed[0]
            else:
                sys_id, dist_id = "public-address", "amperes"

        additional = [s[0] for s in parse_systems_text(systems_text)[1:]]
        n = norm(name)
        amount = VERIFIED_AMOUNTS.get(n)
        projects.append(project_record(
            name.title() if name.isupper() else name,
            system_id=sys_id,
            distributor_id=dist_id,
            model=model,
            sector=sector_for(name),
            completion=completion,
            amount=amount,
            source="xlsx",
            featured=n in FEATURED_NAMES,
            additional_systems=additional or None,
        ))

        # secondary entries for filter accuracy
        for sid, did, _ in parse_systems_text(systems_text)[1:4]:
            projects.append(project_record(
                name.title() if name.isupper() else name,
                system_id=sid,
                distributor_id=did,
                model=model,
                sector=sector_for(name),
                completion=completion,
                source="xlsx-secondary",
                featured=False,
                suffix=sid,
            ))
    return projects


def merge_projects(sources: list[list[dict]]) -> list[dict]:
    merged: dict[str, dict] = {}
    order: list[str] = []

    def key(p: dict) -> str:
        if p.get("source") in ("aiphone-q3", "amperes-pdf"):
            return p["id"]
        return f"{norm(p['name'])}|{p['distributorId']}|{p.get('systemId','')}|{p.get('completionDate','')}|{p.get('unitCount','')}"

    for batch in sources:
        for p in batch:
            k = key(p)
            if k not in merged:
                merged[k] = p
                order.append(k)
            else:
                existing = merged[k]
                for field in ("model", "completionDate", "contractAmount", "unitCount", "intercomType", "location", "additionalSystems", "image"):
                    if p.get(field) and not existing.get(field):
                        existing[field] = p[field]
                if p.get("featured"):
                    existing["featured"] = True
                if p.get("source") == "xlsx":
                    existing["source"] = "xlsx"

    # apply verified amounts / featured overrides
    for p in merged.values():
        n = norm(p["name"])
        if n in VERIFIED_AMOUNTS:
            p["contractAmount"] = VERIFIED_AMOUNTS[n]
        if n in FEATURED_NAMES:
            p["featured"] = True
        if n == "four seasons kl" or n == "four seasons hotel kl":
            p["contractAmount"] = "RM 4.4M"
            p["completionDate"] = "2017"
            p["featured"] = True
        if "klcc" == n:
            p["unitCount"] = 280
            p["completionDate"] = "2023"
            p["featured"] = True

    return [merged[k] for k in order]


def build_industry_projects(projects: list[dict]) -> dict:
    sectors = ["healthcare", "hospitality", "commercial", "residential"]
    out = {s: [] for s in sectors}
    seen = {s: set() for s in sectors}

    # priority featured first
    sorted_projects = sorted(projects, key=lambda p: (not p.get("featured"), p["name"]))

    for p in sorted_projects:
        sec = p.get("sector", "commercial")
        if sec not in out:
            sec = "commercial"
        if p["id"] in seen[sec]:
            continue
        if len(out[sec]) >= 12:
            continue
        out[sec].append({"projectId": p["id"]})
        seen[sec].add(p["id"])

    return out


def copy_assets() -> list[str]:
    office_dir = ASSETS / "office"
    refs_dir = ASSETS / "references"
    projects_dir = ASSETS / "projects"
    brand_dir = ASSETS / "brand"
    for d in (office_dir, refs_dir, projects_dir, brand_dir):
        d.mkdir(parents=True, exist_ok=True)

    # reference PDFs
    pdf_map = {
        "aiphone-q32024.pdf": "Aiphone Project References-Q32024.pdf",
        "aiphone-q42024.pdf": "Aiphone Project References-Q42024(IX Series).pdf",
        "amperes-2023.pdf": "Amperes_Ref_2023_compressed.pdf",
        "bodet-installations.pdf": "BODET INSTALLATION BY HYPER ADVANCE.pdf",
    }
    for dest, src in pdf_map.items():
        shutil.copy2(REFS / src, refs_dir / dest)

    # logo
    logo_src = REFS / "HYPER TRANSPARENT LOGO WITH NAME.png"
    if logo_src.exists():
        shutil.copy2(logo_src, brand_dir / "hyper-advance-logo.png")

    # office photos
    gallery = []
    src_dir = REFS / "Hyper Advance Office" / "Hyper Advance Office Photos"
    if src_dir.exists():
        for img_path in sorted(src_dir.glob("*.jpg")):
            dest = office_dir / img_path.name
            if Image:
                with Image.open(img_path) as im:
                    im = im.convert("RGB")
                    w, h = im.size
                    if w > 1400:
                        im = im.resize((1400, int(h * 1400 / w)), Image.Resampling.LANCZOS)
                    im.save(dest, "JPEG", quality=82, optimize=True)
            else:
                shutil.copy2(img_path, dest)
            gallery.append(f"/assets/office/{img_path.name}")

    # placeholder images per sector
    sectors = ["healthcare", "hospitality", "commercial", "residential"]
    placeholder_colors = {
        "healthcare": (30, 80, 140),
        "hospitality": (120, 90, 40),
        "commercial": (50, 50, 80),
        "residential": (60, 100, 90),
    }
    if Image:
        for sec in sectors:
            path = projects_dir / f"placeholder-{sec}.jpg"
            if not path.exists():
                img = Image.new("RGB", (800, 500), placeholder_colors[sec])
                img.save(path, "JPEG", quality=85)

    return gallery


def main():
    with open(BASE_CATALOG, encoding="utf-8") as f:
        base = json.load(f)

    gallery = copy_assets()

    aiphone_q3 = parse_aiphone_q3()
    aiphone_q4 = parse_aiphone_q4()
    bodet = parse_bodet()
    amperes = parse_amperes()
    xlsx = parse_xlsx()

    projects = merge_projects([xlsx, aiphone_q4, bodet, aiphone_q3, amperes])

    # ensure unique ids
    used_ids: set[str] = set()
    for p in projects:
        base_id = p["id"]
        n = 1
        while p["id"] in used_ids:
            p["id"] = f"{base_id}-{n}"
            n += 1
        used_ids.add(p["id"])

    catalog = {
        "meta": {
            "company": "Hyper Advance Sdn Bhd",
            "version": "2.0",
            "updated": date.today().isoformat(),
            "projectCount": len(projects),
        },
        "systems": base["systems"],
        "distributors": base["distributors"],
        "keyDistributorship": [
            {"id": "intercom", "title": "INTERCOM SYSTEM", "icon": "fa-video", "brandIds": ["aiphone", "ajb"]},
            {"id": "lighting", "title": "LIGHTING & GUEST ROOM CONTROL SYSTEM", "icon": "fa-lightbulb", "brandIds": ["lutron"]},
            {"id": "nurse-call", "title": "NURSE CALL SYSTEM", "icon": "fa-user-nurse", "brandIds": ["austco"]},
            {"id": "pa", "title": "PA SYSTEM", "icon": "fa-bullhorn", "brandIds": ["amperes"]},
            {"id": "smatv", "title": "SMATV SYSTEM", "icon": "fa-tv", "brandIds": ["fagor"]},
            {"id": "ips", "title": "IPS SYSTEM", "icon": "fa-shield-halved", "brandIds": ["esa-grimma"]},
            {"id": "master-clock", "title": "MASTER CLOCK SYSTEM", "icon": "fa-clock", "brandIds": ["bodet"]},
        ],
        "company": {
            "founded": 1995,
            "staffCount": 50,
            "yearsExperience": 31,
            "successStories": [
                {
                    "name": "Four Seasons Hotel Kuala Lumpur",
                    "system": "Lutron Lighting & Curtain Control",
                    "contractAmount": "RM 4.4M",
                    "completionDate": "2017",
                    "detail": "209 luxurious guest rooms",
                    "distributorId": "lutron",
                    "systemId": "lighting-control",
                },
                {
                    "name": "KLCC Twin Towers",
                    "system": "Aiphone IX Intercom",
                    "contractAmount": None,
                    "completionDate": "2023",
                    "detail": "280 IP video door stations for emergency access across both towers",
                    "distributorId": "aiphone",
                    "systemId": "av-intercom",
                },
                {
                    "name": "Hospital UTAR",
                    "system": "Full ELV — Nurse Call, CCTV, Card Access, PA",
                    "contractAmount": "RM 3.3M",
                    "completionDate": "2022",
                    "detail": "250-bed teaching hospital",
                    "distributorId": "austco",
                    "systemId": "nurse-call",
                },
            ],
            "hotelReferences": [
                {"name": "St Giles Kuala Lumpur", "systems": "Card Access, PA, CCTV"},
                {"name": "Hard Rock Penang", "systems": "Card Access, PA, CCTV"},
                {"name": "Furama Hotel Kuala Lumpur", "systems": "Card Access, PA, CCTV, Barrier Gate"},
                {"name": "Boulevard Hotel Mid Valley", "systems": "Card Access, PA, CCTV, Barrier Gate"},
                {"name": "Sheraton Petaling Jaya", "systems": "Lighting Control System"},
                {"name": "Hilton Garden Inn Puchong", "systems": "Lighting Control System"},
                {"name": "Hotel Seri Iskandar", "systems": "Hotel Lockset System"},
                {"name": "Ombak Villa Langkawi", "systems": "Hotel Lockset System"},
            ],
            "officeGallery": gallery,
            "supportingBrands": [
                {"system": "Fireman Intercom", "brands": "Mictron"},
                {"system": "Digital Call", "brands": "GMS, MYQ"},
                {"system": "Master Clock", "brands": "National Time, Bodet"},
                {"system": "Conference", "brands": "Bosch"},
                {"system": "Panic Button", "brands": "Austco, Paradox"},
                {"system": "Intruder Alarm", "brands": "Paradox"},
                {"system": "Card Access", "brands": "ZKTeco, EntryPass, Microengine, Bosch, Dahua, HIKVision"},
                {"system": "CCTV", "brands": "Dahua, HIKVision, Bosch"},
                {"system": "Audio Visual", "brands": "AMX, Abtus, Yamaha, Aten, Extron"},
            ],
        },
        "referenceDocuments": [
            {"label": "Aiphone Residential References (Q3 2024)", "url": "/assets/references/aiphone-q32024.pdf", "distributorId": "aiphone"},
            {"label": "Aiphone Non-Residential IX Series (Q4 2024)", "url": "/assets/references/aiphone-q42024.pdf", "distributorId": "aiphone"},
            {"label": "Amperes Project References (2023)", "url": "/assets/references/amperes-2023.pdf", "distributorId": "amperes"},
            {"label": "Bodet Installations by Hyper Advance", "url": "/assets/references/bodet-installations.pdf", "distributorId": "bodet"},
        ],
        "projects": projects,
        "industryProjects": build_industry_projects(projects),
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Wrote {len(projects)} projects to {OUT}")
    print(f"Office gallery: {len(gallery)} images")


if __name__ == "__main__":
    main()
