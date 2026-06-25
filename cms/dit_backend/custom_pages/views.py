from rest_framework import viewsets
from sites.mixins import SiteScopedQuerySetMixin
from .models import CmsPage
from .serializers import CmsPageSerializer


class CmsPageViewSet(SiteScopedQuerySetMixin, viewsets.ReadOnlyModelViewSet):
    """
    GET /api/pages/?site=<key>        → list active pages for a site
    GET /api/pages/<slug>/?site=<key> → one page by slug
    """
    serializer_class = CmsPageSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return self.filter_by_site(CmsPage.objects.filter(is_active=True))
