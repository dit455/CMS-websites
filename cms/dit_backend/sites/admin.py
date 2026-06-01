from django.contrib import admin
from .models import Site


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'key', 'template', 'is_default', 'is_active', 'domain')
    list_editable = ('template', 'is_default', 'is_active')
    list_display_links = ('name',)
    search_fields = ('name', 'key', 'domain')
    prepopulated_fields = {'key': ('name',)}
