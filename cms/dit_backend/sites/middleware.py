from django.shortcuts import redirect

_SKIP = {
    '/admin/login/',
    '/admin/logout/',
    '/admin/dashboard/',
    '/admin/select-site/',
    '/admin/switch-site/',
    '/admin/manage-content/',
    '/admin/jsi18n/',
    '/admin/autocomplete/',
    '/admin/password_change/',
    '/admin/password_change/done/',
}


class SitePickerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path

        if path.startswith('/admin/') and not self._skip(path):
            if request.user.is_authenticated:

                if request.user.is_superuser:
                    # Superadmin: always land on the dashboard first
                    # Allow free navigation ONLY if they came from the dashboard
                    # (i.e. they clicked "Manage Content" and have an active site)
                    if path == '/admin/' and not request.session.get('cms_active_site'):
                        return redirect('/admin/dashboard/')

                else:
                    # Dept admin: must have an active site selected
                    if not request.session.get('cms_active_site'):
                        auto = self._auto_site(request)
                        if auto:
                            request.session['cms_active_site'] = auto
                        else:
                            return redirect('/admin/select-site/')

        return self.get_response(request)

    def _skip(self, path):
        if path in _SKIP:
            return True
        if path.startswith('/admin/static/') or path.startswith('/static/'):
            return True
        return False

    def _auto_site(self, request):
        try:
            sites = request.user.site_admin_profile.sites.filter(is_active=True)
            if sites.count() == 1:
                return sites.first().key
        except Exception:
            pass
        return None
