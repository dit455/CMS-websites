from django.core.management.base import BaseCommand
from services.models import Service, ServiceLink

DEFAULT_SERVICES = [
    {
        'icon': 'network', 'title': 'PSWAN (State Wide Area Network)',
        'desc': 'High-speed network connectivity linking all government departments across the Union Territory.',
        'accent_color': '#3B82F6', 'surface_color': 'rgba(59,130,246,0.12)', 'order': 10,
        'links': [('Learn more', '#services-detail'), ('Apply', '#contact')],
    },
    {
        'icon': 'server', 'title': 'State Data Centre (SDC)',
        'desc': 'Centralized hosting and cloud infrastructure providing secure data storage and disaster recovery.',
        'accent_color': '#4F46E5', 'surface_color': 'rgba(79,70,229,0.12)', 'order': 20,
        'links': [('Cloud Services', '#services-detail'), ('Guidelines', '#documents')],
    },
    {
        'icon': 'users', 'title': 'Common Services Centres',
        'desc': 'One-stop shop for G2C services, ensuring digital empowerment for citizens at the grassroot level.',
        'accent_color': '#10B981', 'surface_color': 'rgba(16,185,129,0.12)', 'order': 30,
        'links': [('Find a CSC', '#services-detail'), ('Register', '#contact')],
    },
    {
        'icon': 'portal', 'title': 'Government Portals & Applications',
        'desc': 'Design, development, and maintenance support for official portals, applications, and online services.',
        'accent_color': '#7C3AED', 'surface_color': 'rgba(124,58,237,0.12)', 'order': 40,
        'links': [('Portal support', '#services-detail'), ('Request help', '#contact')],
    },
    {
        'icon': 'shield', 'title': 'Cybersecurity & Data Governance',
        'desc': 'Policy, advisory, and implementation support for secure government systems and data management.',
        'accent_color': '#4F46E5', 'surface_color': 'rgba(79,70,229,0.12)', 'order': 50,
        'links': [('Security services', '#services-detail'), ('Guidelines', '#documents')],
    },
    {
        'icon': 'training', 'title': 'Capacity Building & IT Consultancy',
        'desc': 'Technical consultancy, digital skill development, and project support for departmental digitization.',
        'accent_color': '#10B981', 'surface_color': 'rgba(16,185,129,0.12)', 'order': 60,
        'links': [('Training support', '#services-detail'), ('Contact DIT', '#contact')],
    },
]

class Command(BaseCommand):
    help = 'Seeds Services with default DIT content'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true')

    def handle(self, *args, **options):
        if options['clear']:
            Service.objects.all().delete()
        if Service.objects.exists():
            self.stdout.write(self.style.WARNING('Services already seeded. Use --clear to reset.'))
            return
        for svc in DEFAULT_SERVICES:
            links = svc.pop('links')
            s = Service.objects.create(**svc)
            for i, (label, href) in enumerate(links):
                ServiceLink.objects.create(service=s, label=label, href=href, order=(i+1)*10)
            self.stdout.write(f'  + {s.title}')
        self.stdout.write(self.style.SUCCESS('Services seeded!'))
