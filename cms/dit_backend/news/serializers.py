"""
News Serializers

Serializers convert Django model objects into JSON format
so the React frontend can receive and use the data.
"""

from rest_framework import serializers
from .models import NewsTickerItem, NewsArticle


class NewsTickerItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsTickerItem
        fields = ['id', 'text', 'is_active', 'order', 'created_at']


class NewsArticleSerializer(serializers.ModelSerializer):
    # Returns the full URL of the image (e.g. http://localhost:8000/media/news/images/photo.jpg)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'slug', 'category', 'summary',
            'body', 'image', 'image_url', 'publish_date',
            'is_published', 'created_at'
        ]
        # 'image' field accepts uploads; 'image_url' is read-only for display
        extra_kwargs = {'image': {'write_only': False, 'required': False}}

    def get_image_url(self, obj):
        """Return absolute URL for the image so React can display it"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
