from django.conf import settings
from .models import Site


def active_site(request):
    """Inject cms_active_site and frontend_base_url into every admin template."""
    key = getattr(request, 'session', {}).get('cms_active_site')
    frontend_base = getattr(settings, 'FRONTEND_BASE_URL', 'http://10.65.51.44:5173')

    if not key:
        return {'frontend_base_url': frontend_base}
    try:
        site = Site.objects.get(key=key)
        return {
            'cms_active_site':  site,
            'frontend_base_url': frontend_base,
            'frontend_site_url': f'{frontend_base}/?site={site.key}',
        }
    except Site.DoesNotExist:
        return {'frontend_base_url': frontend_base}
