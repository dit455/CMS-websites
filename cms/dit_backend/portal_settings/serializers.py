from rest_framework import serializers
from .models import (Official, Partner, SiteSetting, PortalStat, QuickLink,
                     ResourceGroup, ResourcePoint, FooterLink)


class OfficialSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Official
        fields = ['id', 'name', 'role', 'photo', 'photo_url', 'initials', 'email', 'order']

    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
        return None


class PartnerSerializer(serializers.ModelSerializer):
    logo_image = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'name', 'wordmark', 'initials', 'logo_image',
                  'logo_alt', 'description', 'url', 'tone', 'order']

    def get_logo_image(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
        return obj.logo_url or None


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'


class PortalStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalStat
        fields = ['id', 'value', 'label', 'order']


class QuickLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickLink
        fields = ['id', 'label', 'caption', 'icon', 'href', 'accent', 'surface', 'order']


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = ['id', 'label', 'href', 'icon', 'order']


class ResourceGroupSerializer(serializers.ModelSerializer):
    points = serializers.SerializerMethodField()

    class Meta:
        model = ResourceGroup
        fields = ['id', 'slug', 'eyebrow', 'title', 'description', 'icon',
                  'accent', 'surface', 'href', 'cta', 'order', 'points']

    def get_points(self, obj):
        return [p.text for p in obj.points.all().order_by('order')]
