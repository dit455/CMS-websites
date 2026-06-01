from rest_framework import viewsets, filters
from sites.mixins import SiteScopedQuerySetMixin
from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = self.filter_by_site(Document.objects.filter(is_active=True))
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
