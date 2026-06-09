from rest_framework.routers import DefaultRouter
from .views import InfoSectionViewSet, FooterLinkGroupViewSet

router = DefaultRouter()
router.register('info-sections',      InfoSectionViewSet,    basename='info-sections')
router.register('footer-link-groups', FooterLinkGroupViewSet, basename='footer-link-groups')

urlpatterns = router.urls
