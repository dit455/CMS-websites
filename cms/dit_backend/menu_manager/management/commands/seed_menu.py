from django.core.management.base import BaseCommand
from menu_manager.models import MenuItem

DEFAULT_MENU = [
    ('Home',           '#',               'FaHome',       '',      False, 10),
    ('About Us',       '#about-detail',   'FaInfoCircle', '',      False, 20),
    ('Services',       '#services',       'FaCogs',       '',      True,  30),
    ('Documents',      '#documents',      'FaFileAlt',    '',      False, 40),
    ('Notifications',  '#notifications',  'FaBell',       'Live',  False, 50),
    ('Tenders',        '#tenders',        'FaFileAlt',    '',      False, 60),
    ('RTI',            '#rti',            'FaGavel',      'Info',  False, 70),
    ('More',           '#more',           'FaEllipsisH',  '',      False, 80),
]

MORE_CHILDREN = [
    ('EoDB',        '#eodb',        'FaBriefcase', '',    10),
    ('Grievances',  '#grievances',  'FaComments',  '',    20),
    ('Downloads',   '#downloads',   'FaDownload',  'PDF', 30),
    ('Contact',     '#contact',     'FaEnvelope',  '',    40),
]


class Command(BaseCommand):
    help = 'Seeds the database with the default DIT portal navigation menu'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear all items before seeding')

    def handle(self, *args, **options):
        if options.get('clear'):
            MenuItem.objects.all().delete()
            self.stdout.write(self.style.WARNING('All menu items cleared.'))

        if MenuItem.objects.exists():
            self.stdout.write(self.style.WARNING(
                'Menu items already exist. Use --clear to reset.\n'
                'Command: python manage.py seed_menu --clear'
            ))
            return

        created = {}
        for label, href, icon, badge, is_mega, order in DEFAULT_MENU:
            item = MenuItem.objects.create(
                label=label, href=href, icon=icon,
                badge=badge, is_mega_menu=is_mega, order=order
            )
            created[label] = item
            self.stdout.write(f'  + Created: {label}')

        more = created['More']
        for label, href, icon, badge, order in MORE_CHILDREN:
            MenuItem.objects.create(
                label=label, href=href, icon=icon,
                badge=badge, parent=more, order=order
            )
            self.stdout.write(f'    -> Child: {label}')

        self.stdout.write(self.style.SUCCESS('\nDefault menu seeded! Visit /admin/menu_manager/menuitem/'))
