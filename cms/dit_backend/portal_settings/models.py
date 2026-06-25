"""
Portal Settings Models
======================
Holds the remaining "global" content that the React frontend needs but
that previously lived only in the front-end defaultContent.js / portalConfig.js:

1. Official        — Leadership & Officials cards (Minister, Secretary, Director...)
2. Partner         — "Connected Government Platforms" marquee logos
3. SiteSetting     — Footer text, contact info, web information manager (singleton)
4. PortalStat      — The 3 stat tiles under the hero ("24x7", "6", "1")
5. QuickLink       — The quick-link cards under the hero
"""

from django.db import models
from sites.mixins import site_field


# ─────────────────────────────────────────────────────────────────────────────
# 1. Leadership & Officials
# ─────────────────────────────────────────────────────────────────────────────
class Official(models.Model):
    site = site_field()
    name   = models.CharField(max_length=200, help_text="e.g. 'Shri. K. Lakshminarayanan'")
    role   = models.CharField(max_length=250, help_text="e.g. \"Hon'ble Minister for Information Technology\"")
    photo  = models.ImageField(
        upload_to='officials/',
        blank=True, null=True,
        help_text="Square portrait photo (recommended 300×300px). Leave blank to show initials."
    )
    initials = models.CharField(
        max_length=5, blank=True,
        help_text="Shown if no photo is uploaded, e.g. 'KL'"
    )
    email  = models.EmailField(blank=True, help_text="Optional contact email for this office")
    order  = models.PositiveIntegerField(default=0, help_text="0 = shown first")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Leadership / Official'
        verbose_name_plural = 'Leadership & Officials'

    def __str__(self):
        return f'[{self.order}] {self.name}'


# ─────────────────────────────────────────────────────────────────────────────
# 2. Connected Government Platforms (partner marquee)
# ─────────────────────────────────────────────────────────────────────────────
class Partner(models.Model):
    site = site_field()
    TONE_CHOICES = [
        ('blue',    'Blue'),
        ('purple',  'Purple'),
        ('emerald', 'Emerald / Green'),
    ]

    name        = models.CharField(max_length=200, help_text="Full name, e.g. 'Digital India'")
    wordmark    = models.CharField(max_length=100, blank=True, help_text="Short label shown under logo, e.g. 'Digital India'")
    initials    = models.CharField(max_length=5, blank=True, help_text="Fallback text if logo image fails, e.g. 'DI'")
    logo        = models.ImageField(upload_to='partners/', blank=True, null=True, help_text="Upload a logo image (preferred)")
    logo_url    = models.URLField(blank=True, help_text="OR paste an external logo image URL instead of uploading")
    logo_alt    = models.CharField(max_length=200, blank=True, help_text="Accessibility alt text for the logo")
    description = models.CharField(max_length=300, blank=True)
    url         = models.CharField(max_length=300, default='#', help_text="Where the card links to (full https:// URL)")
    tone        = models.CharField(max_length=20, choices=TONE_CHOICES, default='blue')
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Connected Platform'
        verbose_name_plural = 'Connected Platforms'

    def __str__(self):
        return self.name


# ─────────────────────────────────────────────────────────────────────────────
# 3. Site Settings (singleton) — footer / contact info
# ─────────────────────────────────────────────────────────────────────────────
class SiteSetting(models.Model):
    site = models.OneToOneField('sites.Site', on_delete=models.CASCADE,
                                related_name='sitesetting', null=True, blank=True,
                                help_text="The website these settings belong to.")
    department_name   = models.CharField(max_length=200, default='Directorate of Information Technology')
    government_name   = models.CharField(max_length=200, default='Government of Puducherry')
    helpdesk_email    = models.EmailField(default='directorit@py.gov.in')
    phone             = models.CharField(max_length=50, default='+91-413-2246090')
    address           = models.TextField(default='II Floor, Planning & Research Department Complex, 505, Kamaraj Salai, Sakthi Nagar, Saram, Puducherry, 605013')
    overview_description = models.TextField(
        blank=True, default='',
        help_text='Paragraph shown in the Department Overview section on the homepage.',
    )
    footer_description = models.TextField(default='Leading the digital transformation journey of the Union Territory of Puducherry.')

    web_information_manager             = models.CharField(max_length=200, default='Shri. Aman Sharma')
    web_information_manager_designation = models.CharField(max_length=200, default='Director of Information Technology')
    web_information_manager_email       = models.EmailField(default='directorit@py.gov.in')

    facebook_url  = models.URLField(blank=True)
    twitter_url   = models.URLField(blank=True)
    youtube_url   = models.URLField(blank=True)
    linkedin_url  = models.URLField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Global Site Settings'


# ─────────────────────────────────────────────────────────────────────────────
# 4. Portal Stats (hero stat tiles)
# ─────────────────────────────────────────────────────────────────────────────
class PortalStat(models.Model):
    site = site_field()
    value = models.CharField(max_length=30, help_text="e.g. '24x7', '6', '1'")
    label = models.CharField(max_length=100, help_text="e.g. 'Digital access'")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Hero Stat'
        verbose_name_plural = 'Hero Stats'

    def __str__(self):
        return f'{self.value} — {self.label}'


# ─────────────────────────────────────────────────────────────────────────────
# 5. Quick Links (cards under hero)
# ─────────────────────────────────────────────────────────────────────────────
class QuickLink(models.Model):
    site = site_field()
    ICON_CHOICES = [
        ('laptop',      'Laptop'),
        ('fileInvoice', 'File / Invoice'),
        ('bullhorn',    'Bullhorn / Announce'),
        ('download',    'Download'),
    ]
    label   = models.CharField(max_length=100)
    caption = models.CharField(max_length=200, blank=True)
    icon    = models.CharField(max_length=30, choices=ICON_CHOICES, default='laptop')
    href    = models.CharField(max_length=200, default='#')
    accent  = models.CharField(max_length=20, default='#3B82F6')
    surface = models.CharField(max_length=50, default='rgba(59,130,246,0.12)')
    order   = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Quick Link'
        verbose_name_plural = 'Quick Links'

    def __str__(self):
        return self.label


# ─────────────────────────────────────────────────────────────────────────────
# 6. Citizen Resource Cards — Notifications / Tenders / RTI / EoDB / Downloads
#    (the "Important citizen resource areas" grid in CitizenResources.jsx)
# ─────────────────────────────────────────────────────────────────────────────
class ResourceGroup(models.Model):
    site = site_field()
    ICON_CHOICES = [
        ('bell',      'Bell / Notifications'),
        ('download',  'Download'),
        ('briefcase', 'Briefcase / EoDB'),
        ('gavel',     'Gavel / RTI'),
        ('tender',    'Tender / Contract'),
    ]

    slug        = models.SlugField(
        max_length=50, unique=True,
        help_text="Anchor id used by the card, e.g. 'notifications', 'tenders', 'rti', 'eodb', 'downloads'"
    )
    eyebrow     = models.CharField(max_length=60, help_text="Small label above title, e.g. 'Updates'")
    title       = models.CharField(max_length=150, help_text="e.g. 'Notifications & Alerts'")
    description = models.TextField()
    icon        = models.CharField(max_length=20, choices=ICON_CHOICES, default='bell')
    accent      = models.CharField(max_length=20, default='#7C3AED')
    surface     = models.CharField(max_length=50, default='rgba(124,58,237,0.12)')
    href        = models.CharField(max_length=200, default='#documents', help_text="Where the card's button links to")
    cta         = models.CharField(max_length=80, default='Open', help_text="Button text, e.g. 'Open updates'")
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Citizen Resource Card'
        verbose_name_plural = 'Citizen Resource Cards (Notifications/Tenders/RTI/EoDB)'

    def __str__(self):
        return f'[{self.order}] {self.title}'


# ─────────────────────────────────────────────────────────────────────────────
# 7. Footer "Citizen Services" links (Footer.jsx citizen services column)
# ─────────────────────────────────────────────────────────────────────────────
class FooterLink(models.Model):
    site = site_field()
    ICON_CHOICES = [
        ('gavel',      'Gavel / Grievance'),
        ('clipboard',  'Clipboard / Track'),
        ('bell',       'Bell / Notifications'),
        ('download',   'Download / Circulars'),
        ('briefcase',  'Briefcase / Tenders'),
        ('users',      'Users / Helpdesk'),
        ('link',       'Generic Link'),
    ]
    label   = models.CharField(max_length=100, help_text="e.g. 'Public Grievance Redressal'")
    href    = models.CharField(max_length=300, default='#')
    icon    = models.CharField(max_length=30, choices=ICON_CHOICES, default='link')
    order   = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Footer Citizen Service Link'
        verbose_name_plural = 'Footer — Citizen Service Links'

    def __str__(self):
        return self.label


class ResourcePoint(models.Model):
    """The 2-3 bullet items shown inside each resource card."""
    group = models.ForeignKey(ResourceGroup, on_delete=models.CASCADE, related_name='points')
    text  = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Resource Card Point'
        verbose_name_plural = 'Resource Card Points'

    def __str__(self):
        return self.text
