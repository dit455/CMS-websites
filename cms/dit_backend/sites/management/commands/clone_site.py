"""
Clone all content from one site to another — a fast way to spin up a new website
pre-filled with a working set of content that you then edit in admin.

    python manage.py clone_site --from dit --to health --name "Health Department" --template template-two

If the target site doesn't exist it is created.
"""

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from sites.models import Site


# (app_label, Model) for simple per-row content. Singletons handled separately.
ROW_MODELS = [
    ('hero_banner', 'HeroBanner'),
    ('services', 'Service'),
    ('documents', 'Document'),
    ('notifications', 'Notification'),
    ('downloads', 'Download'),
    ('news', 'NewsTickerItem'),
    ('news', 'NewsArticle'),
    ('portal_settings', 'Official'),
    ('portal_settings', 'Partner'),
    ('portal_settings', 'PortalStat'),
    ('portal_settings', 'QuickLink'),
    ('about_page', 'MissionPoint'),
    ('about_page', 'KeyFunction'),
    ('about_page', 'InitiativeFocusPoint'),
]


class Command(BaseCommand):
    help = 'Clone all content from one site to another'

    def add_arguments(self, parser):
        parser.add_argument('--from', dest='src', required=True, help='Source site key')
        parser.add_argument('--to', dest='dst', required=True, help='Target site key')
        parser.add_argument('--name', dest='name', default='', help='Name for new target site')
        parser.add_argument('--template', dest='template', default='dit-portal', help='Template for new target site')

    def handle(self, *args, **o):
        src = Site.objects.filter(key=o['src']).first()
        if not src:
            raise CommandError(f"Source site '{o['src']}' not found")
        dst, created = Site.objects.get_or_create(key=o['dst'], defaults={
            'name': o['name'] or o['dst'].title(),
            'template': o['template'],
            'is_active': True,
        })
        self.stdout.write(('Created' if created else 'Using existing') + f" target site '{dst.key}'")

        for app_label, model_name in ROW_MODELS:
            Model = apps.get_model(app_label, model_name)
            n = 0
            for obj in Model.objects.filter(site=src):
                obj.pk = None
                obj.id = None
                obj.site = dst
                # NewsArticle has a unique slug — make it site-unique
                if model_name == 'NewsArticle' and getattr(obj, 'slug', None):
                    obj.slug = f'{obj.slug}-{dst.key}'
                obj.save()
                n += 1
            self.stdout.write(f'  {app_label}.{model_name}: cloned {n}')

        # Singletons: AboutPage + SiteSetting (OneToOne per site)
        from about_page.models import AboutPage
        from portal_settings.models import SiteSetting
        for Model, rel in [(AboutPage, 'aboutpage'), (SiteSetting, 'sitesetting')]:
            src_obj = Model.objects.filter(site=src).first()
            if src_obj and not Model.objects.filter(site=dst).exists():
                src_obj.pk = None
                src_obj.id = None
                src_obj.site = dst
                src_obj.save()
                self.stdout.write(f'  {Model.__name__}: cloned singleton')

        # Menu items: copy parents first, then children (preserve hierarchy)
        from menu_manager.models import MenuItem
        id_map = {}
        for parent in MenuItem.objects.filter(site=src, parent__isnull=True):
            old_id = parent.id
            parent.pk = None; parent.id = None; parent.site = dst
            parent.save()
            id_map[old_id] = parent
        for child in MenuItem.objects.filter(site=src, parent__isnull=False):
            new_parent = id_map.get(child.parent_id)
            child.pk = None; child.id = None; child.site = dst
            child.parent = new_parent
            child.save()
        self.stdout.write(f'  menu_manager.MenuItem: cloned {len(id_map)} parents + children')

        self.stdout.write(self.style.SUCCESS(
            f"Done. Site '{dst.key}' now has its own editable copy of '{src.key}' content."))
