from rest_framework import serializers
from .models import Service, ServiceLink


class ServiceLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceLink
        fields = ['id', 'label', 'href', 'order']


class ServiceSerializer(serializers.ModelSerializer):
    links = ServiceLinkSerializer(many=True, read_only=True)
    # Map DB fields to exact names the React component uses (accent, surface)
    accent  = serializers.CharField(source='accent_color')
    surface = serializers.CharField(source='surface_color')

    class Meta:
        model = Service
        fields = ['id', 'icon', 'title', 'desc', 'accent', 'surface', 'order', 'is_active', 'links']
