from rest_framework import serializers
from user_dashboard.models import User
from admin_dashboard.models import JobPost
from .models import InterviewSchedule

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'mobile_number', 'email', 'password']


class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['id','command_id','title', 'description', 'created_at', 'is_active']

class InterviewScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSchedule
        fields = ['user_gmail','job_id','scheduled_time']

