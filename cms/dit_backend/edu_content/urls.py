from rest_framework.routers import DefaultRouter
from .views import (
    QuickAccessButtonViewSet, TransferRoundViewSet,
    EduCounterViewSet, EduGrievanceStatViewSet,
    EduTrustPointViewSet, EduFooterGroupViewSet,
)

router = DefaultRouter()
router.register('quick-buttons',     QuickAccessButtonViewSet, basename='quick-buttons')
router.register('transfer-rounds',   TransferRoundViewSet,     basename='transfer-rounds')
router.register('counters',          EduCounterViewSet,        basename='edu-counters')
router.register('grievance-stats',   EduGrievanceStatViewSet,  basename='edu-grievance-stats')
router.register('trust-points',      EduTrustPointViewSet,     basename='edu-trust-points')
router.register('footer-groups',     EduFooterGroupViewSet,    basename='edu-footer-groups')

urlpatterns = router.urls
