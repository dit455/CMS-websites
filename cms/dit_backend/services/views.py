from rest_framework import viewsets
from sites.mixins import SiteScopedQuerySetMixin
from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = ServiceSerializer

    def get_queryset(self):
        return self.filter_by_site(
            Service.objects.filter(is_active=True).prefetch_related('links')
        )
