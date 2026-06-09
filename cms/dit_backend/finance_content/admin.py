from django.contrib import admin
from sites.admin_mixins import TemplateScopedAdminMixin
from .models import InfoSection, InfoItem, FooterLinkGroup, FooterLink


class FinanceAdminBase(TemplateScopedAdminMixin, admin.ModelAdmin):
    required_template = 'template-three'


# ── Info Sections ──────────────────────────────────────────────────────────────
class InfoItemInline(admin.TabularInline):
    model  = InfoItem
    extra  = 1
    fields = ('text', 'href', 'order')

@admin.register(InfoSection)
class InfoSectionAdmin(FinanceAdminBase):
    list_display  = ('title', 'icon', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    inlines       = [InfoItemInline]
    ordering      = ('order',)


# ── Footer Links ───────────────────────────────────────────────────────────────
class FooterLinkInline(admin.TabularInline):
    model  = FooterLink
    extra  = 1
    fields = ('label', 'href', 'order')

@admin.register(FooterLinkGroup)
class FooterLinkGroupAdmin(FinanceAdminBase):
    list_display  = ('heading', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    inlines       = [FooterLinkInline]
    ordering      = ('order',)
