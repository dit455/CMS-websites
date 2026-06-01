from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Site
from .serializers import SiteSerializer


class SiteViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/sites/  → list configured websites (handy for tooling)."""
    queryset = Site.objects.filter(is_active=True)
    serializer_class = SiteSerializer
    lookup_field = 'key'


@api_view(['GET'])
def site_config(request):
    """
    GET /api/site-config/?site=<key>
    Returns metadata about the requested site (name + which template it uses),
    so a frontend can confirm it's talking to the right site.
    """
    site_key = request.query_params.get('site')
    site = (Site.objects.filter(key=site_key, is_active=True).first()
            if site_key else Site.get_default())
    if site is None:
        return Response({'detail': 'No site configured'}, status=404)
    return Response(SiteSerializer(site).data)
