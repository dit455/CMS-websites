from rest_framework import viewsets
from sites.mixins import SiteScopedQuerySetMixin
from .models import HeroBanner
from .serializers import HeroBannerSerializer


class HeroBannerViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = HeroBannerSerializer

    def get_queryset(self):
        return self.filter_by_site(HeroBanner.objects.filter(is_active=True))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
