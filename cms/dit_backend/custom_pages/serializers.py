from rest_framework import serializers
from .models import CmsPage


class CmsPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CmsPage
        fields = ['id', 'slug', 'title', 'content', 'order']
