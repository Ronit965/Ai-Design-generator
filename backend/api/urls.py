"""
URL patterns for the AI Design Generator API.
"""

from django.urls import path
from .views import (
    GenerateDesignView,
    HealthCheckView,
    DesignListView,
    DesignDetailView,
)

urlpatterns = [
    path('generate/', GenerateDesignView.as_view(), name='generate-design'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('designs/', DesignListView.as_view(), name='design-list'),
    path('designs/<str:design_id>/', DesignDetailView.as_view(), name='design-detail'),
]
