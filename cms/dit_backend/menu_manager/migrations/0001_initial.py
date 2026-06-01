from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(help_text="Text shown in the navbar, e.g. 'Home', 'Services', 'RTI'", max_length=100)),
                ('href', models.CharField(default='#', help_text="Page anchor or URL. Use '#services', '#documents', or full URL https://...", max_length=300)),
                ('icon', models.CharField(choices=[('FaHome', 'Home'), ('FaInfoCircle', 'Info Circle'), ('FaCogs', 'Cogs / Services'), ('FaFileAlt', 'File / Documents'), ('FaBell', 'Bell / Notifications'), ('FaBriefcase', 'Briefcase / EoDB'), ('FaComments', 'Comments / Grievances'), ('FaDownload', 'Download'), ('FaEnvelope', 'Envelope / Contact'), ('FaGavel', 'Gavel / RTI'), ('FaEllipsisH', 'More (...)'), ('FaChevronRight', 'Chevron Right'), ('FaSearch', 'Search'), ('FaShieldAlt', 'Shield'), ('FaUsers', 'Users'), ('FaNewspaper', 'Newspaper'), ('FaLink', 'External Link')], default='FaChevronRight', help_text='Icon shown next to the label', max_length=50)),
                ('badge', models.CharField(blank=True, help_text="Optional small badge (e.g. 'Live', 'New', 'PDF'). Leave blank for none.", max_length=30)),
                ('description', models.CharField(blank=True, help_text='Short description shown inside mega-menu dropdowns (optional)', max_length=200)),
                ('is_mega_menu', models.BooleanField(default=False, help_text="Tick for the 'Services' style full-width dropdown. Leave unticked for simple dropdown.")),
                ('open_in_new_tab', models.BooleanField(default=False, help_text='Tick if this link should open in a new browser tab (for external links)')),
                ('order', models.PositiveIntegerField(default=0, help_text='Display order. 0 = first. Use 10, 20, 30... to leave gaps for inserting later.')),
                ('is_active', models.BooleanField(default=True, help_text='Untick to hide this item from the navbar without deleting it.')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('parent', models.ForeignKey(blank=True, help_text='Leave blank for top-level. Select a parent to make this a dropdown child.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='menu_manager.menuitem')),
            ],
            options={
                'verbose_name': 'Menu Item',
                'verbose_name_plural': 'Menu Items',
                'ordering': ['order', 'label'],
            },
        ),
    ]
