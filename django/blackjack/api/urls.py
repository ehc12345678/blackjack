from django.urls import path
from .views import (
    StateView
)

urlpatterns = [
    path('api', StateView.as_view()),
]