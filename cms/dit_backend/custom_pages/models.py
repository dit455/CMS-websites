"""
Custom Pages
============
Lets a CMS admin create a brand-new static page (tables, hyperlinks, text)
for a specific site WITHOUT writing any React code.

Workflow:
  1. Create a CmsPage here with a slug, e.g. 'transport-schedule'.
  2. Write the content using the rich-text/HTML field (supports tables, links, etc).
  3. In Menu Manager, set a menu item's href to '#page-transport-schedule'.
  4. The website automatically renders this page when that link is clicked —
     no extension code, no developer involvement.
"""

from django.db import models
from sites.mixins import site_field


class CmsPage(models.Model):
    site = site_field()
    slug = models.SlugField(
        max_length=100,
        help_text="URL-friendly id. Used in the menu href as '#page-<slug>', e.g. 'transport-schedule'.",
    )
    title = models.CharField(max_length=200, help_text="Page heading shown at the top.")
    content = models.TextField(
        blank=True,
        help_text=(
            "Page body. You can paste HTML — tables, links, lists, headings, etc. "
            "Example: <table><tr><th>Route</th></tr><tr><td>Route 1</td></tr></table>"
        ),
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        unique_together = ('site', 'slug')
        verbose_name = 'Custom Page'
        verbose_name_plural = 'Custom Pages'

    def __str__(self):
        return f'{self.title}  (#page-{self.slug})'
