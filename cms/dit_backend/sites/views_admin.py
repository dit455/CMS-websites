from itertools import groupby
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods

from .models import Site

TEMPLATE_COLOURS = {
    'template-one':   '#3B82F6',
    'template-two':   '#10B981',
    'template-three': '#F59E0B',
    'template-four':  '#8B5CF6',
}


def _user_sites(request):
    if request.user.is_superuser:
        return Site.objects.filter(is_active=True).order_by('template', 'name')
    try:
        return (request.user.site_admin_profile.sites
                .filter(is_active=True).order_by('template', 'name'))
    except Exception:
        return Site.objects.none()


# ── Superadmin Dashboard ───────────────────────────────────────────────────────
@staff_member_required
def superadmin_dashboard(request):
    """
    Landing page for superadmins.
    Shows all websites grouped by template with Create / Edit / Manage Content actions.
    """
    if not request.user.is_superuser:
        return redirect('/admin/select-site/')

    all_sites = Site.objects.order_by('template', 'name').prefetch_related('admins')

    grouped = []
    for template_key, group in groupby(all_sites, key=lambda s: s.template):
        site_list = list(group)
        colour = TEMPLATE_COLOURS.get(template_key, '#6B7280')
        label  = dict(Site.TEMPLATE_CHOICES).get(template_key, template_key)
        for s in site_list:
            s.colour  = colour
            s.nadmins = s.admins.count()
        grouped.append({
            'template_key': template_key,
            'label':        label,
            'colour':       colour,
            'sites':        site_list,
        })

    total_sites   = all_sites.count()
    total_active  = all_sites.filter(is_active=True).count()
    total_tpls    = all_sites.values('template').distinct().count()

    return render(request, 'admin/superadmin_dashboard.html', {
        'grouped_sites':  grouped,
        'total_sites':    total_sites,
        'total_active':   total_active,
        'total_templates': total_tpls,
        'title': 'Website Management Dashboard',
    })


# ── "Manage Content" button handler ───────────────────────────────────────────
@staff_member_required
@require_http_methods(['POST'])
def manage_content(request):
    """Sets the active site in session and redirects to the admin content area."""
    site_key = request.POST.get('site_key', '').strip()
    if site_key and Site.objects.filter(key=site_key).exists():
        request.session['cms_active_site'] = site_key
    return redirect('/admin/')


# ── Dept-admin site picker ────────────────────────────────────────────────────
@staff_member_required
@require_http_methods(['GET', 'POST'])
def site_select(request):
    if request.user.is_superuser:
        return redirect('/admin/dashboard/')

    if request.method == 'POST':
        site_key = request.POST.get('site_key', '').strip()
        sites = _user_sites(request)
        if sites.filter(key=site_key).exists():
            request.session['cms_active_site'] = site_key
            return redirect('/admin/')

    sites = _user_sites(request)
    grouped = []
    for template_key, group in groupby(sites, key=lambda s: s.template):
        site_list = list(group)
        colour = TEMPLATE_COLOURS.get(template_key, '#6B7280')
        label  = dict(Site.TEMPLATE_CHOICES).get(template_key, template_key)
        grouped.append({'template_key': template_key, 'label': label,
                        'colour': colour, 'sites': site_list})

    return render(request, 'admin/site_select.html', {
        'grouped_sites': grouped,
        'title': 'Select Your Site',
    })


# ── Switch site ────────────────────────────────────────────────────────────────
@staff_member_required
def site_switch(request):
    request.session.pop('cms_active_site', None)
    if request.user.is_superuser:
        return redirect('/admin/dashboard/')
    return redirect('/admin/select-site/')
