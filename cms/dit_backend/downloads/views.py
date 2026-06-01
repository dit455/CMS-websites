from rest_framework import viewsets, filters
from sites.mixins import SiteScopedQuerySetMixin
from .models import Download
from .serializers import DownloadSerializer


class DownloadViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = DownloadSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        qs = self.filter_by_site(Download.objects.filter(is_active=True))
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
