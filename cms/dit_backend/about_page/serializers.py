from rest_framework import serializers
from django.db import models
from .models import AboutPage, MissionPoint, KeyFunction, InitiativeFocusPoint


class MissionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionPoint
        fields = ['id', 'text', 'order']


class KeyFunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFunction
        fields = ['id', 'text', 'order']


class InitiativeFocusPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = InitiativeFocusPoint
        fields = ['id', 'text', 'order']


class AboutPageSerializer(serializers.ModelSerializer):
    mission_points    = serializers.SerializerMethodField()
    key_functions     = serializers.SerializerMethodField()
    initiative_points = serializers.SerializerMethodField()

    class Meta:
        model = AboutPage
        fields = '__all__'

    def get_mission_points(self, obj):
        qs = MissionPoint.objects.filter(is_active=True).filter(
            models.Q(site=obj.site) | models.Q(site__isnull=True))
        return MissionPointSerializer(qs.order_by('order'), many=True).data

    def get_key_functions(self, obj):
        qs = KeyFunction.objects.filter(is_active=True).filter(
            models.Q(site=obj.site) | models.Q(site__isnull=True))
        return KeyFunctionSerializer(qs.order_by('order'), many=True).data

    def get_initiative_points(self, obj):
        qs = InitiativeFocusPoint.objects.filter(is_active=True).filter(
            models.Q(site=obj.site) | models.Q(site__isnull=True))
        return InitiativeFocusPointSerializer(qs.order_by('order'), many=True).data
