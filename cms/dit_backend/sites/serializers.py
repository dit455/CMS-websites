from rest_framework import serializers
from .models import Site


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'key', 'name', 'template', 'domain', 'is_active', 'is_default']
