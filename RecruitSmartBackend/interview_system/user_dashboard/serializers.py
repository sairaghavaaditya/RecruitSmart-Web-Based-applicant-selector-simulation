from rest_framework import serializers
from .models import User
from admin_dashboard.models import JobPost,Question

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'mobile_number', 'email', 'password']


class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['id','command_id','title', 'description', 'created_at', 'is_active']



class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question', 'answer', 'difficulty', 'keywords', 'command_id']
    

