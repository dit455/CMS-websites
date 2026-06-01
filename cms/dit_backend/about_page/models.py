"""
About Page Models
=================
Manages ALL content on the About Us / AboutDetailPage.jsx:

1. AboutPage       — hero title, description, commitment text
2. VisionMission   — Vision card and Mission bullet points
3. KeyFunction     — "What We Do" checklist items
4. InitiativeFocus — Citizen-centric services pill list
5. InnovationBlock — "Driving Innovation" card text
"""

from django.db import models
from sites.mixins import site_field


class AboutPage(models.Model):
    """
    One About-page record per site.
    Controls the top hero banner and commitment section.
    """
    site = models.OneToOneField('sites.Site', on_delete=models.CASCADE,
                                related_name='aboutpage', null=True, blank=True,
                                help_text="The website this About page belongs to.")
    hero_kicker        = models.CharField(max_length=100, default='About Us')
    hero_title         = models.CharField(max_length=300, default='Empowering Digital Governance for a Smarter Puducherry')
    hero_description   = models.TextField(default='The Directorate of Information Technology (DIT), Government of Puducherry, serves as the central agency driving digital transformation and e-Governance initiatives across the Union Territory.')

    intro_para1 = models.TextField(verbose_name='Introduction Paragraph 1', default='Established with the vision of creating a technologically empowered administration...')
    intro_para2 = models.TextField(verbose_name='Introduction Paragraph 2', blank=True)

    vision_title = models.CharField(max_length=200, default='Our Vision')
    vision_text  = models.TextField(default='To build a digitally connected, transparent, and technology-driven Puducherry...')

    mission_title = models.CharField(max_length=200, default='Our Mission')

    citizen_services_title = models.CharField(max_length=200, default='Citizen-Centric Digital Services')
    citizen_services_text  = models.TextField(default='DIT is committed to simplifying access to Government services...')

    innovation_title = models.CharField(max_length=200, default='Driving Innovation & Digital Transformation')
    innovation_para1 = models.TextField(default='As technology continues to evolve, the Directorate actively explores innovative solutions...')
    innovation_para2 = models.TextField(blank=True)

    commitment_title = models.CharField(max_length=200, default='Commitment to Excellence')
    commitment_text  = models.TextField(default='The Directorate of Information Technology remains dedicated to delivering reliable, transparent, and efficient digital governance solutions...')
    commitment_tagline = models.CharField(max_length=300, default='Together, we are building a smarter, digitally empowered Puducherry.')

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'About Page Settings'
        verbose_name_plural = 'About Page Settings'

    def __str__(self):
        return 'About Page Content'


class MissionPoint(models.Model):
    """Bullet points under 'Our Mission'"""
    site = site_field()
    text  = models.TextField(help_text='One mission bullet point, e.g. "To promote effective adoption of IT..."')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Mission Point'
        verbose_name_plural = 'Mission Points'

    def __str__(self):
        return self.text[:80]


class KeyFunction(models.Model):
    """Checklist items under 'Key Functions' / What We Do"""
    site = site_field()
    text  = models.TextField(help_text='One key function line, e.g. "Implementation of e-Governance projects..."')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Key Function'
        verbose_name_plural = 'Key Functions'

    def __str__(self):
        return self.text[:80]


class InitiativeFocusPoint(models.Model):
    """Pill/badge items under 'Citizen-Centric Digital Services'"""
    site = site_field()
    text  = models.CharField(max_length=150, help_text='e.g. "Online public service delivery"')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Initiative Focus Point'
        verbose_name_plural = 'Initiative Focus Points'

    def __str__(self):
        return self.text
