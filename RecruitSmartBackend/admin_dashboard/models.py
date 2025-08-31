

from django.db import models

class JobPost(models.Model):
    command_id = models.CharField(max_length=100,null=True, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    # questions_csv = models.FileField(upload_to="job_questions/", blank=True, null=True)  # New field
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class SelectedUser(models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")
    discipline = models.CharField(max_length=100, verbose_name="Discipline")
    area_of_expertise = models.TextField(verbose_name="Area of Expertise")  # Using TextField for multiple values

    def __str__(self):
        return f"{self.name} - {self.discipline}"




class Question(models.Model):
    job_post = models.ForeignKey(JobPost, related_name='questions', on_delete=models.CASCADE)
    command_id = models.CharField(max_length=100, null=True)
    id = models.AutoField(primary_key=True)
    question = models.TextField()
    answer = models.TextField(null=True)
    difficulty = models.CharField(max_length=20)  # Ensure valid difficulty levels
    keywords = models.JSONField(default=dict,null=True)

    def __str__(self):
        return self.question


class UsersResponses(models.Model):
    question_id = models.ForeignKey('Question', on_delete=models.CASCADE)
    command_id = models.UUIDField()  # Add the command_id field
    user_email = models.EmailField(default="Not Provided")
    user_answer = models.TextField()
    original_answer = models.TextField(default="Not Provided")  # Add a default value
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"Response to Question {self.question_id.id} (Command ID: {self.command_id})"



class Admin(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=150)  # Store hashed passwords in production

    def __str__(self):
        return self.username
