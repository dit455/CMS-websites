from rest_framework import serializers
from .models import (
    QuickAccessButton, TransferRound,
    EduCounter, EduGrievanceStat, EduTrustPoint,
    EduFooterGroup, EduFooterLink,
)


class QuickAccessButtonSerializer(serializers.ModelSerializer):
    class Meta:
        model  = QuickAccessButton
        fields = ('id', 'label', 'href', 'icon', 'order')


class TransferRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TransferRound
        fields = ('id', 'name', 'start_date', 'end_date', 'description', 'status', 'order')


class EduCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EduCounter
        fields = ('id', 'label', 'value', 'order')


class EduGrievanceStatSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EduGrievanceStat
        fields = ('id', 'label', 'value', 'helper', 'order')


class EduTrustPointSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EduTrustPoint
        fields = ('id', 'text', 'order')


class EduFooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EduFooterLink
        fields = ('id', 'label', 'href', 'order')


class EduFooterGroupSerializer(serializers.ModelSerializer):
    links = EduFooterLinkSerializer(many=True, read_only=True)

    class Meta:
        model  = EduFooterGroup
        fields = ('id', 'heading', 'order', 'links')
