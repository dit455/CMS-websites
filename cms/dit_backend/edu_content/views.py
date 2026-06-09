from rest_framework import viewsets
from sites.mixins import SiteScopedQuerySetMixin
from .models import (
    QuickAccessButton, TransferRound,
    EduCounter, EduGrievanceStat, EduTrustPoint,
    EduFooterGroup,
)
from .serializers import (
    QuickAccessButtonSerializer, TransferRoundSerializer,
    EduCounterSerializer, EduGrievanceStatSerializer,
    EduTrustPointSerializer, EduFooterGroupSerializer,
)


class _EduViewSet(SiteScopedQuerySetMixin, viewsets.ReadOnlyModelViewSet):
    def _qs(self, model):
        return self.filter_by_site(model.objects.filter(is_active=True))


class QuickAccessButtonViewSet(_EduViewSet):
    serializer_class = QuickAccessButtonSerializer
    def get_queryset(self): return self._qs(QuickAccessButton)


class TransferRoundViewSet(_EduViewSet):
    serializer_class = TransferRoundSerializer
    def get_queryset(self): return self._qs(TransferRound)


class EduCounterViewSet(_EduViewSet):
    serializer_class = EduCounterSerializer
    def get_queryset(self): return self._qs(EduCounter)


class EduGrievanceStatViewSet(_EduViewSet):
    serializer_class = EduGrievanceStatSerializer
    def get_queryset(self): return self._qs(EduGrievanceStat)


class EduTrustPointViewSet(_EduViewSet):
    serializer_class = EduTrustPointSerializer
    def get_queryset(self): return self._qs(EduTrustPoint)


class EduFooterGroupViewSet(SiteScopedQuerySetMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = EduFooterGroupSerializer
    def get_queryset(self):
        return self.filter_by_site(
            EduFooterGroup.objects.filter(is_active=True).prefetch_related('links')
        )
