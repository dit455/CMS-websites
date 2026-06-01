# DIT CMS Django Backend
## Directorate of Information Technology, Government of Puducherry

---

## STEP 1 — Install Python & Create Virtual Environment

Open your terminal/command prompt in the `dit_backend` folder and run:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

---

## STEP 2 — Install All Required Packages

```bash
pip install django djangorestframework django-cors-headers pillow psycopg2-binary python-decouple
```

What each package does:
- `django` — the main framework
- `djangorestframework` — makes building REST APIs easy
- `django-cors-headers` — allows your React app to call this API
- `pillow` — required for Django to handle image uploads
- `psycopg2-binary` — PostgreSQL driver (for later)
- `python-decouple` — reads settings from .env file

---

## STEP 3 — Setup Environment Variables

```bash
cp .env.example .env
```
Edit `.env` if needed (the defaults work for local development).

---

## STEP 4 — Create the Database Tables

```bash
python manage.py migrate
```

This reads all the models.py files and creates the database tables.

---

## STEP 5 — Create Admin User

```bash
python manage.py createsuperuser
```
Enter a username, email, and password. You'll use these to log into the admin panel.

---

## STEP 6 — Start the Development Server

```bash
python manage.py runserver
```

Your backend is now running at: http://localhost:8000

---

## Admin Panel (Your CMS)

Go to: **http://localhost:8000/admin/**

Log in with the superuser account you created. From here you can:
- Add/edit/delete News articles and ticker items
- Manage Notifications with PDF attachments
- Add/edit Services with links
- Upload Hero Banner images
- Manage Downloads (PDF/DOCX files)
- Upload official Documents

---

## API Endpoints Reference

| Module | URL | Description |
|--------|-----|-------------|
| News Ticker | `GET /api/news/ticker/` | Scrolling news items |
| News Articles | `GET /api/news/articles/` | Full articles list |
| Notifications | `GET /api/notifications/` | Department notifications |
| Services | `GET /api/services/` | IT services list |
| Hero Banners | `GET /api/hero-banners/` | Homepage banner slides |
| Downloads | `GET /api/downloads/` | Downloadable files |
| Documents | `GET /api/documents/` | Official documents |

### Filtering Examples
```
GET /api/documents/?category=tenders
GET /api/documents/?search=PSWAN
GET /api/notifications/?category=circular
GET /api/notifications/?important=true
```

---

## React Integration

### 1. Copy these files to your React project:
- `src/services/api.js` → your React `src/services/api.js`
- `src/services/useAPI.js` → your React `src/services/useAPI.js`

### 2. Create `.env` in React project root:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Use in any component:
```jsx
import { useAPI } from '../services/useAPI';
import { documentsAPI } from '../services/api';

function Documents() {
  const { data, loading, error } = useAPI(documentsAPI.getAll);
  if (loading) return <p>Loading...</p>;
  const docs = data?.results || [];
  return docs.map(doc => <div key={doc.id}>{doc.title}</div>);
}
```

---

## Switching to PostgreSQL

1. Install PostgreSQL on your computer
2. Create a database: `CREATE DATABASE dit_cms;`
3. In `.env`, uncomment and fill in:
   ```
   DB_NAME=dit_cms
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=5432
   ```
4. In `config/settings.py`, comment out the SQLite block and uncomment the PostgreSQL block
5. Run `python manage.py migrate` again

---

## Project Structure

```
dit_backend/
├── config/                 ← Project settings & main URLs
│   ├── settings.py         ← All configuration
│   └── urls.py             ← Root URL routing
├── news/                   ← News ticker + articles
│   ├── models.py           ← Database schema
│   ├── serializers.py      ← JSON conversion
│   ├── views.py            ← API logic
│   ├── urls.py             ← URL patterns
│   └── admin.py            ← Admin panel setup
├── notifications/          ← Dept. notifications
├── services/               ← IT services
├── hero_banner/            ← Homepage banners
├── downloads/              ← Downloadable files
├── documents/              ← Official documents
├── media/                  ← Uploaded files (auto-created)
├── manage.py               ← Django management tool
├── .env.example            ← Environment variable template
└── requirements.txt        ← Python package list
```
