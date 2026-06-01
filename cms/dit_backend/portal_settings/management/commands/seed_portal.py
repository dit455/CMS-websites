"""Seed the portal_settings tables with the data that previously lived in the
React defaultContent.js / portalConfig.js so the site looks identical on first run."""

from django.core.management.base import BaseCommand
from portal_settings.models import (Official, Partner, SiteSetting, PortalStat,
                                     QuickLink, ResourceGroup, ResourcePoint)


class Command(BaseCommand):
    help = 'Seed officials, partners, site settings, stats and quick links'

    def handle(self, *args, **opts):
        SiteSetting.objects.get_or_create(pk=1)

        officials = [
            ("Shri. K. LAKSHMINARAYANAN", "Hon'ble Minister for Information Technology", "KL"),
            ("Shri Choudhary Mohammed Yasin, I.A.S.", "Secretary to Government (IT)", "CMY"),
            ("Shri. Aman Sharma", "Director of Information Technology", "AS"),
        ]
        for i, (n, r, ini) in enumerate(officials):
            Official.objects.get_or_create(name=n, defaults={'role': r, 'initials': ini, 'order': i})

        stats = [("24x7", "Digital access"), ("6", "Core IT services"), ("1", "Unified resource hub")]
        for i, (v, l) in enumerate(stats):
            PortalStat.objects.get_or_create(label=l, defaults={'value': v, 'order': i})

        quick = [
            ("Services", "Citizen-facing digital services", "laptop", "#services", "#3B82F6", "rgba(59,130,246,0.12)"),
            ("Documents", "Policies, templates and guidelines", "fileInvoice", "#documents", "#4F46E5", "rgba(79,70,229,0.12)"),
            ("Notifications", "Latest departmental announcements", "bullhorn", "#notifications", "#7C3AED", "rgba(124,58,237,0.12)"),
            ("Downloads", "Forms, circulars and official assets", "download", "#downloads", "#10B981", "rgba(16,185,129,0.12)"),
        ]
        for i, (lbl, cap, ic, hr, ac, su) in enumerate(quick):
            QuickLink.objects.get_or_create(label=lbl, defaults={'caption': cap, 'icon': ic, 'href': hr, 'accent': ac, 'surface': su, 'order': i})

        partners = [
            ("Digital India", "DI", "Flagship digital transformation programme of the Government of India.", "https://www.digitalindia.gov.in/", "purple"),
            ("MeitY", "ME", "Ministry of Electronics and Information Technology.", "https://www.meity.gov.in/", "blue"),
            ("National Informatics Centre", "NI", "Technology partner for digital government infrastructure.", "https://www.nic.in/", "purple"),
            ("Government of Puducherry", "PY", "Official government portal for the Union Territory.", "https://py.gov.in/", "blue"),
            ("eProcurement", "EP", "Central Public Procurement and tendering platform.", "https://eprocure.gov.in/eprocure/app", "emerald"),
            ("DigiLocker", "DL", "Digital document wallet for verified citizen records.", "https://www.digilocker.gov.in/", "emerald"),
            ("UMANG", "UM", "Unified mobile access to government services.", "https://web.umang.gov.in/landing/", "purple"),
            ("MyGov", "MG", "Citizen engagement platform for participatory governance.", "https://www.mygov.in/", "emerald"),
        ]
        for i, (n, ini, d, u, t) in enumerate(partners):
            Partner.objects.get_or_create(name=n, defaults={
                'initials': ini, 'wordmark': n, 'description': d, 'url': u, 'tone': t, 'order': i})

        resource_groups = [
            ('notifications', 'Updates', 'Notifications & Alerts',
             'Track circulars, advisory notices, workshop announcements, and service updates released by the department.',
             'bell', '#7C3AED', 'rgba(124,58,237,0.12)', '#notifications', 'Open updates',
             ['Latest circulars', 'System advisories', 'Department announcements']),
            ('downloads', 'Resources', 'Downloads Hub',
             'Access templates, guidelines, forms, and official documents prepared for departments, vendors, and citizens.',
             'download', '#10B981', 'rgba(16,185,129,0.12)', '#documents', 'View downloads',
             ['Application templates', 'Guideline documents', 'Reference forms']),
            ('tenders', 'Procurement', 'Tenders',
             'Access procurement notices, eTendering references, and tender-related document support for IT initiatives.',
             'tender', '#10B981', 'rgba(16,185,129,0.12)', '#documents', 'Open tender resources',
             ['eTendering links', 'Vendor notices', 'Procurement documents']),
            ('eodb', 'Business', 'Ease of Doing Business',
             'Quick access to digital facilitation touchpoints that support departmental services and business-facing processes.',
             'briefcase', '#3B82F6', 'rgba(59,130,246,0.12)', '#services', 'Explore services',
             ['Service enablement', 'Workflow simplification', 'Digital access points']),
            ('rti', 'Transparency', 'Right to Information',
             'Find the relevant information area for citizen communication, contact details, and document-led transparency flows.',
             'gavel', '#4F46E5', 'rgba(79,70,229,0.12)', '#contact', 'Contact the office',
             ['Citizen contact flow', 'Document references', 'Public information support']),
        ]
        for i, (slug, eb, title, desc, ic, ac, su, hr, cta, points) in enumerate(resource_groups):
            grp, created = ResourceGroup.objects.get_or_create(slug=slug, defaults={
                'eyebrow': eb, 'title': title, 'description': desc, 'icon': ic,
                'accent': ac, 'surface': su, 'href': hr, 'cta': cta, 'order': i})
            if created:
                for j, pt in enumerate(points):
                    ResourcePoint.objects.create(group=grp, text=pt, order=j)

        self.stdout.write(self.style.SUCCESS('Portal data seeded.'))
