from rest_framework import viewsets, filters
from sites.mixins import SiteScopedQuerySetMixin
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'category']

    def get_queryset(self):
        queryset = self.filter_by_site(Notification.objects.filter(is_active=True))
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        important = self.request.query_params.get('important')
        if important == 'true':
            queryset = queryset.filter(is_important=True)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
