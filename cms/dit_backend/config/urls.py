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

# Customize the Admin panel header
admin.site.site_header = "DIT Puducherry CMS"
admin.site.site_title = "DIT Admin Portal"
admin.site.index_title = "Content Management"

urlpatterns = [
    # Django Admin Panel (full CMS at /admin/)
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
