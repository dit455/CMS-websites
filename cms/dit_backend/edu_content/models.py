"""
EDU Template (template-two) — specific content models.
Only visible in admin when the active site uses template-two.

Covers every hardcoded section in PublicHomePage.tsx that doesn't map
to a shared content type:
  - QuickAccessButton  → quickServices bar
  - TransferRound      → transfer counselling schedule
  - EduCounter         → teacherCounters (Pending Applications, etc.)
  - EduGrievanceStat   → grievanceStats (Resolution Rate, etc.)
  - EduTrustPoint      → grievanceTrust badge list
  - EduFooterGroup +   → footerLinkGroups in the dark footer
    EduFooterLink
"""
from django.db import models
from sites.mixins import site_field


# ── Quick access buttons ───────────────────────────────────────────────────────
class QuickAccessButton(models.Model):
    ICON_CHOICES = [
        ('UserRoundCheck', 'Teacher / User'),
        ('Shuffle',        'Transfer / Shuffle'),
        ('TicketCheck',    'Vacancy / Ticket'),
        ('Bell',           'Notifications'),
        ('Download',       'Downloads'),
        ('Headphones',     'Helpdesk'),
        ('FileText',       'Documents'),
        ('Home',           'Home'),
    ]
    site      = site_field()
    label     = models.CharField(max_length=100)
    href      = models.CharField(max_length=300, default='#', help_text="Internal path, e.g. '/login?role=teacher' or '/#vacancy-list'")
    icon      = models.CharField(max_length=30, choices=ICON_CHOICES, default='FileText')
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Quick Access Button'
        verbose_name_plural = 'Quick Access Buttons'

    def __str__(self):
        return self.label


# ── Transfer rounds ────────────────────────────────────────────────────────────
class TransferRound(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('active',   'Active / Open'),
        ('closed',   'Closed'),
    ]
    site        = site_field()
    name        = models.CharField(max_length=200)
    start_date  = models.DateField()
    end_date    = models.DateField()
    description = models.TextField(blank=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'start_date']
        verbose_name = 'Transfer Round'
        verbose_name_plural = 'Transfer Rounds'

    def __str__(self):
        return f'{self.name} [{self.get_status_display()}]'


# ── Teacher section counters (Pending Applications: 14, Open Tickets: 08…) ────
class EduCounter(models.Model):
    site      = site_field()
    label     = models.CharField(max_length=100, help_text="e.g. 'Pending Applications'")
    value     = models.CharField(max_length=30,  help_text="e.g. '14', 'Live', '95%'")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Teacher Counter'
        verbose_name_plural = 'Teacher Counters'

    def __str__(self):
        return f'{self.label}: {self.value}'


# ── Grievance stats (Resolution Rate: 95%, Average Resolution: 7 days…) ───────
class EduGrievanceStat(models.Model):
    site      = site_field()
    label     = models.CharField(max_length=100, help_text="e.g. 'Resolution Rate'")
    value     = models.CharField(max_length=30,  help_text="e.g. '95%'")
    helper    = models.CharField(max_length=200, blank=True, help_text="Small caption below the value")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Grievance Stat'
        verbose_name_plural = 'Grievance Stats'

    def __str__(self):
        return f'{self.label}: {self.value}'


# ── Grievance trust points (badge list under the grievance section) ─────────
class EduTrustPoint(models.Model):
    site      = site_field()
    text      = models.CharField(max_length=200, help_text="e.g. 'Acknowledgement number issued instantly'")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Grievance Trust Point'
        verbose_name_plural = 'Grievance Trust Points'

    def __str__(self):
        return self.text


# ── Footer link groups ─────────────────────────────────────────────────────────
class EduFooterGroup(models.Model):
    site      = site_field()
    heading   = models.CharField(max_length=100, help_text="Column heading, e.g. 'Teacher Services'")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Footer Link Group'
        verbose_name_plural = 'Footer Link Groups'

    def __str__(self):
        return self.heading


class EduFooterLink(models.Model):
    group     = models.ForeignKey(EduFooterGroup, on_delete=models.CASCADE, related_name='links')
    label     = models.CharField(max_length=200)
    href      = models.CharField(max_length=300, default='/', help_text="React Router path or anchor, e.g. '/#vacancy-list'")
    order     = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Footer Link'

    def __str__(self):
        return self.label
