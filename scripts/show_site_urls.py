"""
Called by start.bat — prints every active site URL so you know exactly
which address to open for each site.
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'cms', 'dit_backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from sites.models import Site

# Read sites.conf → {folder: port}
conf_path = os.path.join(ROOT, 'sites.conf')
folder_port = {}
try:
    with open(conf_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split(':')
            if len(parts) >= 2:
                folder_port[parts[1].strip()] = parts[0].strip()
except FileNotFoundError:
    folder_port = {}

default_port = list(folder_port.values())[0] if folder_port else '5173'

print()
print('  +-------------------------------------------------+')
print('  |           ACCESSIBLE SITES                      |')
print('  +-------------------------------------------------+')
for site in Site.objects.filter(is_active=True).order_by('template', 'name'):
    port = folder_port.get(site.folder, default_port)
    print(f'  |  {site.name:<28} [{site.key:<10}]  |')
    print(f'  |  http://localhost:{port}/?site={site.key:<20}  |')
    print('  +-------------------------------------------------+')