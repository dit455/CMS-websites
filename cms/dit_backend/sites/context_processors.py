from .models import Site


def active_site(request):
    """Inject cms_active_site into every template (used by admin/base_site.html)."""
    key = getattr(request, 'session', {}).get('cms_active_site')
    if not key:
        return {}
    try:
        return {'cms_active_site': Site.objects.get(key=key)}
    except Site.DoesNotExist:
        return {}
