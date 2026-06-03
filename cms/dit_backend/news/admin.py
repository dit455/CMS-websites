from django.contrib import admin
from sites.admin_mixins import SiteScopedAdminMixin
from .models import NewsTickerItem, NewsArticle


@admin.register(NewsTickerItem)
class NewsTickerItemAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['site', 'text', 'is_active', 'order', 'created_at']
    list_editable = ['is_active', 'order']
    list_filter   = ['is_active', 'site']
    search_fields = ['text']


@admin.register(NewsArticle)
class NewsArticleAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['site', 'title', 'category', 'publish_date', 'is_published']
    list_filter   = ['category', 'is_published', 'site']
    search_fields = ['title', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'publish_date'
