from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from admin_dashboard.models import JobPost,Question
from .models import InterviewSchedule,Expert
from user_dashboard.models import User
from datetime import datetime, timedelta
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# expert_dashboard/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import csv
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer, JobPostSerializer,UserSerializer
from rest_framework import status
from datetime import datetime


from django.core.mail import send_mail
from django.conf import settings

def send_gmail(subject, message, recipient_list):
    """
    Sends an email using Gmail.
    
    Args:
        subject (str): Subject of the email.
        message (str): Body of the email.
        recipient_list (list): List of recipient email addresses.

    Returns:
        bool: True if email is sent successfully, False otherwise.
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


@csrf_exempt
def expert_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # Validate input
            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            # Authenticate admin
            try:
                expert_user = Expert.objects.get(email=email)
                if expert_user.password != password:  # Use a secure hash function in production
                    return JsonResponse({"error": "Invalid email or password."}, status=401)
            except Expert.DoesNotExist:
                return JsonResponse({"error": "Invalid email or password."}, status=401)

            # Login successful
            return JsonResponse({"message": "Expert login successful!",
                                 "username": expert_user.email}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@api_view(['POST'])
def schedule_interview(request):
    try:
        # Extract data from the request
        user_gmail = request.data.get('user_gmail')


        
        
        job_id = request.data.get('job_id')
        scheduled_time_str = request.data.get('scheduled_time')

        # Validate the incoming data
        if not user_gmail or not job_id or not scheduled_time_str:
            return JsonResponse({'error': 'All fields (user_gmail, job_id, scheduled_time) are required.'}, status=400)
        
        try:
            # Convert the scheduled_time from string to datetime object
            scheduled_time = datetime.fromisoformat(scheduled_time_str)
        except ValueError:
            return JsonResponse({'error': 'Invalid scheduled_time format. Expected ISO format (e.g., 2025-01-29T16:23).'}, status=400)
        
        subject = f"Interview Scheduled: Job ID {job_id}"
        adjusted_scheduled_time = scheduled_time + timedelta(hours=5, minutes=30)
        job_post = JobPost.objects.get(command_id=job_id)  # Assuming `job_id` corresponds to `command_id`
        job_title = job_post.title
        user = User.objects.get(email=user_gmail)
        candidate_name = f"{user.first_name} {user.last_name}"
        message = (
            f"Dear {candidate_name},\n\n"
            f"Your interview for {job_title} has been scheduled successfully.\n"
            f"Scheduled Time: {adjusted_scheduled_time.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            f"Please ensure that you are available at the specified time.\n\n"
            f"Best regards,\n"
            f"Interview Team"
        )
        recipient_list = [user_gmail]
        if send_gmail(subject, message, recipient_list):
            print("Email sent successfully!")
        else:
            print("email failed") 
        

        # Create a new interview schedule entry
        interview_schedule = InterviewSchedule.objects.create(
            user_gmail=user_gmail,
            job_id=job_id,
            scheduled_time=scheduled_time
        )

        return JsonResponse({'message': 'Interview scheduled successfully.', 'data': {
            'user_gmail': interview_schedule.user_gmail,
            'job_id': interview_schedule.job_id,
            'scheduled_time': interview_schedule.scheduled_time.isoformat()
        }})

    except Exception as e:
        # Handle any unexpected errors
        return JsonResponse({'error': f'Error: {str(e)}'}, status=500)

@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_jobs(request):
    jobs = JobPost.objects.filter(is_active=True)
    serializer = JobPostSerializer(jobs, many=True)
    return Response(serializer.data)



@csrf_exempt
def upload_job_post_csv(request, job_post_id):
    if request.method == 'POST':
        try:
            job_post = JobPost.objects.get(id=job_post_id)
            questions_csv = request.FILES.get('questions_csv')

            if not questions_csv:
                return JsonResponse({'error': 'No CSV file uploaded.'}, status=400)

            # Process the CSV file
            csv_data = questions_csv.read().decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_data)

            # Save each question to the database
            for row in csv_reader:
                # Ensure the row has all necessary keys
                if not all(key in row for key in ['question', 'answer', 'difficulty', 'keywords']):
                    return JsonResponse({'error': 'Invalid CSV format. Missing required fields.'}, status=400)

                # Save the question to the database
                Question.objects.create(
                    job_post=job_post,
                    command_id=job_post.command_id,
                    question=row['question'],
                    answer=row.get('answer', None),  # Nullable field
                    difficulty=row['difficulty'],
                    keywords=json.loads(row['keywords'])  # Convert JSON string to dictionary
                )

            return JsonResponse({'message': 'CSV uploaded successfully!'}, status=200)

        except JobPost.DoesNotExist:
            return JsonResponse({'error': 'Job post not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


