from django.db import models
from sites.mixins import site_field


ICON_CHOICES = [
    ('network',  'Network (PSWAN)'),
    ('server',   'Server (SDC)'),
    ('users',    'Users (CSC)'),
    ('portal',   'Portal'),
    ('shield',   'Shield (Cybersecurity)'),
    ('training', 'Training'),
    ('laptop',   'Laptop'),
    ('cloud',    'Cloud'),
    ('database', 'Database'),
    ('mobile',   'Mobile'),
    ('wifi',     'WiFi'),
    ('lock',     'Lock / Security'),
]


class Service(models.Model):
    site = site_field()
    icon          = models.CharField(max_length=50, choices=ICON_CHOICES, default='laptop')
    title         = models.CharField(max_length=200)
    desc          = models.TextField(verbose_name='Description', default='')
    accent_color  = models.CharField(max_length=20,  default='#3B82F6', help_text='Hex colour e.g. #3B82F6')
    surface_color = models.CharField(max_length=50, default='rgba(59,130,246,0.12)', help_text='RGBA colour for background')
    order         = models.PositiveIntegerField(default=0, help_text='Display order (0 = first card)')
    is_active     = models.BooleanField(default=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def __str__(self):
        return self.title


class ServiceLink(models.Model):
    """Button links on each service card (e.g. 'Learn More', 'Apply')"""
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='links')
    label   = models.CharField(max_length=100, help_text='Button text, e.g. "Learn More"')
    href    = models.CharField(max_length=200, default='#services-detail', help_text='Link target, e.g. "#contact"')
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Service Link'
        verbose_name_plural = 'Service Links'

    def __str__(self):
        return f'{self.service.title} → {self.label}'
