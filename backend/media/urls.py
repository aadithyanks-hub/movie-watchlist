from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaViewSet, RegisterView, LoginView, CurrentUserView

router = DefaultRouter()
router.register(r'media', MediaViewSet, basename='media')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('', include(router.urls)),
]
