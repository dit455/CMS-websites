from django.contrib import admin
from .models import (Official, Partner, SiteSetting, PortalStat, QuickLink,
                     ResourceGroup, ResourcePoint)


@admin.register(Official)
class OfficialAdmin(admin.ModelAdmin):
    list_display = ('site', 'order', 'name', 'role', 'is_active')
    list_filter = ('site',)
    list_editable = ('is_active',)
    list_display_links = ('name',)
    search_fields = ('name', 'role')


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('site', 'order', 'name', 'tone', 'is_active')
    list_filter = ('site',)
    list_editable = ('is_active',)
    list_display_links = ('name',)
    search_fields = ('name',)


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'site')
    list_filter = ('site',)
    fieldsets = (
        ('Site', {'fields': ('site',)}),
        ('Department', {'fields': ('department_name', 'government_name')}),
        ('Contact', {'fields': ('helpdesk_email', 'phone', 'address')}),
        ('Footer', {'fields': ('footer_description',)}),
        ('Web Information Manager', {'fields': (
            'web_information_manager', 'web_information_manager_designation',
            'web_information_manager_email')}),
        ('Social Links', {'fields': ('facebook_url', 'twitter_url', 'youtube_url', 'linkedin_url')}),
    )


@admin.register(PortalStat)
class PortalStatAdmin(admin.ModelAdmin):
    list_display = ('site', 'order', 'value', 'label', 'is_active')
    list_filter = ('site',)
    list_editable = ('is_active',)
    list_display_links = ('value',)


@admin.register(QuickLink)
class QuickLinkAdmin(admin.ModelAdmin):
    list_display = ('site', 'order', 'label', 'href', 'is_active')
    list_filter = ('site',)
    list_editable = ('is_active',)
    list_display_links = ('label',)


class ResourcePointInline(admin.TabularInline):
    model = ResourcePoint
    extra = 2


@admin.register(ResourceGroup)
class ResourceGroupAdmin(admin.ModelAdmin):
    list_display = ('site', 'order', 'title', 'slug', 'is_active')
    list_filter = ('site',)
    list_editable = ('is_active',)
    list_display_links = ('title',)
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ResourcePointInline]
