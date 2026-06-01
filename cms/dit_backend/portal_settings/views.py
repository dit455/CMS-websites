from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sites.mixins import SiteScopedQuerySetMixin
from sites.models import Site
from .models import Official, Partner, SiteSetting, PortalStat, QuickLink, ResourceGroup
from .serializers import (OfficialSerializer, PartnerSerializer,
                          SiteSettingSerializer, PortalStatSerializer,
                          QuickLinkSerializer, ResourceGroupSerializer)


class _RequestContextMixin:
    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class OfficialViewSet(SiteScopedQuerySetMixin, _RequestContextMixin, viewsets.ModelViewSet):
    serializer_class = OfficialSerializer

    def get_queryset(self):
        return self.filter_by_site(Official.objects.filter(is_active=True))


class PartnerViewSet(SiteScopedQuerySetMixin, _RequestContextMixin, viewsets.ModelViewSet):
    serializer_class = PartnerSerializer

    def get_queryset(self):
        return self.filter_by_site(Partner.objects.filter(is_active=True))


class PortalStatViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = PortalStatSerializer

    def get_queryset(self):
        return self.filter_by_site(PortalStat.objects.filter(is_active=True))


class QuickLinkViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = QuickLinkSerializer

    def get_queryset(self):
        return self.filter_by_site(QuickLink.objects.filter(is_active=True))


class ResourceGroupViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = ResourceGroupSerializer

    def get_queryset(self):
        return self.filter_by_site(
            ResourceGroup.objects.filter(is_active=True).prefetch_related('points')
        )


def _resolve_site(request):
    site_key = request.query_params.get('site')
    if site_key:
        return Site.objects.filter(key=site_key, is_active=True).first()
    return Site.get_default()


class SiteSettingView(APIView):
    """
    GET/PATCH the site-settings record for the requested site.
    Each site has its own footer/contact settings.
    """
    def get(self, request):
        site = _resolve_site(request)
        obj, _ = SiteSetting.objects.get_or_create(site=site)
        return Response(SiteSettingSerializer(obj).data)

    def patch(self, request):
        site = _resolve_site(request)
        obj, _ = SiteSetting.objects.get_or_create(site=site)
        ser = SiteSettingSerializer(obj, data=request.data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
