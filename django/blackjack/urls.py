from django.urls import include, path

from . import views
from django.conf.urls.static import static
from django.conf import settings

from blackjack.api import urls as blackjack_urls

urlpatterns = [
    path("deck", views.index, name="index"),
    path("deck/<str:suit>/<str:card>", views.detail, name="detail"),
    path("home/", views.home, name="home"),
    path("state/", include(blackjack_urls))
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)