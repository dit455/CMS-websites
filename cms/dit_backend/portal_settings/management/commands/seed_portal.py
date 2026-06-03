from django.core.management.base import BaseCommand, CommandError
from sites.seed_utils import seed_portal_for_site


class Command(BaseCommand):
    help = 'Seed officials, partners, site settings, stats and quick links for a site'

    def add_arguments(self, parser):
        parser.add_argument('--site', metavar='KEY', help='Site key to seed (e.g. "dit"). Defaults to the default site.')

    def handle(self, *args, **options):
        from sites.models import Site

        site_key = options.get('site')
        if site_key:
            site = Site.objects.filter(key=site_key).first()
            if not site:
                raise CommandError(f'No site found with key "{site_key}".')
        else:
            site = Site.get_default()
            if not site:
                raise CommandError('No default site configured. Use --site KEY to specify one.')

        seed_portal_for_site(site)
        self.stdout.write(self.style.SUCCESS(f'Portal data seeded for site "{site.key}".'))
