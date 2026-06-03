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
from django.contrib.auth import get_user_model


class Site(models.Model):
    # Which front-end template/design this site is built with.
    # ── ADD NEW TEMPLATES HERE ──────────────────────────────────────────────
    # Step 1: add a tuple  ('your-key', 'Human Name')  to TEMPLATE_CHOICES
    # Step 2: add the same key to TEMPLATE_FOLDER pointing at the React folder
    # That's it — build-all.ps1 will pick it up automatically.
    # ────────────────────────────────────────────────────────────────────────
    TEMPLATE_CHOICES = [
        ('template-one',   'Template One — Blue'),
        ('template-two',   'Template Two — Green'),
        ('template-three', 'Template Three — Red'),
    ]

    # Maps template key → React folder name at the project root.
    # Keep this in sync with TEMPLATE_CHOICES.
    TEMPLATE_FOLDER = {
        'template-one':   'template-one',
        'template-two':   'template-two',
        'template-three': 'template-three',
    }

    key = models.SlugField(
        max_length=50, unique=True,
        help_text="Short unique id used by the frontend's VITE_SITE_KEY, e.g. 'dit', 'health', 'tourism'. Lowercase, no spaces."
    )
    name = models.CharField(
        max_length=200,
        help_text="Human-friendly name shown in admin, e.g. 'Directorate of IT' or 'Health Department'"
    )
    template = models.CharField(
        max_length=50, choices=TEMPLATE_CHOICES, default='template-one',
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

    @property
    def folder(self):
        """React folder name for this site's template (used by build-all.ps1)."""
        return self.TEMPLATE_FOLDER.get(self.template, self.template)

    @classmethod
    def get_default(cls):
        return cls.objects.filter(is_default=True).first() or cls.objects.first()


class SiteAdminProfile(models.Model):
    """
    Links a Django user to the site(s) they are allowed to manage.

    Superusers bypass this entirely and can manage everything.
    Non-superusers with a profile can only see/edit content for their assigned sites.
    Non-superusers WITHOUT a profile cannot see any content.
    """
    user = models.OneToOneField(
        get_user_model(), on_delete=models.CASCADE,
        related_name='site_admin_profile'
    )
    sites = models.ManyToManyField(
        Site, blank=True, related_name='admins',
        help_text="Sites this user can manage. Superusers ignore this — they always see everything."
    )

    class Meta:
        verbose_name = 'Site Admin'
        verbose_name_plural = 'Site Admins'

    def __str__(self):
        site_list = ', '.join(s.key for s in self.sites.all()) or '(no sites assigned)'
        return f'{self.user.username}  →  {site_list}'
