from rest_framework import serializers
from .models import InfoSection, InfoItem, FooterLinkGroup, FooterLink


class InfoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = InfoItem
        fields = ('id', 'text', 'href', 'order')


class InfoSectionSerializer(serializers.ModelSerializer):
    items = InfoItemSerializer(many=True, read_only=True)

    class Meta:
        model  = InfoSection
        fields = ('id', 'title', 'icon', 'color', 'order', 'items')


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FooterLink
        fields = ('id', 'label', 'href', 'order')


class FooterLinkGroupSerializer(serializers.ModelSerializer):
    links = FooterLinkSerializer(many=True, read_only=True)

    class Meta:
        model  = FooterLinkGroup
        fields = ('id', 'heading', 'order', 'links')
