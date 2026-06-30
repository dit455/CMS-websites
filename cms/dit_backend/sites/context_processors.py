import os
from urllib.parse import urlparse

from django.conf import settings
from .models import Site


def _port_for_folder(folder: str, fallback_port: str) -> str:
    """Read sites.conf and return the dev port registered for a given template folder."""
    conf_path = os.path.normpath(
        os.path.join(settings.BASE_DIR, '..', '..', 'sites.conf')
    )
    try:
        with open(conf_path) as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split(':', 1)
                if len(parts) == 2 and parts[1].strip() == folder:
                    return parts[0].strip()
    except FileNotFoundError:
        pass
    return fallback_port


def active_site(request):
    """Inject cms_active_site and frontend_base_url into every admin template."""
    key = getattr(request, 'session', {}).get('cms_active_site')
    # FRONTEND_BASE_URL is always set in settings.py (auto-detected LAN IP or .env override)
    frontend_base = settings.FRONTEND_BASE_URL

    if not key:
        return {'frontend_base_url': frontend_base}

    try:
        site = Site.objects.get(key=key)

        parsed = urlparse(frontend_base)
        if parsed.path and parsed.path != '/':
            # FRONTEND_BASE_URL already points at a deployed path (e.g. nginx
            # serving the built site at /cms) — just append the site selector.
            site_url = f'{frontend_base.rstrip("/")}/?site={site.key}'
        else:
            # Dev mode: use the port that matches this site's template folder
            # in sites.conf, so "View Website" opens the correct Vite dev server.
            default_port = str(parsed.port or 5173)
            port         = _port_for_folder(site.folder, default_port)
            site_url     = f'{parsed.scheme}://{parsed.hostname}:{port}/?site={site.key}'

        return {
            'cms_active_site':   site,
            'frontend_base_url': frontend_base,
            'frontend_site_url': site_url,
        }
    except Site.DoesNotExist:
        return {'frontend_base_url': frontend_base}
