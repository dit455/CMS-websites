from django.contrib import admin
from django.utils.html import format_html
from sites.admin_mixins import SiteScopedAdminMixin, SiteScopedInlineMixin
from .models import MenuItem


class MenuChildInline(SiteScopedInlineMixin, admin.TabularInline):
    model    = MenuItem
    fk_name  = 'parent'
    fields   = ['label', 'href', 'icon', 'badge', 'description', 'open_in_new_tab', 'order', 'is_active']
    extra    = 1
    ordering = ['order']
    verbose_name        = "Child Menu Item (Dropdown Entry)"
    verbose_name_plural = "Child Items (shown in dropdown)"


@admin.register(MenuItem)
class MenuItemAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    list_display  = ['site', 'display_label', 'href', 'icon', 'badge_display', 'order', 'is_active', 'is_mega_menu']
    list_editable = ['order', 'is_active']
    list_filter   = ['is_active', 'is_mega_menu', 'parent', 'site']
    search_fields = ['label', 'href']
    ordering      = ['order']
    list_select_related = ['parent', 'site']

    fieldsets = (
        ('Site', {
            'fields': ('site',),
        }),
        ('Basic Info', {
            'fields': ('label', 'href', 'icon', 'badge', 'description'),
            'description': (
                'Set the label (text shown in navbar), the href (anchor link like #services), '
                'an icon name, and optionally a badge like "Live" or "New".'
            )
        }),
        ('Position & Visibility', {
            'fields': ('parent', 'order', 'is_active'),
            'description': (
                'Leave "parent" blank for a top-level menu item. '
                'Select a parent to make this a dropdown child item. '
                '"Order" controls left-to-right position (0 = first).'
            )
        }),
        ('Advanced', {
            'fields': ('is_mega_menu', 'open_in_new_tab'),
            'classes': ('collapse',),
            'description': (
                '"Is mega menu" renders a full-width dropdown (like Services). '
                '"Open in new tab" adds target="_blank" to the link.'
            )
        }),
    )

    inlines = [MenuChildInline]

    def save_formset(self, request, form, formset, change):
        """Child items don't expose a 'site' field in the inline form —
        auto-inherit it from the parent so they're never orphaned with site=None."""
        instances = formset.save(commit=False)
        for obj in instances:
            if not obj.site_id and obj.parent_id:
                obj.site_id = obj.parent.site_id
            obj.save()
        formset.save_m2m()

    def display_label(self, obj):
        if obj.parent:
            return format_html('&nbsp;&nbsp;&nbsp;└─ {}', obj.label)
        return format_html('<strong>{}</strong>', obj.label)
    display_label.short_description = 'Menu Item'

    def badge_display(self, obj):
        if obj.badge:
            return format_html(
                '<span style="background:#3B82F6;color:white;padding:2px 8px;'
                'border-radius:10px;font-size:11px">{}</span>',
                obj.badge
            )
        return '—'
    badge_display.short_description = 'Badge'
