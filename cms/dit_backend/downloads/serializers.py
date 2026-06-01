from rest_framework import serializers
from .models import Download


class DownloadSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = Download
        fields = [
            'id', 'title', 'category', 'description',
            'file', 'file_url', 'file_type', 'file_size_display',
            'is_active', 'order', 'created_at'
        ]
        extra_kwargs = {'file': {'required': True}}

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

    def get_file_type(self, obj):
        return obj.file_type()
