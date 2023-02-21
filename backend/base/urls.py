from django.contrib import admin
from django.urls import path
from . import views
from .views import PaymentView, ExecutePaymentView,CancelPaymentView

urlpatterns = [
    # path('', views.index),
    # path('products', views.products),
    path('myProducts',views.myProducts),
    path('myProducts/<int:pk>', views.APIViews.as_view(), name='product_detail'),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register',views.register ),
    path('refresh',views.RefreshTokenView.as_view(),name='refresh_token'),
    path('logout', views.LogoutAPIView.as_view(), name='logout'),
    path('get_all_images', views.getImages),
    path('upload_image/',views.APIViews.as_view()),
    path('order',views.order ),
    path('get_profile',views.get_user_profile ),
    path('upd_profile',views.update_user_profile ),
    path('payment/create/', views.PaymentView.as_view(), name='create-payment'),
    path('payment/execute/',views.ExecutePaymentView.as_view(), name='execute-payment'),
    path('payment/cancel/', views.CancelPaymentView.as_view(), name='cancel-payment'),


]
