"""
Menu Manager Admin
==================
This is the CMS interface for the menu bar.

Admins can:
  1. See all menu items at a glance (list view)
  2. Drag to reorder (via the 'order' field)
  3. Add children inline inside a parent item's edit page
  4. Toggle items on/off with is_active
  5. Set icon, badge, href for each item

The "Children" inline panel appears when editing a top-level item,
letting you add/remove dropdown items in one screen.
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import MenuItem


class MenuChildInline(admin.TabularInline):
    """
    Shows child items (dropdown entries) directly inside the parent form.
    
    Example: When editing "More", you see EoDB, Grievances, Downloads, Contact
    all in a table below, which you can edit in one click.
    """
    model = MenuItem
    fk_name = 'parent'
    fields = ['label', 'href', 'icon', 'badge', 'description', 'open_in_new_tab', 'order', 'is_active']
    extra = 1        # Show 1 blank row to add new child
    ordering = ['order']
    verbose_name = "Child Menu Item (Dropdown Entry)"
    verbose_name_plural = "Child Items (shown in dropdown)"


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    # ── List view columns ────────────────────────────────────────────────
    list_display = ['site', 
        'display_label',    # indented label to show parent/child
        'href',
        'icon',
        'badge_display',
        'order',
        'is_active',
        'is_mega_menu',
    ]
    list_editable = ['order', 'is_active']   # Edit these columns inline in the list
    list_filter = ['is_active', 'is_mega_menu', 'parent', 'site']
    search_fields = ['label', 'href']
    ordering = ['order']

    # ── Form layout ──────────────────────────────────────────────────────
    fieldsets = (
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
            'classes': ('collapse',),   # Collapsed by default
            'description': (
                '"Is mega menu" renders a full-width dropdown (like Services). '
                '"Open in new tab" adds target="_blank" to the link.'
            )
        }),
    )

    # Show child items inline when editing a top-level item
    inlines = [MenuChildInline]

    def display_label(self, obj):
        """Show indented label so children are visually distinct"""
        if obj.parent:
            return format_html('&nbsp;&nbsp;&nbsp;└─ {}', obj.label)
        return format_html('<strong>{}</strong>', obj.label)
    display_label.short_description = 'Menu Item'

    def badge_display(self, obj):
        """Render the badge with color if present"""
        if obj.badge:
            return format_html(
                '<span style="background:#3B82F6;color:white;padding:2px 8px;'
                'border-radius:10px;font-size:11px">{}</span>',
                obj.badge
            )
        return '—'
    badge_display.short_description = 'Badge'

    def get_queryset(self, request):
        """Show ALL items in admin (not filtered by is_active)"""
        return MenuItem.objects.all().select_related('parent')
