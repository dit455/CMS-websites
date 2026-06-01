from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsTickerItemViewSet, NewsArticleViewSet

router = DefaultRouter()
router.register('ticker', NewsTickerItemViewSet, basename='ticker')
router.register('articles', NewsArticleViewSet, basename='articles')

urlpatterns = [
    path('', include(router.urls)),
]
