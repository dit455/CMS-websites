"""
Reusable helpers so every content app becomes site-aware with minimal code.

1. SiteScopedQuerySetMixin — drop into any DRF ViewSet. It filters the queryset
   by the ?site=<key> query param (falling back to the default site), so each
   website only ever receives its own content.

2. site_field() — a helper that returns a ForeignKey to Site with sensible
   defaults, used inside each content model.
"""

from django.db import models


def site_field():
    """A standard FK to Site for content models. Imported lazily to avoid
    circular imports during app loading."""
    return models.ForeignKey(
        'sites.Site',
        on_delete=models.CASCADE,
        related_name='%(class)s_items',
        null=True, blank=True,
        help_text="Which website this item belongs to. Leave blank to use the default site.",
    )


class SiteScopedQuerySetMixin:
    """
    Mix into a DRF ViewSet. Requires the model to have a `site` FK.

    Filtering rules:
      - ?site=<key>  → only items for that site (plus items with no site set,
                        which are treated as shared/global).
      - no param      → items for the default site (plus shared items).
    """

    def get_site_key(self):
        return self.request.query_params.get('site')

    def filter_by_site(self, queryset):
        from sites.models import Site

        site_key = self.get_site_key()
        if site_key:
            site = Site.objects.filter(key=site_key, is_active=True).first()
        else:
            site = Site.get_default()

        if site is None:
            # No sites configured yet → return everything (legacy behaviour).
            return queryset

        # Items explicitly for this site, OR shared items (site is null).
        return queryset.filter(models.Q(site=site) | models.Q(site__isnull=True))
