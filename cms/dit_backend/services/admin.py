from django.contrib import admin
from .models import Service, ServiceLink


class ServiceLinkInline(admin.TabularInline):
    model    = ServiceLink
    extra    = 2
    fields   = ['label', 'href', 'order']
    ordering = ['order']
    verbose_name = "Button Link"
    verbose_name_plural = "Button Links (shown on the card)"


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['site', 'order', 'title', 'icon', 'accent_color', 'is_active']
    list_filter = ['site']
    list_display_links = ['title']
    list_editable      = ['order', 'is_active']
    search_fields      = ['title', 'desc']
    inlines            = [ServiceLinkInline]
    ordering           = ['order']
    fieldsets = (
        ('Service Details', {
            'fields': ('title', 'desc', 'icon'),
        }),
        ('Card Appearance', {
            'fields': ('accent_color', 'surface_color'),
            'description': 'accent_color = icon colour (hex). surface_color = background (rgba).'
        }),
        ('Visibility', {
            'fields': ('order', 'is_active'),
        }),
    )
