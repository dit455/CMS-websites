from rest_framework import viewsets
from sites.mixins import SiteScopedQuerySetMixin
from .models import InfoSection, FooterLinkGroup
from .serializers import InfoSectionSerializer, FooterLinkGroupSerializer


class InfoSectionViewSet(SiteScopedQuerySetMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = InfoSectionSerializer

    def get_queryset(self):
        return self.filter_by_site(InfoSection.objects.filter(is_active=True).prefetch_related('items'))


class FooterLinkGroupViewSet(SiteScopedQuerySetMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = FooterLinkGroupSerializer

    def get_queryset(self):
        return self.filter_by_site(FooterLinkGroup.objects.filter(is_active=True).prefetch_related('links'))
