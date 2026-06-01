from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'category', 'description',
            'attachment', 'attachment_url', 'publish_date',
            'is_active', 'is_important', 'created_at'
        ]
        extra_kwargs = {'attachment': {'required': False}}

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
        return None
