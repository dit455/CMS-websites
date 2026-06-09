from django.contrib import admin
from sites.admin_mixins import TemplateScopedAdminMixin
from .models import (
    QuickAccessButton, TransferRound,
    EduCounter, EduGrievanceStat, EduTrustPoint,
    EduFooterGroup, EduFooterLink,
)


class EduAdminBase(TemplateScopedAdminMixin, admin.ModelAdmin):
    required_template = 'template-two'


@admin.register(QuickAccessButton)
class QuickAccessButtonAdmin(EduAdminBase):
    list_display  = ('label', 'href', 'icon', 'order', 'is_active')
    list_editable = ('order', 'is_active')


@admin.register(TransferRound)
class TransferRoundAdmin(EduAdminBase):
    list_display  = ('name', 'start_date', 'end_date', 'status', 'order', 'is_active')
    list_editable = ('status', 'order', 'is_active')
    list_filter   = ('status', 'is_active')


@admin.register(EduCounter)
class EduCounterAdmin(EduAdminBase):
    list_display  = ('label', 'value', 'order', 'is_active')
    list_editable = ('value', 'order', 'is_active')
    ordering      = ('order',)


@admin.register(EduGrievanceStat)
class EduGrievanceStatAdmin(EduAdminBase):
    list_display  = ('label', 'value', 'helper', 'order', 'is_active')
    list_editable = ('value', 'order', 'is_active')
    ordering      = ('order',)


@admin.register(EduTrustPoint)
class EduTrustPointAdmin(EduAdminBase):
    list_display  = ('text', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    ordering      = ('order',)


class EduFooterLinkInline(admin.TabularInline):
    model  = EduFooterLink
    extra  = 2
    fields = ('label', 'href', 'order')


@admin.register(EduFooterGroup)
class EduFooterGroupAdmin(EduAdminBase):
    list_display  = ('heading', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    inlines       = [EduFooterLinkInline]
