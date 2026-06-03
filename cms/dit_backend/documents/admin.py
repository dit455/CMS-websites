from django.contrib import admin
from sites.admin_mixins import SiteScopedAdminMixin
from .models import Document


@admin.register(Document)
class DocumentAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['site', 'title', 'category', 'file_type', 'publish_date', 'is_active', 'order']
    list_editable = ['is_active', 'order']
    list_filter   = ['category', 'is_active', 'site']
    search_fields = ['title', 'description']
    date_hierarchy = 'publish_date'
