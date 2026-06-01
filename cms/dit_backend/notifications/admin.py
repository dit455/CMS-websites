from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['site', 'title', 'category', 'publish_date', 'is_important', 'is_active']
    list_editable = ['is_active', 'is_important']
    list_filter = ['category', 'is_important', 'is_active', 'site']
    search_fields = ['title', 'description']
    date_hierarchy = 'publish_date'
