# expert_dashboard/models.py
from django.db import models
from admin_dashboard.models import JobPost
from user_dashboard.models import User



class InterviewSchedule(models.Model):
    user_gmail = models.EmailField(max_length=255,default=None)  # To store the user's Gmail
    job_id = models.CharField(max_length=100,null=True)  # To store the job UUID
    scheduled_time = models.DateTimeField()  # To store the scheduled interview time

    def __str__(self):
        return f"Interview for {self.user_gmail} scheduled at {self.scheduled_time} for Job ID {self.job_id}"


class Expert(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Ideally hashed

    def __str__(self):
        return self.email
