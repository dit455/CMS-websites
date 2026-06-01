from django.db import models
from sites.mixins import site_field


class Document(models.Model):
    """
    Official government documents: G.O.s, circulars, orders, tenders, reports.
    Maps to the 'documents' section in your React frontend (Documents.jsx)
    """
    site = site_field()
    CATEGORY_CHOICES = [
        ('guidelines', 'Guidelines'),
        ('orders', 'Orders'),
        ('templates', 'Templates'),
        ('reports', 'Reports'),
        ('tenders', 'Tenders'),
        ('circulars', 'Circulars'),
        ('notifications', 'Notifications'),
    ]

    title = models.CharField(max_length=300)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='guidelines')
    description = models.TextField(blank=True)
    file = models.FileField(
        upload_to='documents/',
        blank=True, null=True,
        help_text="Upload the actual document (PDF, DOCX, etc.)"
    )
    external_url = models.URLField(
        blank=True,
        help_text="If document is hosted externally, paste URL here instead of uploading"
    )
    file_size_display = models.CharField(
        max_length=20, blank=True,
        help_text="e.g. '2.4 MB'"
    )
    publish_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-publish_date', '-created_at']
        verbose_name = "Document"
        verbose_name_plural = "Documents"

    def __str__(self):
        return self.title

    def file_type(self):
        if self.file:
            name = self.file.name
            return name.split('.')[-1].upper() if '.' in name else 'FILE'
        if self.external_url:
            return 'LINK'
        return 'N/A'
