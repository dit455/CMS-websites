from django import forms
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.utils.html import format_html, mark_safe
from django.db.models import Count
from .models import Site, SiteAdminProfile

User = get_user_model()

# All apps whose content site owners are allowed to manage
_CONTENT_APPS = [
    'news', 'notifications', 'services', 'hero_banner',
    'downloads', 'documents', 'menu_manager', 'about_page', 'portal_settings',
]


def _grant_content_permissions(user):
    """Grant view/add/change/delete permissions on all content models to a site owner."""
    perms = Permission.objects.filter(content_type__app_label__in=_CONTENT_APPS)
    user.user_permissions.set(perms)
    # Clear the cached permissions so they take effect immediately
    if hasattr(user, '_perm_cache'):
        del user._perm_cache
    if hasattr(user, '_user_perm_cache'):
        del user._user_perm_cache

TEMPLATE_COLOURS = {
    'template-one':   '#3B82F6',
    'template-two':   '#10B981',
    'template-three': '#F59E0B',
    'template-four':  '#8B5CF6',
}


class SuperuserOnlyMixin:
    def has_module_perms(self, request):            return request.user.is_superuser
    def has_view_permission(self, request, obj=None):   return request.user.is_superuser
    def has_add_permission(self, request):              return request.user.is_superuser
    def has_change_permission(self, request, obj=None): return request.user.is_superuser
    def has_delete_permission(self, request, obj=None): return request.user.is_superuser


# ── Form: Site details + optional Site Owner creation ─────────────────────────
class SiteForm(forms.ModelForm):
    owner_username = forms.CharField(
        required=False,
        label='Username',
        help_text='The login username for the person who will manage this site.',
        widget=forms.TextInput(attrs={'placeholder': 'e.g. health_admin'}),
    )
    owner_password = forms.CharField(
        required=False,
        label='Password',
        widget=forms.PasswordInput(attrs={'placeholder': 'Min 8 characters'}),
    )
    owner_password2 = forms.CharField(
        required=False,
        label='Confirm password',
        widget=forms.PasswordInput(attrs={'placeholder': 'Repeat password'}),
    )
    owner_email = forms.EmailField(
        required=False,
        label='Email (optional)',
        widget=forms.EmailInput(attrs={'placeholder': 'owner@department.gov.in'}),
    )

    class Meta:
        model  = Site
        fields = '__all__'

    def clean(self):
        data      = super().clean()
        username  = data.get('owner_username', '').strip()
        password  = data.get('owner_password', '')
        password2 = data.get('owner_password2', '')

        if username:
            if not password:
                self.add_error('owner_password', 'Password is required.')
            elif len(password) < 8:
                self.add_error('owner_password', 'Password must be at least 8 characters.')
            elif password != password2:
                self.add_error('owner_password2', 'Passwords do not match.')
            if User.objects.filter(username=username).exists():
                self.add_error('owner_username', f'Username "{username}" is already taken.')
        return data


# ── Inline: show site owner(s) on the Site edit page ─────────────────────────
class SiteOwnerInline(admin.TabularInline):
    model               = SiteAdminProfile.sites.through
    extra               = 0
    verbose_name        = 'Site Owner'
    verbose_name_plural = 'Site Owners'
    can_delete          = True

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('siteadminprofile__user')


# ── SiteAdmin ─────────────────────────────────────────────────────────────────
@admin.register(Site)
class SiteAdmin(SuperuserOnlyMixin, admin.ModelAdmin):
    """
    SUPERADMIN ONLY.
    Create a website here and optionally create the Site Owner login in one step.
    The Site Owner can then log in and manage only this site's content.
    """
    form               = SiteForm
    list_display       = ('template_badge', 'name', 'key', 'domain', 'is_active', 'is_default', 'owner_count')
    list_display_links = ('name',)
    list_editable      = ('is_active', 'is_default')
    list_filter        = ('template', 'is_active')
    search_fields      = ('name', 'key', 'domain')
    prepopulated_fields = {'key': ('name',)}
    ordering           = ('template', 'name')
    inlines            = [SiteOwnerInline]

    def get_fieldsets(self, request, obj=None):
        base = [
            ('Website Identity', {
                'fields': ('name', 'key', 'domain'),
                'description': (
                    '<b>key</b> is the site identifier — must be unique and lowercase. '
                    'Example: <code>health</code>, <code>tourism</code>, <code>finance</code>'
                ),
            }),
            ('Template & Status', {
                'fields': ('template', 'is_active', 'is_default'),
            }),
        ]
        if obj is None:   # Only show owner creation on Add, not Edit
            base.append((
                '🔑 Create Site Owner Login',
                {
                    'fields': ('owner_username', 'owner_password', 'owner_password2', 'owner_email'),
                    'description': (
                        'Create the login credentials for the person who will manage this website\'s content. '
                        'They will only have access to this site. '
                        '<b>Leave blank</b> if you want to add the owner later.'
                    ),
                    'classes': ('wide',),
                },
            ))
        return base

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            return   # Only seed + create owner on initial site creation

        # Auto-seed default content so the new site looks populated immediately.
        try:
            from sites.seed_utils import seed_site_defaults
            seed_site_defaults(obj)
            messages.info(request, f'Default content (menu, officials, partners…) seeded for "{obj.name}".')
        except Exception as exc:
            messages.warning(request, f'Content seeding failed: {exc}')

        username = form.cleaned_data.get('owner_username', '').strip()
        password = form.cleaned_data.get('owner_password', '')
        email    = form.cleaned_data.get('owner_email', '')

        if username and password:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_staff=True,
                is_active=True,
            )
            # Grant Django auth permissions for all content models
            _grant_content_permissions(user)
            # Link user to this site via SiteAdminProfile
            profile, _ = SiteAdminProfile.objects.get_or_create(user=user)
            profile.sites.add(obj)
            messages.success(
                request,
                f'✅  Site owner "{username}" created. '
                f'They can now log in and manage "{obj.name}" content.'
            )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_owner_count=Count('admins', distinct=True))

    def template_badge(self, obj):
        colour = TEMPLATE_COLOURS.get(obj.template, '#6B7280')
        label  = dict(Site.TEMPLATE_CHOICES).get(obj.template, obj.template)
        return format_html(
            '<span style="background:{c};color:#fff;padding:3px 10px;'
            'border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap">{l}</span>',
            c=colour, l=label,
        )
    template_badge.short_description = 'Template'
    template_badge.admin_order_field = 'template'

    def owner_count(self, obj):
        n = obj._owner_count
        colour = '#10B981' if n else '#EF4444'
        icon   = '👤' if n else '⚠️'
        return format_html('<span style="color:{}">{} {}</span>', colour, icon, n)
    owner_count.short_description = 'Owner'
    owner_count.admin_order_field = '_owner_count'

# NOTE: SiteAdminProfile is intentionally NOT registered as a standalone admin page.
# Site owners are managed directly from the Website (Site) edit page above.
