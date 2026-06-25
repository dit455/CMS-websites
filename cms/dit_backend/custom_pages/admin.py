from django import forms
from django.contrib import admin
from sites.admin_mixins import SiteScopedAdminMixin
from .models import CmsPage


class CmsPageForm(forms.ModelForm):
    content = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 22, 'style': 'font-family: monospace; width: 95%;'}),
        help_text=(
            'Paste HTML here — tables, links, headings, lists all work. Example:<br>'
            '<code>&lt;table&gt;&lt;tr&gt;&lt;th&gt;Route&lt;/th&gt;&lt;/tr&gt;'
            '&lt;tr&gt;&lt;td&gt;Route 1&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</code><br>'
            '<code>&lt;a href="https://example.com"&gt;Link text&lt;/a&gt;</code>'
        ),
        required=False,
    )

    class Meta:
        model = CmsPage
        fields = '__all__'


@admin.register(CmsPage)
class CmsPageAdmin(SiteScopedAdminMixin, admin.ModelAdmin):
    form = CmsPageForm
    list_display       = ('site', 'order', 'title', 'slug', 'is_active')
    list_filter         = ('site', 'is_active')
    list_editable       = ('is_active',)
    list_display_links  = ('title',)
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Page', {
            'fields': ('site', 'title', 'slug', 'order', 'is_active'),
            'description': (
                'Set the menu item href to <code>#page-&lt;slug&gt;</code> in Menu Manager '
                'to link to this page from the nav bar.'
            ),
        }),
        ('Content', {'fields': ('content',)}),
    )
