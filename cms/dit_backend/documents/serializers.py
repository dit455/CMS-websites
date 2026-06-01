from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'category', 'description',
            'file', 'file_url', 'external_url', 'file_type',
            'file_size_display', 'publish_date', 'is_active',
            'order', 'created_at'
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return obj.external_url or None

    def get_file_type(self, obj):
        return obj.file_type()
