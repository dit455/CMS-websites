from django.db import models
from sites.mixins import site_field


class Notification(models.Model):
    site = site_field()
    CATEGORY_CHOICES = [
        ('circular', 'Circular'),
        ('advisory', 'Advisory'),
        ('announcement', 'Announcement'),
        ('workshop', 'Workshop'),
        ('update', 'System Update'),
    ]

    title = models.CharField(max_length=300)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='announcement')
    description = models.TextField(blank=True)
    attachment = models.FileField(
        upload_to='notifications/attachments/',
        blank=True, null=True,
        help_text="Optional PDF or document attachment"
    )
    publish_date = models.DateField()
    is_active = models.BooleanField(default=True)
    is_important = models.BooleanField(default=False, help_text="Mark as important/urgent")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-publish_date', '-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return self.title
