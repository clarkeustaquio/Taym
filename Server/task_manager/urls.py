from django.urls import path
from . import views

app_name = 'task_manager'

urlpatterns = [
    path('task-manager/', views.task_manager, name='task_manager'),
    path('stop-task/', views.stop_task, name='stop_task'),
    path('get-time/', views.get_time, name='get_time'),
    path('get-task/', views.get_task, name='get_task'),
    path('delete-task/', views.delete_task, name='delete_task'),
    path('history/', views.history, name='history'),
    path('filter-history/', views.filter_history, name='filter_history'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('parent-check/', views.parent_check, name='parent_check'),
    path('accept-parent/', views.accept_parent, name='accept_parent'),
    path('decline-parent/', views.decline_parent, name='decline_parent'),

    path('check-visibility/', views.check_visibility, name='check_visibility'),
    path('parent-history/', views.parent_history, name='parent_history'),
    path('parent-filter-history/', views.parent_filter_history, name='parent_filter_history'),
    path('parent-dashboard/', views.parent_dashboard, name='parent_dashboard'),
    path('notify-exceed/', views.notify_exceed, name='notify_exceed')
]
