from django.db import models
from sites.mixins import site_field


class HeroBanner(models.Model):
    site = site_field()
    VARIANT_CHOICES = [
        ('danger',  'Red (Danger)'),
        ('primary', 'Blue (Primary)'),
        ('success', 'Green (Success)'),
        ('dark',    'Dark'),
    ]

    kicker      = models.CharField(max_length=100, help_text="Small label above title, e.g. 'DIRECTORATE OF IT'")
    title       = models.CharField(max_length=300)
    description = models.TextField()
    image       = models.ImageField(upload_to='hero_banners/', help_text='Large banner image (recommended: 1920×600 px)')

    primary_cta_label   = models.CharField(max_length=100, blank=True, verbose_name='Primary Button Text', help_text='e.g. "Explore Services"')
    primary_cta_href    = models.CharField(max_length=200, blank=True, default='#services')
    secondary_cta_label = models.CharField(max_length=100, blank=True, verbose_name='Secondary Button Text', help_text='e.g. "Learn More" — leave blank to hide')
    secondary_cta_href  = models.CharField(max_length=200, blank=True)

    variant    = models.CharField(max_length=20, choices=VARIANT_CHOICES, default='danger')
    order      = models.PositiveIntegerField(default=0, help_text='Display order (0 = first slide)')
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Hero Banner Slide'
        verbose_name_plural = 'Hero Banner Slides'

    def __str__(self):
        return f'[{self.order}] {self.title}'
