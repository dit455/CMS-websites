"""
Create the initial websites and attach all existing content to the default site.

Run this ONCE after migrating to multi-site:
    python manage.py seed_sites

It:
  1. Creates a default 'dit' site (DIT Portal template) and a demo 'deptb' site.
  2. Assigns every existing content row that has no site yet to the 'dit' site,
     so the current DIT website keeps working exactly as before.
"""

from django.apps import apps
from django.core.management.base import BaseCommand
from sites.models import Site


# Models that carry a `site` field and should be back-filled to the default site.
SITE_SCOPED = [
    ('hero_banner', 'HeroBanner'),
    ('services', 'Service'),
    ('documents', 'Document'),
    ('notifications', 'Notification'),
    ('downloads', 'Download'),
    ('news', 'NewsTickerItem'),
    ('news', 'NewsArticle'),
    ('menu_manager', 'MenuItem'),
    ('about_page', 'AboutPage'),
    ('about_page', 'MissionPoint'),
    ('about_page', 'KeyFunction'),
    ('about_page', 'InitiativeFocusPoint'),
    ('portal_settings', 'Official'),
    ('portal_settings', 'Partner'),
    ('portal_settings', 'PortalStat'),
    ('portal_settings', 'QuickLink'),
    ('portal_settings', 'ResourceGroup'),
    ('portal_settings', 'SiteSetting'),
]


class Command(BaseCommand):
    help = 'Create default sites and back-fill existing content to the default site'

    def handle(self, *args, **opts):
        dit, _ = Site.objects.get_or_create(key='dit', defaults={
            'name': 'Directorate of Information Technology',
            'template': 'dit-portal',
            'domain': 'dit.py.gov.in',
            'is_default': True,
            'is_active': True,
        })
        # Ensure it's the default
        if not dit.is_default:
            dit.is_default = True
            dit.save()

        # A second example site (same backend, a different template) so you can
        # see multi-site working immediately.
        Site.objects.get_or_create(key='deptb', defaults={
            'name': 'Department B (demo)',
            'template': 'template-two',
            'domain': '',
            'is_default': False,
            'is_active': True,
        })

        # Back-fill: any content with site=NULL becomes DIT content.
        total = 0
        for app_label, model_name in SITE_SCOPED:
            Model = apps.get_model(app_label, model_name)
            updated = Model.objects.filter(site__isnull=True).update(site=dit)
            total += updated
            self.stdout.write(f'  {app_label}.{model_name}: assigned {updated} rows to "dit"')

        self.stdout.write(self.style.SUCCESS(
            f'Sites seeded. {total} existing rows attached to the default "dit" site.'))
