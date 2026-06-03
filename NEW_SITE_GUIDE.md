# How to Add a New Site to DIT Portal Multisite

This guide walks through every step needed to create a new site: building the React template folder,
registering the site in the CMS admin, and wiring it into `start.bat` via `sites.conf`.

---

## Overview

The multisite setup works like this:

```
sites.conf
  └─ tells start.bat which folders/ports to launch

React folder (e.g. react-health/)
  └─ .env sets VITE_SITE_KEY=health
  └─ renders content from /api/...?site=health

Django CMS
  └─ Site record with key="health"
  └─ All content filtered by that key
```

One Django backend + as many React frontends as you need, each with its own folder, port, and site key.

---

## Step 1 — Create a New React Template Folder

### 1a. Copy the base template

Open a terminal in the project root and copy the existing `react/` folder:

```powershell
Copy-Item -Recurse react react-health
```

Replace `react-health` with your site name (e.g. `react-tourism`, `react-finance`).

### 1b. Install dependencies

```powershell
cd react-health
npm install
```

### 1c. Create the environment file

Create a file called `.env` inside the new folder (`react-health/.env`):

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SITE_KEY=health
```

- `VITE_API_BASE_URL` — always points to the single Django backend.
- `VITE_SITE_KEY` — **must exactly match the site key you will register in the CMS** (Step 2).

### 1d. Customise the template (optional)

At this point the new folder is an exact copy of the base template. You can now:

| What to change | Where |
|---|---|
| Colours, fonts, layout | `react-health/src/` — any component / CSS file |
| Default fallback content | `react-health/src/content/defaultContent.js` |
| Logo / favicon | `react-health/public/` |
| Site-specific components | `react-health/src/components/` |

The API integration (`cmsApi.js`, `cmsMapper.js`) reads `VITE_SITE_KEY` automatically, so
all CMS content for this site is fetched without any extra code changes.

---

## Step 2 — Register the New Site in the CMS

You only need to do **one** of these options (admin UI is easier for most cases).

### Option A — Django Admin UI

1. Start the backend (or run `start.bat` first).
2. Open [http://localhost:8000/admin](http://localhost:8000/admin) and log in.
3. Go to **Sites** → **Websites (Sites)** → **Add**.
4. Fill in the form:

| Field | Example value | Notes |
|---|---|---|
| Key | `health` | Lowercase slug, no spaces. **Must match `VITE_SITE_KEY`** |
| Name | `Health Department` | Human-readable label shown in admin |
| Template | `dit-portal` | Choose the registered template for this site |
| Domain | `health.dit.gov.in` | Optional — informational only in development |
| Is active | ✔ | Must be checked for the site to return data |
| Is default | ☐ | Only one site can be default; leave unchecked unless replacing the default |

5. Click **Save**.

### Option B — Management Command (clone an existing site)

Run this from the project root to copy all content from `dit` to your new site:

```powershell
.venv\Scripts\python.exe cms\dit_backend\manage.py clone_site `
    --from dit `
    --to health `
    --name "Health Department" `
    --template dit-portal
```

This creates the Site record **and** copies every piece of content (news, services, hero banners, etc.)
so you have real content to start with.

### Verify the site is working

After registration, test the API from a browser or terminal:

```
http://localhost:8000/api/services/?site=health
http://localhost:8000/api/news/?site=health
```

You should get an empty list (or cloned data) instead of a 404.

---

## Step 3 — Add the Site to sites.conf and start.bat

### 3a. Edit sites.conf

Open `sites.conf` at the project root. Add one line per new site:

```
# FORMAT: PORT:RELATIVE_PATH
5173:react          # original DIT site
5174:react-health   # new Health Department site
```

Rules:
- **PORT** — any free port (5173–5179 are conventional for dev).
- **RELATIVE_PATH** — the folder you created in Step 1, relative to the project root.
- Lines starting with `#` are comments and are ignored.
- If you omit `:RELATIVE_PATH` the script defaults to `react/`.

### 3b. No changes to start.bat are needed

`start.bat` reads `sites.conf` automatically. Every uncommented line becomes:
1. A port to kill on startup.
2. A URL printed to the console.
3. A new terminal window running `npm run dev -- --port <PORT>` inside the specified folder.

### 3c. Start everything

Double-click `start.bat` or run it from PowerShell:

```powershell
.\start.bat
```

You will see output like:

```
  Starting DIT Portal...
  Backend  ->  http://localhost:8000
  Frontends:
   - 5173 -> http://localhost:5173 (path: react)
   - 5174 -> http://localhost:5174 (path: react-health)
  Admin    ->  http://localhost:8000/admin
```

Two browser windows open automatically — one per site.

---

## Full Checklist

```
[ ] 1. Copy react/ to react-<sitename>/
[ ] 2. Run npm install inside the new folder
[ ] 3. Create react-<sitename>/.env with VITE_SITE_KEY=<sitename>
[ ] 4. Customise components / styles if needed
[ ] 5. Add Site record in Django admin (key must match VITE_SITE_KEY)
[ ] 6. Add a line to sites.conf: PORT:react-<sitename>
[ ] 7. Run start.bat and open http://localhost:<PORT>
```

---

## Quick Reference

| Item | Location | Purpose |
|---|---|---|
| Site key | `react-<name>/.env` → `VITE_SITE_KEY` | Links frontend to CMS data |
| CMS site record | Admin → Sites → Websites | Registers the site in Django |
| Frontend port | `sites.conf` | Tells start.bat which port to use |
| Fallback content | `react-<name>/src/content/defaultContent.js` | Shown when CMS is offline |
| API filter | `react-<name>/src/services/cmsApi.js` | Appends `?site=<key>` to all requests |
| Content context | `react-<name>/src/content/ContentContext.jsx` | Fetches and merges CMS data on load |

---

## Adding a New Template Choice in Django (advanced)

If you want the new site to appear as a named template option in the admin dropdown, open
`cms/dit_backend/sites/models.py` and add your template slug to `TEMPLATE_CHOICES`:

```python
TEMPLATE_CHOICES = [
    ('dit-portal',   'DIT Portal (Default)'),
    ('health-portal', 'Health Department Portal'),  # <-- add this line
    ('template-two', 'Template Two'),
]
```

Then run a migration:

```powershell
.venv\Scripts\python.exe cms\dit_backend\manage.py makemigrations sites
.venv\Scripts\python.exe cms\dit_backend\manage.py migrate
```

The new option will appear in the admin dropdown when creating or editing a Site record.
