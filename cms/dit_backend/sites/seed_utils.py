"""
Default content seeder — called when a new Site is created from the admin.

Each new site gets its own copy of the navigation menu, officials, partners,
stats, quick links, and site settings seeded from the template defaults.
Site admins can then delete, reorder, or modify any item from the CMS.
"""

from menu_manager.models import MenuItem
from portal_settings.models import Official, Partner, SiteSetting, PortalStat, QuickLink


_DEFAULT_MENU = [
    # (label, href, icon, badge, is_mega_menu, order)
    ('Home',          '#',              'FaHome',       '',     False, 10),
    ('About Us',      '#about-detail',  'FaInfoCircle', '',     False, 20),
    ('Services',      '#services',      'FaCogs',       '',     True,  30),
    ('Documents',     '#documents',     'FaFileAlt',    '',     False, 40),
    ('Notifications', '#notifications', 'FaBell',       'Live', False, 50),
    ('Downloads',     '#downloads',     'FaDownload',   '',     False, 60),
    ('Tenders',       '#tenders',       'FaFileAlt',    '',     False, 70),
    ('More',          '#more',          'FaEllipsisH',  '',     False, 80),
]

_MORE_CHILDREN = [
    # (label, href, icon, badge, order)
    ('EoDB',       '#eodb',       'FaBriefcase', '',     10),
    ('Grievances', '#grievances', 'FaComments',  '',     20),
    ('RTI',        '#rti',        'FaGavel',     'Info', 30),
    ('Contact',    '#contact',    'FaEnvelope',  '',     40),
]

_DEFAULT_OFFICIALS = [
    # (name, role, initials, order)
    ("Shri. K. LAKSHMINARAYANAN",          "Hon'ble Minister for Information Technology", "KL",  0),
    ("Shri Choudhary Mohammed Yasin, I.A.S.", "Secretary to Government (IT)",              "CMY", 1),
    ("Shri. Aman Sharma",                  "Director of Information Technology",          "AS",  2),
]

_DEFAULT_STATS = [
    # (value, label, order)
    ("24x7", "Digital access",      0),
    ("6",    "Core IT services",    1),
    ("1",    "Unified resource hub", 2),
]

_DEFAULT_QUICK_LINKS = [
    # (label, caption, icon, href, accent, surface, order)
    ("Services",      "Citizen-facing digital services",     "laptop",      "#services",      "#3B82F6", "rgba(59,130,246,0.12)", 0),
    ("Documents",     "Policies, templates and guidelines",  "fileInvoice", "#documents",     "#4F46E5", "rgba(79,70,229,0.12)",  1),
    ("Notifications", "Latest departmental announcements",   "bullhorn",    "#notifications", "#7C3AED", "rgba(124,58,237,0.12)", 2),
    ("Downloads",     "Forms, circulars and official assets","download",    "#downloads",     "#10B981", "rgba(16,185,129,0.12)", 3),
]

_DEFAULT_PARTNERS = [
    # (name, initials, description, url, tone, order)
    ("Digital India",               "DI", "Flagship digital transformation programme of the Government of India.",  "https://www.digitalindia.gov.in/",       "purple",  0),
    ("MeitY",                       "ME", "Ministry of Electronics and Information Technology.",                    "https://www.meity.gov.in/",              "blue",    1),
    ("National Informatics Centre", "NI", "Technology partner for digital government infrastructure.",             "https://www.nic.in/",                    "purple",  2),
    ("Government of Puducherry",    "PY", "Official government portal for the Union Territory.",                   "https://py.gov.in/",                     "blue",    3),
    ("eProcurement",                "EP", "Central Public Procurement and tendering platform.",                    "https://eprocure.gov.in/eprocure/app",   "emerald", 4),
    ("DigiLocker",                  "DL", "Digital document wallet for verified citizen records.",                 "https://www.digilocker.gov.in/",         "emerald", 5),
    ("UMANG",                       "UM", "Unified mobile access to government services.",                         "https://web.umang.gov.in/landing/",      "purple",  6),
    ("MyGov",                       "MG", "Citizen engagement platform for participatory governance.",             "https://www.mygov.in/",                  "emerald", 7),
]


def seed_menu_for_site(site, clear=False):
    """Seed default nav menu for `site`. Skips if already seeded (use clear=True to reset)."""
    qs = MenuItem.objects.filter(site=site)
    if clear:
        qs.delete()
    elif qs.exists():
        return

    created = {}
    for label, href, icon, badge, is_mega, order in _DEFAULT_MENU:
        item = MenuItem.objects.create(
            site=site, label=label, href=href,
            icon=icon, badge=badge, is_mega_menu=is_mega, order=order,
        )
        created[label] = item

    more = created.get('More')
    if more:
        for label, href, icon, badge, order in _MORE_CHILDREN:
            MenuItem.objects.create(
                site=site, label=label, href=href,
                icon=icon, badge=badge, parent=more, order=order,
            )


def seed_portal_for_site(site):
    """Seed officials, partners, settings, stats and quick links for `site`."""
    SiteSetting.objects.get_or_create(site=site)

    for name, role, initials, order in _DEFAULT_OFFICIALS:
        Official.objects.get_or_create(
            site=site, name=name,
            defaults={'role': role, 'initials': initials, 'order': order},
        )

    for value, label, order in _DEFAULT_STATS:
        PortalStat.objects.get_or_create(
            site=site, label=label,
            defaults={'value': value, 'order': order},
        )

    for label, caption, icon, href, accent, surface, order in _DEFAULT_QUICK_LINKS:
        QuickLink.objects.get_or_create(
            site=site, label=label,
            defaults={'caption': caption, 'icon': icon, 'href': href,
                      'accent': accent, 'surface': surface, 'order': order},
        )

    for name, initials, description, url, tone, order in _DEFAULT_PARTNERS:
        Partner.objects.get_or_create(
            site=site, name=name,
            defaults={'initials': initials, 'wordmark': name, 'description': description,
                      'url': url, 'tone': tone, 'order': order},
        )


def seed_site_defaults(site):
    """Seed ALL default content for a newly-created site."""
    seed_menu_for_site(site)
    seed_portal_for_site(site)
