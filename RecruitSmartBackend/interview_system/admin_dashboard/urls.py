from django.urls import path
from . import views

urlpatterns = [
    path("list-job-posts/", views.list_job_posts, name="list-job-posts"),
    path("create-job-post/", views.create_job_post, name="create-job-post"),
    path("delete-job-post/<int:job_id>/", views.delete_job_post, name="delete-job-post"),
    path('admin/login/', views.admin_login, name='admin-login'),
    path('upload-selected-user', views.upload_selected_user, name='upload-selected-user'),
    path('overall_performance/', views.overall_performance, name='overall_performance'),
]
