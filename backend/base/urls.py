from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    # path('', views.index),
    # path('products', views.products),
    path('myProducts',views.myProducts),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register',views.register ),
    path('refresh',views.RefreshTokenView.as_view(),name='refresh_token'),
    path('logout', views.LogoutAPIView.as_view(), name='logout'),
    path('get_all_images', views.getImages),
    path('upload_image/',views.APIViews.as_view()),

]
