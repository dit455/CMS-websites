from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, site_config

router = DefaultRouter()
router.register('sites', SiteViewSet, basename='sites')

urlpatterns = [
    path('site-config/', site_config),
    path('', include(router.urls)),
]
