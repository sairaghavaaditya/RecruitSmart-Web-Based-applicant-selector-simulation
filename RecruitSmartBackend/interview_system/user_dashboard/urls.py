from django.urls import path
from . import views


urlpatterns = [
    path("fetch-next-question/", views.fetch_next_question, name="fetch-next-question"),
    path("submit-response/", views.submit_response, name="submit_response"),
    path('signup/', views.user_signup, name='user-signup'),
    path('login/', views.user_login, name='user-login'),
    path('jobs/', views.JobPostListView.as_view(), name='job-list'),
    path('upload-resume/<str:command_id>/', views.ResumeUploadView.as_view(), name='resume_upload'),
    path('user-profile/', views.get_user_profile, name='user_profile'),
]
