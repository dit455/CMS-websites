from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AboutPageView, MissionPointViewSet,
                    KeyFunctionViewSet, InitiativeFocusViewSet)

router = DefaultRouter()
router.register('mission-points',    MissionPointViewSet,    basename='mission-points')
router.register('key-functions',     KeyFunctionViewSet,     basename='key-functions')
router.register('initiative-points', InitiativeFocusViewSet, basename='initiative-points')

urlpatterns = [
    path('', AboutPageView.as_view()),
    path('', include(router.urls)),
]
