from django.db import models
from admin_dashboard.models import JobPost








    

class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Ideally hashed

    def __str__(self):
        return self.email
