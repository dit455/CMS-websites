from pathlib import Path
from django import forms
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.utils.html import format_html, mark_safe
from django.db.models import Count
from .models import Site, SiteAdminProfile

# Project root = cms/dit_backend/sites/ → up 4 levels
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
_EXTENSIONS_DIR = _PROJECT_ROOT / 'template-one' / 'src' / 'extensions'


def _create_site_extension(site_key: str) -> str | None:
    """
    Creates template-one/src/extensions/<site_key>/index.jsx with a clean
    fresh template. The developer adds only what they need.
    Returns the created path, or None if the folder already existed.
    """
    ext_dir = _EXTENSIONS_DIR / site_key
    index_file = ext_dir / 'index.jsx'
    if ext_dir.exists():
        return None
    ext_dir.mkdir(parents=True, exist_ok=True)
    pascal = ''.join(w.capitalize() for w in site_key.replace('-', '_').split('_'))
    content = (
        f"/**\n"
        f" * ┌─────────────────────────────────────────────────────────────┐\n"
        f" *   SITE EXTENSION — {site_key}\n"
        f" *   Only this site loads this file. Other sites are not affected.\n"
        f" * └─────────────────────────────────────────────────────────────┘\n"
        f" *\n"
        f" *  HOW TO USE\n"
        f" *  ──────────\n"
        f" *  1. Set fullPage = true  → You control the entire page layout.\n"
        f" *     Import only the sections you want and list them below.\n"
        f" *\n"
        f" *  2. Set fullPage = false → Your sections are added AFTER the\n"
        f" *     default page. Good for just appending extra sections.\n"
        f" *\n"
        f" *  AVAILABLE SECTIONS (uncomment to use)\n"
        f" *  ──────────────────────────────────────\n"
        f" *  import NewsTicker         from '../../components/NewsTicker';\n"
        f" *  import HeroSlider         from '../../components/HeroSlider';\n"
        f" *  import DepartmentOverview from '../../components/DepartmentOverview';\n"
        f" *  import Officials          from '../../components/Officials';\n"
        f" *  import Services           from '../../components/Services';\n"
        f" *  import Activities         from '../../components/Activities';\n"
        f" *  import CitizenResources   from '../../components/CitizenResources';\n"
        f" *  import Documents          from '../../components/Documents';\n"
        f" *  import Downloads          from '../../components/Downloads';\n"
        f" *  import Notifications      from '../../components/Notifications';\n"
        f" *  import Grievances         from '../../components/Grievances';\n"
        f" *  import GovernmentPartners from '../../components/GovernmentPartners';\n"
        f" *\n"
        f" *  TO OVERRIDE A SECTION'S LAYOUT FOR THIS SITE ONLY\n"
        f" *  ───────────────────────────────────────────────────\n"
        f" *  1. Copy the component file into this folder:\n"
        f" *       FROM: ../../components/HeroSlider.jsx\n"
        f" *       TO:   ./HeroSlider.jsx\n"
        f" *  2. Change the import to point to the local copy:\n"
        f" *       import HeroSlider from './HeroSlider';\n"
        f" *  3. Edit ./HeroSlider.jsx freely — other sites are not affected.\n"
        f" */\n"
        f"\n"
        f"export const fullPage = false; // change to true to control the full layout\n"
        f"\n"
        f"import SectionWrapper from '../../components/SectionWrapper';\n"
        f"\n"
        f"const {pascal}Extension = () => (\n"
        f"  <>\n"
        f"    {{/* Add your sections here */}}\n"
        f"  </>\n"
        f");\n"
        f"\n"
        f"export default {pascal}Extension;\n"
    )
    index_file.write_text(content, encoding='utf-8')
    return str(index_file)

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
    department_name = forms.CharField(
        required=False,
        label='Department Name',
        help_text='Full name shown in the website header, e.g. "Department of Health Services".',
        widget=forms.TextInput(attrs={'placeholder': 'e.g. Department of Health Services'}),
    )
    government_name = forms.CharField(
        required=False,
        label='Government Name',
        help_text='Shown below the department name, e.g. "Government of Puducherry".',
        widget=forms.TextInput(attrs={'placeholder': 'e.g. Government of Puducherry'}),
    )

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
                'fields': ('name', 'key', 'domain', 'department_name', 'government_name'),
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

        # Save department/government name typed in the form into SiteSetting
        dept_name = form.cleaned_data.get('department_name', '').strip()
        govt_name = form.cleaned_data.get('government_name', '').strip()
        if dept_name or govt_name:
            from portal_settings.models import SiteSetting
            setting, _ = SiteSetting.objects.get_or_create(site=obj)
            if dept_name: setting.department_name = dept_name
            if govt_name: setting.government_name = govt_name
            setting.save()

        # Create the site-specific extension folder in template-one/src/extensions/<key>/
        created = _create_site_extension(obj.key)
        if created:
            messages.info(
                request,
                f'Extension folder created: template-one/src/extensions/{obj.key}/index.jsx — '
                f'open that file to add sections unique to this site.'
            )

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

    def delete_model(self, request, obj):
        key = obj.key
        super().delete_model(request, obj)
        ext_dir = _EXTENSIONS_DIR / key
        if ext_dir.exists():
            import shutil
            shutil.rmtree(ext_dir)
            messages.info(request, f'Extension folder template-one/src/extensions/{key}/ deleted.')

    def delete_queryset(self, request, queryset):
        import shutil
        keys = list(queryset.values_list('key', flat=True))
        super().delete_queryset(request, queryset)
        for key in keys:
            ext_dir = _EXTENSIONS_DIR / key
            if ext_dir.exists():
                shutil.rmtree(ext_dir)
                messages.info(request, f'Extension folder template-one/src/extensions/{key}/ deleted.')

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
