from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from sites.models import Site
from sites.mixins import SiteScopedQuerySetMixin
from .models import AboutPage, MissionPoint, KeyFunction, InitiativeFocusPoint
from .serializers import (AboutPageSerializer, MissionPointSerializer,
                           KeyFunctionSerializer, InitiativeFocusPointSerializer)


def _resolve_site(request):
    site_key = request.query_params.get('site')
    if site_key:
        return Site.objects.filter(key=site_key, is_active=True).first()
    return Site.get_default()


class AboutPageView(APIView):
    """
    GET /api/about/?site=<key>
    Returns the about page content for the requested site.
    Creates a default record per-site if none exists.
    """
    def get(self, request):
        site = _resolve_site(request)
        page, _ = AboutPage.objects.get_or_create(site=site)
        serializer = AboutPageSerializer(page, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        site = _resolve_site(request)
        page, _ = AboutPage.objects.get_or_create(site=site)
        serializer = AboutPageSerializer(page, data=request.data, partial=True,
                                         context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MissionPointViewSet(viewsets.ModelViewSet):
    queryset = MissionPoint.objects.filter(is_active=True)
    serializer_class = MissionPointSerializer


class KeyFunctionViewSet(viewsets.ModelViewSet):
    queryset = KeyFunction.objects.filter(is_active=True)
    serializer_class = KeyFunctionSerializer


class InitiativeFocusViewSet(viewsets.ModelViewSet):
    queryset = InitiativeFocusPoint.objects.filter(is_active=True)
    serializer_class = InitiativeFocusPointSerializer
