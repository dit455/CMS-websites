from django.contrib import admin
from sites.admin_mixins import SiteScopedAdminMixin
from .models import AboutPage, MissionPoint, KeyFunction, InitiativeFocusPoint


@admin.register(AboutPage)
class AboutPageAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    fieldsets = (
        ('Site', {
            'fields': ('site',),
        }),
        ('Hero Section (Top Banner)', {
            'fields': ('hero_kicker', 'hero_title', 'hero_description'),
            'description': 'Controls the big title at the top of the About page.'
        }),
        ('Introduction Paragraphs', {
            'fields': ('intro_para1', 'intro_para2'),
        }),
        ('Vision Card', {
            'fields': ('vision_title', 'vision_text'),
        }),
        ('Mission Card Title', {
            'fields': ('mission_title',),
            'description': 'Go to Mission Points section to add/edit bullet points.'
        }),
        ('Citizen Services Card', {
            'fields': ('citizen_services_title', 'citizen_services_text'),
        }),
        ('Innovation Card', {
            'fields': ('innovation_title', 'innovation_para1', 'innovation_para2'),
        }),
        ('Commitment Section (Bottom)', {
            'fields': ('commitment_title', 'commitment_text', 'commitment_tagline'),
        }),
    )
    list_display = ('__str__', 'site')
    list_filter  = ('site',)

    def has_delete_permission(self, request, obj=None):
        return True


@admin.register(MissionPoint)
class MissionPointAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['text', 'site', 'order', 'is_active']
    list_editable = ['is_active']
    list_filter   = ['site']
    ordering      = ['order']


@admin.register(KeyFunction)
class KeyFunctionAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['text', 'site', 'order', 'is_active']
    list_editable = ['is_active']
    list_filter   = ['site']
    ordering      = ['order']


@admin.register(InitiativeFocusPoint)
class InitiativeFocusPointAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['text', 'site', 'order', 'is_active']
    list_editable = ['is_active']
    list_filter   = ['site']
    ordering      = ['order']
