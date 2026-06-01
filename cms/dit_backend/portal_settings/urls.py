from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (OfficialViewSet, PartnerViewSet, PortalStatViewSet,
                    QuickLinkViewSet, SiteSettingView, ResourceGroupViewSet)

router = DefaultRouter()
router.register('officials', OfficialViewSet, basename='officials')
router.register('partners',  PartnerViewSet,  basename='partners')
router.register('stats',     PortalStatViewSet, basename='stats')
router.register('quick-links', QuickLinkViewSet, basename='quick-links')
router.register('resource-groups', ResourceGroupViewSet, basename='resource-groups')

urlpatterns = [
    path('settings/', SiteSettingView.as_view()),
    path('', include(router.urls)),
]
