"""News API Views (site-scoped)."""

from rest_framework import viewsets, filters
from sites.mixins import SiteScopedQuerySetMixin
from .models import NewsTickerItem, NewsArticle
from .serializers import NewsTickerItemSerializer, NewsArticleSerializer


class NewsTickerItemViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = NewsTickerItemSerializer

    def get_queryset(self):
        return self.filter_by_site(NewsTickerItem.objects.filter(is_active=True))


class NewsArticleViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = NewsArticleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'summary', 'category']
    lookup_field = 'slug'

    def get_queryset(self):
        return self.filter_by_site(NewsArticle.objects.filter(is_published=True))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
