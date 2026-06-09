"""
Reusable Django admin mixins for multi-site / multi-template content filtering.

Permission model
----------------
Superusers  → full access to everything.
Dept admins → any staff user with a SiteAdminProfile gets full CRUD on content
              models, but ONLY for their active session site.
              Django's default per-model permission system is bypassed for content
              because permissions are enforced via site ownership instead.
"""

from .models import Site, SiteAdminProfile


def _allowed_sites(request):
    if request.user.is_superuser:
        return None   # None means "no restriction"
    try:
        return request.user.site_admin_profile.sites.all()
    except SiteAdminProfile.DoesNotExist:
        return Site.objects.none()


def _active_site_qs(request):
    """Single-item QS for the session-selected site, validated against allowed sites."""
    key = request.session.get('cms_active_site')
    if not key:
        return None
    allowed = _allowed_sites(request)
    if allowed is None:
        return Site.objects.filter(key=key)
    return allowed.filter(key=key)


def _has_site_access(request):
    """True if the user has permission to manage at least some content."""
    if request.user.is_superuser:
        return True
    # Staff with a SiteAdminProfile and an active site selected
    try:
        request.user.site_admin_profile
        return bool(request.session.get('cms_active_site'))
    except SiteAdminProfile.DoesNotExist:
        return False


class SiteScopedAdminMixin:
    """Add to any ModelAdmin whose model has a `site` ForeignKey."""

    # ── Permission overrides ──────────────────────────────────────────────────
    # We bypass Django's default auth.Permission system entirely for content
    # models. Access is controlled by SiteAdminProfile + session active site.

    def has_module_perms(self, request):
        return _has_site_access(request)

    def has_view_permission(self, request, obj=None):
        if not _has_site_access(request):
            return False
        if obj is not None and hasattr(obj, 'site_id') and not request.user.is_superuser:
            active = _active_site_qs(request)
            if active is not None and not active.filter(pk=obj.site_id).exists():
                return False
        return True

    def has_add_permission(self, request):
        return _has_site_access(request)

    def has_change_permission(self, request, obj=None):
        if not _has_site_access(request):
            return False
        if obj is not None and hasattr(obj, 'site_id') and not request.user.is_superuser:
            active = _active_site_qs(request)
            if active is not None and not active.filter(pk=obj.site_id).exists():
                return False
        return True

    def has_delete_permission(self, request, obj=None):
        if not _has_site_access(request):
            return False
        if obj is not None and hasattr(obj, 'site_id') and not request.user.is_superuser:
            active = _active_site_qs(request)
            if active is not None and not active.filter(pk=obj.site_id).exists():
                return False
        return True

    # ── Queryset filtering ────────────────────────────────────────────────────

    def get_list_filter(self, request):
        filters = list(super().get_list_filter(request))
        if request.user.is_superuser and 'site__template' not in filters:
            filters = ['site__template', 'site'] + [
                f for f in filters if f not in ('site__template', 'site')
            ]
        return filters

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        active = _active_site_qs(request)
        if active is not None:
            return qs.filter(site__in=active)
        allowed = _allowed_sites(request)
        if allowed is None:
            return qs
        return qs.filter(site__in=allowed)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'site':
            active = _active_site_qs(request)
            if active is not None:
                kwargs['queryset'] = active
            else:
                allowed = _allowed_sites(request)
                if allowed is not None:
                    kwargs['queryset'] = allowed
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class TemplateScopedAdminMixin(SiteScopedAdminMixin):
    """
    Extends SiteScopedAdminMixin so an admin section only appears when the
    active site uses a specific template.

    Usage:
        class MyEduAdmin(TemplateScopedAdminMixin, admin.ModelAdmin):
            required_template = 'template-two'   # EDU
    """
    required_template: str | None = None  # override in subclass

    def _active_site_matches(self, request) -> bool:
        if not self.required_template:
            return True
        if request.user.is_superuser:
            return True
        key = request.session.get('cms_active_site')
        if not key:
            return False
        site = Site.objects.filter(key=key).first()
        return bool(site and site.template == self.required_template)

    def has_module_perms(self, request):
        return self._active_site_matches(request) and super().has_module_perms(request)

    def has_view_permission(self, request, obj=None):
        return self._active_site_matches(request) and super().has_view_permission(request, obj)

    def has_add_permission(self, request):
        return self._active_site_matches(request) and super().has_add_permission(request)

    def has_change_permission(self, request, obj=None):
        return self._active_site_matches(request) and super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return self._active_site_matches(request) and super().has_delete_permission(request, obj)


class SiteScopedInlineMixin:
    """Add to any TabularInline/StackedInline whose model has a `site` ForeignKey."""

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        active = _active_site_qs(request)
        if active is not None:
            return qs.filter(site__in=active)
        allowed = _allowed_sites(request)
        if allowed is None:
            return qs
        return qs.filter(site__in=allowed)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'site':
            active = _active_site_qs(request)
            if active is not None:
                kwargs['queryset'] = active
            else:
                allowed = _allowed_sites(request)
                if allowed is not None:
                    kwargs['queryset'] = allowed
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
