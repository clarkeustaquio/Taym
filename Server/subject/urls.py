from django.urls import path
from . import views

app_name = 'subject'

urlpatterns = [
    path('subject/', views.subject, name='subject'),
    path('child-task/', views.get_child_task, name='get_child_task'),
    path('approve-task/', views.approve_task, name='approve_task'),
    path('disapprove-task/', views.disapprove_task, name='disapprove_task')
]
