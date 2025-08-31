# expert_dashboard/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload-job-post-csv/<int:job_post_id>/', views.upload_job_post_csv, name='upload-job-post-csv'),
    path('get-users/', views.get_users, name='get_users'),
    path('get-jobs/', views.get_jobs, name='get_jobs'),
    path('schedule-interview/', views.schedule_interview, name='schedule_interview'),
    path('expert/login/', views.expert_login, name='expert_login'),
]