from django.contrib import admin
from .models import Download


@admin.register(Download)
class DownloadAdmin(admin.ModelAdmin):
    list_display = ['site', 'title', 'category', 'file_type', 'file_size_display', 'is_active', 'order']
    list_editable = ['is_active', 'order']
    list_filter = ['category', 'is_active', 'site']
    search_fields = ['title', 'description']
