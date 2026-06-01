from rest_framework import serializers
from .models import HeroBanner


class HeroBannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroBanner
        fields = [
            'id', 'kicker', 'title', 'description',
            'image', 'image_url',
            'primary_cta_label', 'primary_cta_href',
            'secondary_cta_label', 'secondary_cta_href',
            'variant', 'order', 'is_active',
        ]
        extra_kwargs = {'image': {'required': True}}

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
