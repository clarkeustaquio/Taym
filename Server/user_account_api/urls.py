from django.urls import path
from . import views
from rest_framework.authtoken import views as rest_views
from .tokens import CustomAuthToken, ChangePasswordToken

from .services.reset_password import send_reset_password

app_name = 'common_module_api'

urlpatterns = [
    # Basic Flow
    path('login/', CustomAuthToken.as_view()),
    path('logout/', views.logout, name='logout'),
    path('register/', views.api_create_account, name='create_account'),
    path('reset-password/', views.reset_password, name='reset_password'),

    path('validate-change-token/', ChangePasswordToken.as_view(), name='validate_change_token'),

    # Api Account Authorization
    path('authorize-token/', views.authorize_token, name='authorize_token'),
    path('validate-email-exist/', views.validate_email_exist, name='validate_email_exist'),
    path('validate-reset-password/', views.validate_reset_password, name='validate_reset_password'),

    # Email Activation
    path('activate-account/', views.activate_account, name='activate_account'),

    # Change Email and Password
    path('change-email/', views.change_email, name='change_email'),
    path('change-password/', ChangePasswordToken.as_view(), name='change_password'),
]