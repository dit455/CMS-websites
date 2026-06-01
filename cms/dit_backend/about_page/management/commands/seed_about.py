from django.core.management.base import BaseCommand
from about_page.models import AboutPage, MissionPoint, KeyFunction, InitiativeFocusPoint

MISSION_POINTS = [
    'To promote effective adoption of Information Technology across Government Departments.',
    'To provide secure, reliable, and citizen-friendly digital services.',
    'To strengthen digital infrastructure and governance frameworks.',
    'To support the implementation of national and state e-Governance initiatives.',
    'To encourage innovation, cybersecurity, and digital inclusiveness in public administration.',
]
KEY_FUNCTIONS = [
    'Implementation of e-Governance projects and digital transformation initiatives.',
    'Development and maintenance of Government portals, applications, and online services.',
    'Providing IT infrastructure support to Government Departments and institutions.',
    'Formulation and implementation of IT policies, standards, and guidelines.',
    'Coordination of Mission Mode Projects under Digital India and NeGP.',
    'Strengthening cybersecurity and data management practices within Government systems.',
    'Facilitating procurement and management of IT hardware, software, and networking solutions.',
    'Capacity building, technical training, and digital skill enhancement for Government officials.',
    'Technical consultancy and project support for departmental digitization initiatives.',
]
INITIATIVE_POINTS = [
    'Online public service delivery',
    'Digital records and workflow automation',
    'Integrated Government platforms',
    'Smart governance solutions',
    'Secure and scalable IT ecosystems',
    'Accessibility and inclusive digital access',
]

class Command(BaseCommand):
    help = 'Seeds About Page with default DIT content'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true')

    def handle(self, *args, **options):
        if options['clear']:
            AboutPage.objects.all().delete()
            MissionPoint.objects.all().delete()
            KeyFunction.objects.all().delete()
            InitiativeFocusPoint.objects.all().delete()

        if AboutPage.objects.exists():
            self.stdout.write(self.style.WARNING('About page already seeded. Use --clear to reset.'))
            return

        AboutPage.objects.create(
            hero_kicker='About Us',
            hero_title='Empowering Digital Governance for a Smarter Puducherry',
            hero_description='The Directorate of Information Technology (DIT), Government of Puducherry, serves as the central agency driving digital transformation and e-Governance initiatives across the Union Territory.',
            intro_para1='Established with the vision of creating a technologically empowered administration, DIT plays a pivotal role in modernizing government services, strengthening digital infrastructure, and enabling citizen-centric governance.',
            intro_para2='With a commitment to innovation, transparency, and efficiency, the Directorate works closely with various Government Departments to design, implement, and manage robust IT solutions.',
            vision_title='Our Vision',
            vision_text='To build a digitally connected, transparent, and technology-driven Puducherry by delivering innovative and accessible e-Governance solutions for citizens, businesses, and government institutions.',
            mission_title='Our Mission',
            citizen_services_title='Citizen-Centric Digital Services',
            citizen_services_text='DIT is committed to simplifying access to Government services through modern digital platforms, ensuring faster delivery, improved transparency, and enhanced user experience for citizens and stakeholders.',
            innovation_title='Driving Innovation & Digital Transformation',
            innovation_para1='As technology continues to evolve, the Directorate actively explores innovative solutions including cloud infrastructure, data analytics, automation, cybersecurity frameworks, and smart governance technologies.',
            innovation_para2='DIT continues to work towards creating a future-ready digital ecosystem that supports sustainable growth, administrative excellence, and seamless citizen engagement.',
            commitment_title='Commitment to Excellence',
            commitment_text='The Directorate of Information Technology remains dedicated to delivering reliable, transparent, and efficient digital governance solutions that contribute to the socio-economic development of Puducherry.',
            commitment_tagline='Together, we are building a smarter, digitally empowered Puducherry.',
        )
        for i, text in enumerate(MISSION_POINTS):
            MissionPoint.objects.create(text=text, order=(i+1)*10)
        for i, text in enumerate(KEY_FUNCTIONS):
            KeyFunction.objects.create(text=text, order=(i+1)*10)
        for i, text in enumerate(INITIATIVE_POINTS):
            InitiativeFocusPoint.objects.create(text=text, order=(i+1)*10)

        self.stdout.write(self.style.SUCCESS('About page seeded successfully!'))
