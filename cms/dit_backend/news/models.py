"""
News App Models

A "News Item" in the DIT portal can be:
- A news ticker item (short one-line update at the top of page)
- A full news article with image, date, and body text
"""

from django.db import models
from sites.mixins import site_field


class NewsTickerItem(models.Model):
    """
    Short one-line news updates that scroll in the News Ticker 
    at the top of the React frontend (NewsTicker.jsx)
    """
    site = site_field()
    text = models.CharField(
        max_length=500,
        help_text="Short news line (e.g. 'Purchase and AMC Guidelines issued on 11 Feb 2024')"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this item without deleting it"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower number = shown first in ticker"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "News Ticker Item"
        verbose_name_plural = "News Ticker Items"

    def __str__(self):
        return self.text[:80]


class NewsArticle(models.Model):
    """
    Full news articles with title, body, optional image, and publish date.
    Used for a news listing/detail page.
    """
    site = site_field()
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('announcement', 'Announcement'),
        ('event', 'Event'),
        ('press_release', 'Press Release'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(
        max_length=300,
        unique=True,
        help_text="URL-friendly version of title (auto-generated, or enter manually)"
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    summary = models.TextField(
        max_length=500,
        blank=True,
        help_text="Short preview text shown in news cards"
    )
    body = models.TextField(help_text="Full article content (HTML or plain text)")
    image = models.ImageField(
        upload_to='news/images/',    # Saved to media/news/images/
        blank=True,
        null=True,
        help_text="Optional featured image for this article"
    )
    publish_date = models.DateField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-publish_date', '-created_at']
        verbose_name = "News Article"
        verbose_name_plural = "News Articles"

    def __str__(self):
        return self.title
