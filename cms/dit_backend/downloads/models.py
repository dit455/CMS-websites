from django.db import models
from sites.mixins import site_field


class Download(models.Model):
    """
    Downloadable resources: templates, forms, guidelines.
    Users can upload PDFs, DOCX, or other files from the admin panel.
    """
    site = site_field()
    CATEGORY_CHOICES = [
        ('template', 'Template'),
        ('form', 'Form'),
        ('guideline', 'Guideline'),
        ('report', 'Report'),
        ('circular', 'Circular'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=300)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='template')
    description = models.TextField(blank=True)
    file = models.FileField(
        upload_to='downloads/',
        help_text="Upload PDF, DOCX, XLSX, or other file"
    )
    file_size_display = models.CharField(
        max_length=20, blank=True,
        help_text="Human-readable size shown to users, e.g. '2.4 MB'"
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Download"
        verbose_name_plural = "Downloads"

    def __str__(self):
        return self.title

    def file_type(self):
        """Extracts extension, e.g. 'PDF', 'DOCX'"""
        if self.file:
            name = self.file.name
            ext = name.split('.')[-1].upper() if '.' in name else 'FILE'
            return ext
        return 'FILE'
