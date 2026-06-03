# DIT Portal — Multi-Site CMS Guide

One Django backend + one admin now powers **many websites**. Each website:
- has its own content (hero, menu, services, documents, officials, etc.),
- is built from one of your React **templates** (you choose which),
- is just the same template deployed with a different `VITE_SITE_KEY`.

---

## 1. The model in one picture

```
                 ┌──────────────────────────────┐
                 │     ONE Django CMS admin      │   ← you manage everything here
                 └──────────────┬───────────────┘
                                │  every content row has a `site`
        ┌───────────────────────┼───────────────────────┐
   ?site=dit               ?site=deptb              ?site=health
        │                       │                        │
  React build               React build              React build
  VITE_SITE_KEY=dit      VITE_SITE_KEY=deptb     VITE_SITE_KEY=health
  template: dit-portal   template: template-two  template: dit-portal
```

A **Site** row records both *which content* (everything linked to it) and *which
template* the developer chose (`template` field). The frontend says who it is via
`VITE_SITE_KEY`; the backend returns only that site's content.

---

## 2. First-time setup

```bash
cd dit_backend
pip install -r requirements.txt
python manage.py migrate

# Seed starter content (creates the DIT content set)
python manage.py seed_menu
python manage.py seed_services
python manage.py seed_about
python manage.py seed_portal

# IMPORTANT: run this LAST. It creates the sites and attaches all the
# content above to the default "dit" site.
python manage.py seed_sites

python manage.py createsuperuser
python manage.py runserver        # http://localhost:8000
```

Admin: **http://localhost:8000/admin/** → "Websites (Sites)" is where you add sites.

---

## 3. Run the DIT website (frontend)

```bash
cd dit-react-portal
npm install
cp .env.example .env              # VITE_SITE_KEY=dit
npm run dev                       # http://localhost:5173
```

`.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SITE_KEY=dit
```

---

## 4. Add a NEW website managed by the same CMS

### Option A — start from a copy of an existing site (fastest)
```bash
python manage.py clone_site --from dit --to health \
    --name "Health Department" --template dit-portal
```
This creates a `health` Site and gives it its own editable copy of all DIT
content. Edit it in admin under each section (filter by site = Health Department).

### Option B — start empty
1. Admin → Websites (Sites) → Add. Set:
   - **key**: `health`  (this is the VITE_SITE_KEY)
   - **name**: Health Department
   - **template**: pick the template this site uses
2. Add content in each section, choosing "Health Department" in the **site** dropdown.

### Then deploy the frontend for it
Build the chosen template with the new key:
```bash
# in whichever template repo you picked for this site
echo "VITE_API_BASE_URL=https://cms.example.gov/api" > .env
echo "VITE_SITE_KEY=health" >> .env
npm run build      # deploy dist/ to health.example.gov
```

That's the whole process for every new site: **one Site row + one env var.** No code changes.

---

## 5. How content is filtered

Every list endpoint accepts `?site=<key>`:
```
GET /api/services/?site=dit       → DIT services only
GET /api/services/?site=health    → Health services only
GET /api/services/                → default site's services
```
The frontend appends this automatically from `VITE_SITE_KEY` (see
`src/services/cmsApi.js`). Rows with no site set are treated as **shared** and
appear on every site — handy for common items.

Helper endpoints:
```
GET /api/sites/                   → list configured websites
GET /api/site-config/?site=health → { key, name, template, ... }
```

---

## 6. Making a NEW template CMS-aware

You said you'll have 2–3 templates. Any React template becomes multi-site-ready by
copying three things from `dit-react-portal`:

1. `src/services/cmsApi.js`   — the fetch client (already appends `?site=`).
2. `src/services/cmsMapper.js` — maps API JSON → your component props.
3. The fetch-on-mount + merge pattern in `src/content/ContentContext.jsx`
   (fetch all endpoints once, merge over your template's defaults).

Then:
- Register the template name in `dit_backend/sites/models.py` →
  `Site.TEMPLATE_CHOICES` (e.g. add `('template-two', 'Template Two')`).
- Point the template's `.env` at the backend with its `VITE_SITE_KEY`.

The mapper is where templates differ — each template maps the same CMS data onto
its own component shape. The API and site-filtering are identical for all of them.

---

## 7. Management commands reference

| Command | What it does |
|---|---|
| `python manage.py seed_sites` | Create default sites + attach existing content to "dit". Run once after migrating. |
| `python manage.py clone_site --from dit --to KEY --name "..." --template T` | Create a new site pre-filled with a copy of another site's content. |
| `python manage.py seed_menu / seed_services / seed_about / seed_portal` | Seed the starter DIT content set (run before `seed_sites`). |

---

## 8. CORS / production
Add each site's domain to `CORS_ALLOWED_ORIGINS` in `config/settings.py`. Serve
`/media/` for uploaded images, and set `VITE_API_BASE_URL` to the deployed backend
URL in each frontend build.
