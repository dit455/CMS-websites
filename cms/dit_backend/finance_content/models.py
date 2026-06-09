"""
Finance Template — specific content models.
Only visible in admin when the active site uses template-three.
"""
from django.db import models
from sites.mixins import site_field


class InfoSection(models.Model):
    """
    One info/resource card on the Finance portal (BEAMS Manual, Employees Corner, etc.).
    Each section has a heading and a list of bullet items managed via InfoItem.
    """
    ICON_CHOICES = [
        ('Bell',      'Bell / Notifications'),
        ('Briefcase', 'Briefcase / Resources'),
        ('BookOpen',  'Book / Documents'),
        ('Link2',     'Link / Useful Links'),
        ('FileText',  'File / Guidelines'),
        ('Shield',    'Shield / Compliance'),
    ]
    site      = site_field()
    title     = models.CharField(max_length=200, help_text="Section heading, e.g. 'BEAMS User Manual'")
    icon      = models.CharField(max_length=30, choices=ICON_CHOICES, default='Bell')
    color     = models.CharField(max_length=30, default='var(--primary)', help_text="CSS color for the icon/heading strip")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Info Section'
        verbose_name_plural = 'Info Sections (Finance)'

    def __str__(self):
        return self.title


class InfoItem(models.Model):
    """A single bullet item inside an InfoSection."""
    section   = models.ForeignKey(InfoSection, on_delete=models.CASCADE, related_name='items')
    text      = models.CharField(max_length=300)
    href      = models.CharField(max_length=300, blank=True, default='#', help_text="Optional link for this item")
    order     = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Info Item'
        verbose_name_plural = 'Info Items'

    def __str__(self):
        return self.text


class FooterLinkGroup(models.Model):
    """A column of links shown in the Finance portal footer."""
    site      = site_field()
    heading   = models.CharField(max_length=100, help_text="Column heading, e.g. 'Quick Links'")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Footer Link Group'
        verbose_name_plural = 'Footer Link Groups (Finance)'

    def __str__(self):
        return self.heading


class FooterLink(models.Model):
    """A single link inside a FooterLinkGroup."""
    group = models.ForeignKey(FooterLinkGroup, on_delete=models.CASCADE, related_name='links')
    label = models.CharField(max_length=200)
    href  = models.CharField(max_length=300, default='#')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Footer Link'

    def __str__(self):
        return self.label
