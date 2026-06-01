from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DownloadViewSet

router = DefaultRouter()
router.register('', DownloadViewSet, basename='downloads')
urlpatterns = [path('', include(router.urls))]
