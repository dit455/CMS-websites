from rest_framework.routers import DefaultRouter
from .views import CmsPageViewSet

router = DefaultRouter()
router.register('', CmsPageViewSet, basename='cms-pages')

urlpatterns = router.urls
