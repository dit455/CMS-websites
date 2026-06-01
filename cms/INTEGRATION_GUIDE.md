# DIT Portal — React ↔ Django CMS Integration

This bundle connects the **React frontend** to the **Django CMS backend** so that
content edited in the Django admin (`/admin/`) shows up automatically on the
public site. Everything falls back to the built-in default content when the
backend is offline, so the site never breaks.

---

## 1. What is now editable from Django admin

| Front-end section            | Django admin location                                  | API endpoint                       |
|------------------------------|--------------------------------------------------------|------------------------------------|
| Hero banner slides (+ Prev/Next arrows) | Hero Banner Slides                          | `/api/hero-banners/`               |
| Top menu / navbar            | Menu Items                                             | `/api/menu/`                       |
| About Us page (all text)     | About Page Settings, Mission Points, Key Functions, Initiative Focus Points | `/api/about/`     |
| Services cards               | Services + Service Links                               | `/api/services/`                   |
| Documents                    | Documents                                              | `/api/documents/`                  |
| Notifications                | Notifications                                          | `/api/notifications/`              |
| News ticker                  | News Ticker Items                                      | `/api/news/ticker/`                |
| Leadership & Officials       | Leadership & Officials                                 | `/api/portal/officials/`           |
| Connected Platforms (partners marquee) | Connected Platforms                          | `/api/portal/partners/`            |
| Hero stat tiles              | Hero Stats                                             | `/api/portal/stats/`               |
| Hero quick links             | Quick Links                                            | `/api/portal/quick-links/`         |
| Citizen resource cards (Notifications / Tenders / RTI / EoDB / Downloads) | Citizen Resource Cards | `/api/portal/resource-groups/` |
| Footer / contact / web info manager | Site Settings                                   | `/api/portal/settings/`            |

> **Tenders, RTI, EoDB, Grievance, Contact** are surfaced through the
> *Citizen Resource Cards* (`resource-groups`) and *Site Settings* (address,
> phone, email for the Grievance/Contact area). Edit those in admin and they
> update on the home page.

---

## 2. Backend setup (Django)

```bash
cd dit_backend
python -m venv venv && source venv/bin/activate     # optional
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser                     # to log into /admin/

# Seed starter content (matches the original front-end exactly)
python manage.py seed_menu
python manage.py seed_services
python manage.py seed_about
python manage.py seed_portal        # officials, partners, stats, quick-links, resource cards, settings

python manage.py runserver           # serves http://localhost:8000
```

Django admin: **http://localhost:8000/admin/**

---

## 3. Frontend setup (React)

```bash
cd dit-react-portal
npm install
cp .env.example .env                 # sets VITE_API_BASE_URL=http://localhost:8000/api
npm run dev                          # http://localhost:5173
```

That's it. On load the app calls every CMS endpoint once, merges the results
over its defaults, and renders. Change something in Django admin, refresh the
React page, and the change appears.

---

## 4. How the wiring works (for developers)

New files in the React project:

- `src/services/cmsApi.js` — one `fetch`-based client for every endpoint.
  Fails gracefully (returns `null`) when the backend is down.
- `src/services/cmsMapper.js` — converts each Django JSON shape into the exact
  keys the existing components already use (so components barely changed).
- `src/content/ContentContext.jsx` — on mount, fetches all CMS data in parallel,
  maps it, and **merges it over** the local/default content. Also exposes the
  CMS-driven `menu`.

Components updated to consume CMS data:

- `HeroSlider.jsx` — added **Previous / Next** arrows (`controls={true}`) and
  support for CMS image URLs (`slide.imageUrl`).
- `Header.jsx` — navbar is built from `/api/menu/` (icon names → React icons),
  with a hardcoded fallback menu if the API is unavailable.
- `Officials.jsx` — uses the CMS photo (`photoUrl`) and per-official email.
- `GovernmentPartners.jsx` — reads the partner list from the CMS.
- `AboutDetailPage.jsx` — every heading/paragraph/bullet comes from the CMS.
- `CitizenResources.jsx` / `Documents.jsx` — already read from the content
  store, which is now CMS-fed.

### Adding a new menu icon
If you pick an icon in admin that React doesn't know yet, add it to `ICON_MAP`
in `src/components/Header.jsx` (string name → `<FaSomething size={14} />`).

---

## 5. Uploading images (officials, partners, hero)
Upload through Django admin. The API returns absolute URLs
(`http://localhost:8000/media/...`) which React uses directly. In production,
make sure Django serves `/media/` (or use a CDN/S3) and that the React
`VITE_API_BASE_URL` points at the deployed backend.

---

## 6. CORS
`config/settings.py` already allows `localhost:5173` and `localhost:3000`.
Add your production domain to `CORS_ALLOWED_ORIGINS` before deploying.
