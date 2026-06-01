"""
Menu Manager Models
===================
Manages the navigation bar for the DIT portal.

Structure:
  MenuItem (top-level)
    └── MenuItem (child, via parent FK)

This supports:
  - Simple nav links  (Home, About, Documents...)
  - Dropdown menus   (Services with submenu items)
  - Nested "More"    (Grouped children like EoDB, Grievances...)

Each item stores:
  label        — Text shown in navbar ("Home", "Services")
  href         — Anchor or URL ("#", "#services", "#documents")
  icon         — Icon name used in React (e.g. "FaHome", "FaCogs")
  badge        — Optional small badge label ("Live", "PDF", "Info")
  order        — Controls display order (0 = first)
  is_active    — Toggle visibility without deleting
  parent       — If set, this item appears inside parent's dropdown
  is_mega_menu — If True, renders as full mega-menu (like Services)
"""

from django.db import models
from sites.mixins import site_field


ICON_CHOICES = [
    ('FaHome', 'Home'),
    ('FaInfoCircle', 'Info Circle'),
    ('FaCogs', 'Cogs / Services'),
    ('FaFileAlt', 'File / Documents'),
    ('FaBell', 'Bell / Notifications'),
    ('FaBriefcase', 'Briefcase / EoDB'),
    ('FaComments', 'Comments / Grievances'),
    ('FaDownload', 'Download'),
    ('FaEnvelope', 'Envelope / Contact'),
    ('FaGavel', 'Gavel / RTI'),
    ('FaEllipsisH', 'More (...)'),
    ('FaChevronRight', 'Chevron Right'),
    ('FaSearch', 'Search'),
    ('FaShieldAlt', 'Shield'),
    ('FaUsers', 'Users'),
    ('FaNewspaper', 'Newspaper'),
    ('FaLink', 'External Link'),
]


class MenuItem(models.Model):
    site = site_field()
    label = models.CharField(
        max_length=100,
        help_text="Text shown in the navbar, e.g. 'Home', 'Services', 'RTI'"
    )
    href = models.CharField(
        max_length=300,
        default='#',
        help_text="Page anchor or URL. Use '#services', '#documents', or full URL https://..."
    )
    icon = models.CharField(
        max_length=50,
        choices=ICON_CHOICES,
        default='FaChevronRight',
        help_text="Icon shown next to the label"
    )
    badge = models.CharField(
        max_length=30,
        blank=True,
        help_text="Optional small badge (e.g. 'Live', 'New', 'PDF'). Leave blank for none."
    )
    description = models.CharField(
        max_length=200,
        blank=True,
        help_text="Short description shown inside mega-menu dropdowns (optional)"
    )
    parent = models.ForeignKey(
        'self',
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name='children',
        help_text="Leave blank for top-level. Select a parent to make this a dropdown child."
    )
    is_mega_menu = models.BooleanField(
        default=False,
        help_text="Tick for the 'Services' style full-width dropdown. Leave unticked for simple dropdown."
    )
    open_in_new_tab = models.BooleanField(
        default=False,
        help_text="Tick if this link should open in a new browser tab (for external links)"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order. 0 = first. Use 10, 20, 30... to leave gaps for inserting later."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Untick to hide this item from the navbar without deleting it."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'label']
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"

    def __str__(self):
        if self.parent:
            return f"  └─ {self.label}  (under: {self.parent.label})"
        return self.label

    def is_top_level(self):
        return self.parent is None

    def has_children(self):
        return self.children.filter(is_active=True).exists()
