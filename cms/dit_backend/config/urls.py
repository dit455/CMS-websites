"""
Main URL Configuration for DIT CMS Backend

All API endpoints are prefixed with /api/
Django Admin is at /admin/
Media files are served at /media/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from sites.views_admin import site_select, site_switch, superadmin_dashboard, manage_content

# Customize the Admin panel header
admin.site.site_header = "DIT Puducherry CMS"
admin.site.site_title = "DIT Admin Portal"
admin.site.index_title = "Content Management"

urlpatterns = [
    # Root → redirect to admin
    path('', RedirectView.as_view(url='/admin/', permanent=False)),

    # Custom admin views — must be BEFORE admin.site.urls
    path('admin/dashboard/',      superadmin_dashboard, name='admin_dashboard'),
    path('admin/manage-content/', manage_content,       name='admin_manage_content'),
    path('admin/select-site/',    site_select,          name='admin_site_select'),
    path('admin/switch-site/',    site_switch,          name='admin_site_switch'),

    # Django Admin Panel
    path('admin/', admin.site.urls),

    # API Routes — each app handles its own sub-routes
    path('api/news/',          include('news.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/services/',      include('services.urls')),
    path('api/hero-banners/',  include('hero_banner.urls')),
    path('api/downloads/',     include('downloads.urls')),
    path('api/about/',     include('about_page.urls')),
    path('api/menu/',      include('menu_manager.urls')),
    path('api/documents/',     include('documents.urls')),
    path('api/news/',          include('news.urls')),
    path('api/portal/',        include('portal_settings.urls')),
    path('api/',               include('sites.urls')),
]

# In development, serve media files (uploaded images/PDFs) directly
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
