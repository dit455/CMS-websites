"""
Called by start.bat — prints every active site URL (public IP) so you know
exactly which address to open for each site.
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'cms', 'dit_backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.conf import settings
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

# Get public IP from FRONTEND_BASE_URL setting (auto-detected LAN IP, see settings.py)
frontend_base = settings.FRONTEND_BASE_URL
# Extract just the host:port part
from urllib.parse import urlparse
parsed = urlparse(frontend_base)
public_host = parsed.netloc   # e.g. 10.65.51.44:5173

print()
print('  +------------------------------------------------------------+')
print('  |                  ACCESSIBLE SITES                         |')
print('  +------------------------------------------------------------+')

sites = Site.objects.filter(is_active=True).order_by('template', 'name')
if not sites:
    print('  |  No active sites yet. Add sites in /admin/dashboard/       |')
    print('  +------------------------------------------------------------+')
else:
    for site in sites:
        port = folder_port.get(site.folder, default_port)
        # Use the public IP from settings but override port from sites.conf
        url = f'http://{parsed.hostname}:{port}/?site={site.key}'
        name_col  = site.name[:28].ljust(28)
        key_col   = f'[{site.key}]'.ljust(12)
        print(f'  |  {name_col}  {key_col}  |')
        print(f'  |  {url:<58}  |')
        print('  +------------------------------------------------------------+')

print()
print(f'  Admin panel  ->  http://{public_host.split(":")[0]}:8000/admin/')
print()
