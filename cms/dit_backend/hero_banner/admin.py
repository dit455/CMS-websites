from django.contrib import admin
from django.utils.html import format_html
from sites.admin_mixins import SiteScopedAdminMixin
from .models import HeroBanner


@admin.register(HeroBanner)
class HeroBannerAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display       = ['site', 'order', 'slide_preview', 'title', 'variant', 'is_active']
    list_filter        = ['site']
    list_display_links = ['title']
    list_editable      = ['order', 'is_active']
    search_fields      = ['title', 'kicker']
    ordering           = ['order']

    fieldsets = (
        ('Site', {
            'fields': ('site',),
        }),
        ('Slide Content', {
            'fields': ('kicker', 'title', 'description', 'image'),
            'description': 'Kicker = small label above title. Image: 1920×600 px recommended.'
        }),
        ('Call-to-Action Buttons', {
            'fields': ('primary_cta_label', 'primary_cta_href', 'secondary_cta_label', 'secondary_cta_href'),
            'description': 'Leave secondary CTA blank to show only one button.'
        }),
        ('Display Settings', {
            'fields': ('variant', 'order', 'is_active'),
        }),
    )

    def slide_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:48px;width:90px;object-fit:cover;border-radius:4px">', obj.image.url)
        return '—'
    slide_preview.short_description = 'Preview'
