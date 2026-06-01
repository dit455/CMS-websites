from django.contrib import admin
from .models import AboutPage, MissionPoint, KeyFunction, InitiativeFocusPoint


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    fieldsets = (
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
    list_filter = ('site',)

    def has_delete_permission(self, request, obj=None):
        return True


@admin.register(MissionPoint)
class MissionPointAdmin(admin.ModelAdmin):
    list_display  = ['text', 'site', 'order', 'is_active']
    list_editable = ['is_active']
    list_filter   = ['site']
    ordering      = ['order']
    verbose_name  = 'Mission Point'


@admin.register(KeyFunction)
class KeyFunctionAdmin(admin.ModelAdmin):
    list_display  = ['text', 'site', 'order', 'is_active']
    list_editable = ['is_active']
    list_filter   = ['site']
    ordering      = ['order']


@admin.register(InitiativeFocusPoint)
class InitiativeFocusPointAdmin(admin.ModelAdmin):
    list_display  = ['text', 'site', 'order', 'is_active']
    list_editable = ['is_active']
    list_filter   = ['site']
    ordering      = ['order']
