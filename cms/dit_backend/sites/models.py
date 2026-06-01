"""
Site model — the heart of the multi-site CMS.

One Django backend + one admin can power MANY public websites. Each website is
represented by a Site row. Every piece of content (hero banners, menu items,
services, documents, officials...) is linked to a Site, so the API can return
only the content that belongs to the requested site.

A Site also records WHICH React template/theme the developer chose for it, so
the same backend can serve sites built on different front-end templates.
"""

from django.db import models


class Site(models.Model):
    # Which front-end template/design this site is built with.
    # Add new options here as you create new React templates.
    TEMPLATE_CHOICES = [
        ('dit-portal',   'DIT Portal (default government template)'),
        ('template-two', 'Template Two'),
        ('template-three', 'Template Three'),
    ]

    key = models.SlugField(
        max_length=50, unique=True,
        help_text="Short unique id used by the frontend's VITE_SITE_KEY, e.g. 'dit', 'health', 'tourism'. Lowercase, no spaces."
    )
    name = models.CharField(
        max_length=200,
        help_text="Human-friendly name shown in admin, e.g. 'Directorate of IT' or 'Health Department'"
    )
    template = models.CharField(
        max_length=50, choices=TEMPLATE_CHOICES, default='dit-portal',
        help_text="Which React template/theme this website uses. You choose this as the developer."
    )
    domain = models.CharField(
        max_length=200, blank=True,
        help_text="Optional: the live domain for this site, e.g. 'health.py.gov.in' (informational)"
    )
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(
        default=False,
        help_text="If a request doesn't specify a site, this site is used. Keep exactly one default."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Website (Site)'
        verbose_name_plural = 'Websites (Sites)'

    def __str__(self):
        return f'{self.name}  [{self.key}]'

    def save(self, *args, **kwargs):
        # Guarantee only one default site.
        if self.is_default:
            Site.objects.exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    @classmethod
    def get_default(cls):
        return cls.objects.filter(is_default=True).first() or cls.objects.first()
