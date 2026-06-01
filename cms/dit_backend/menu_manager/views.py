"""
Menu API Views
==============
GET  /api/menu/        → Returns all active TOP-LEVEL items with their children nested inside.
POST /api/menu/        → Create a new menu item (admin use).
GET  /api/menu/{id}/   → Get single menu item.
PUT  /api/menu/{id}/   → Update a menu item.
DELETE /api/menu/{id}/ → Delete a menu item.
"""

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from sites.mixins import SiteScopedQuerySetMixin
from .models import MenuItem
from .serializers import MenuItemSerializer


class MenuItemViewSet(SiteScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        """
        The main list endpoint returns only TOP-LEVEL items for the requested
        site. Children are nested inside each item by the serializer.
        """
        qs = MenuItem.objects.filter(
            is_active=True,
            parent__isnull=True   # Only top-level items
        ).prefetch_related('children').order_by('order')
        return self.filter_by_site(qs)

    @action(detail=False, methods=['get'], url_path='flat')
    def flat_list(self, request):
        """GET /api/menu/flat/ — ALL items (top-level + children) as a flat list."""
        all_items = self.filter_by_site(MenuItem.objects.all()).order_by('order')
        serializer = self.get_serializer(all_items, many=True)
        return Response(serializer.data)
