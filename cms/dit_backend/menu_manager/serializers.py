"""
Menu Serializers
================
Converts MenuItem objects → JSON for the React frontend.

The API returns a NESTED structure:
[
  {
    "id": 1,
    "label": "Home",
    "href": "#",
    "icon": "FaHome",
    "badge": "",
    "description": "",
    "is_mega_menu": false,
    "open_in_new_tab": false,
    "order": 0,
    "children": []          ← empty for simple links
  },
  {
    "id": 3,
    "label": "Services",
    "href": "#services",
    "icon": "FaCogs",
    "is_mega_menu": true,
    "children": [           ← populated for dropdowns
      { "id": 10, "label": "PSWAN", "href": "#services-detail", ... },
      ...
    ]
  }
]

React reads this array directly and builds the navbar.
"""

from rest_framework import serializers
from .models import MenuItem


class MenuChildSerializer(serializers.ModelSerializer):
    """Serializes one child item inside a dropdown"""
    class Meta:
        model = MenuItem
        fields = [
            'id', 'label', 'href', 'icon',
            'badge', 'description',
            'open_in_new_tab', 'order'
        ]


class MenuItemSerializer(serializers.ModelSerializer):
    """Serializes a top-level menu item, embedding its children"""
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = [
            'id', 'label', 'href', 'icon',
            'badge', 'description',
            'is_mega_menu', 'open_in_new_tab',
            'order', 'children'
        ]

    def get_children(self, obj):
        """Return active children sorted by order"""
        active_children = obj.children.filter(is_active=True).order_by('order')
        return MenuChildSerializer(active_children, many=True).data
