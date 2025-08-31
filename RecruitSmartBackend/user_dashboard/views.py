from django.http import JsonResponse
import random
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import evaluate_technical_answer
from .models import User
from django.db import models

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_dashboard.models import JobPost,Question,UsersResponses
from .serializers import JobPostSerializer



from difflib import SequenceMatcher

import urllib.parse
import os
from django.core.files.storage import FileSystemStorage

import os
import json
import spacy
import PyPDF2
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import api_view  
from expert_dashboard.models import InterviewSchedule
from django.contrib.auth.decorators import login_required

@api_view(['GET'])
def get_user_profile(request):
    """
    API to fetch user profile details based on email (gmail).
    """
    try:
        # Get the 'gmail' parameter from the request
        gmail = request.GET.get('gmail', None)

        if not gmail:
            return Response(
                {"error": "Email (gmail) parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the user from the database
        user = User.objects.get(email=gmail)

        # Construct the response data
        user_data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "mobile_number": getattr(user, "mobile_number", "Not Provided"),
        }

        return Response(user_data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response(
            {"error": "User not found for the given email."},
            status=status.HTTP_404_NOT_FOUND,
        )

    except Exception as e:
        return Response(
            {"error": "An error occurred while fetching the user profile.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

class ResumeUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        if 'resume' not in request.FILES:
            return Response({'error': 'No resume file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        resume_file = request.FILES['resume']
        
        # Save the uploaded file
        file_path = os.path.join(settings.MEDIA_ROOT, resume_file.name)
        with open(file_path, 'wb+') as destination:
            for chunk in resume_file.chunks():
                destination.write(chunk)
        
        # Extract text from PDF
        extracted_text = self.extract_text_from_pdf(file_path)
        
        # Parse resume
        resume_data = self.parse_resume(extracted_text)
        
        # Generate interview questions
        interview_questions = self.generate_interview_questions(resume_data)

        command_id = kwargs.get('command_id')  # Get command_id from URL parameters
        print(command_id)

        job_post = JobPost.objects.filter(command_id=command_id).first()


        if not job_post:
            # If no existing JobPost is found, create a new one
            job_post = JobPost.objects.create(
                title="Default Title",  # You can set a default title or leave it blank
                description="Default Description",  # Set a default description or leave it blank
                command_id=command_id  # Store the command_id if needed
            )


        for question_text in interview_questions:
            expected_answer, keywords = self.generate_expected_answer_and_keywords(question_text, resume_data)
            Question.objects.create(
                job_post=job_post,  # Set to None or link to a specific JobPost if needed
                command_id=command_id,
                question=question_text,
                answer=expected_answer,  # Set answer to None
                difficulty='Easy',  # Set a default difficulty or modify as needed
                keywords=keywords  # Set keywords to None
            )

        
        # Clean up temporary file
        os.remove(file_path)


        return Response({'message': 'Resume uploaded successfully!'}, status=status.HTTP_200_OK)
    
    import json

    def generate_expected_answer_and_keywords(self, question_text, resume_data):
        """
        Generate expected answer and keywords based on the question and resume data.

        Args:
        - question_text (str): The interview question text.
        - resume_data (dict): The parsed resume data containing skills, education, and experience.

        Returns:
        - tuple: (expected_answer, keywords_json)
        """
        expected_answer = ""
        keywords = {
            "concepts": [],
            "best_practices": [],
            "implementation": [],
            "technical_terms": []
        }

        # Analyze the question to determine the expected answer
        if "experience" in question_text.lower():
            # Generate an answer based on the experience section
            if resume_data['experience']:
                expected_answer = "I have experience in " + ", ".join(resume_data['experience']) + "."
                keywords["concepts"].extend([exp.lower() for exp in resume_data['experience']])
            else:
                expected_answer = "I have relevant experience in my previous roles."
        
        elif "skill" in question_text.lower() or "proficient" in question_text.lower():
            # Generate an answer based on the skills section
            if resume_data['skills']:
                expected_answer = "I am proficient in " + ", ".join(resume_data['skills']) + "."
                keywords["technical_terms"].extend([skill.lower() for skill in resume_data['skills']])
            else:
                expected_answer = "I have developed various skills through my education and projects."

        elif "education" in question_text.lower():
            # Generate an answer based on the education section
            if resume_data['education']:
                expected_answer = "I graduated with a " + ", ".join(resume_data['education']) + "."
                keywords["concepts"].extend([edu.lower() for edu in resume_data['education']])
            else:
                expected_answer = "I have completed my education and am eager to apply my knowledge."

        else:
            # Default answer if the question does not match known patterns
            expected_answer = "I am eager to discuss my qualifications and how they relate to this position."

        # Example of adding best practices and implementation terms
        # This is just a placeholder; you can modify it based on your actual logic
        if "decision tree" in question_text.lower():
            keywords["best_practices"].extend(["pruning", "depth control", "parameter tuning"])
            keywords["implementation"].extend(["gini index", "entropy"])

        # Convert keywords to JSON format
        keywords_json = json.dumps(keywords)

        return expected_answer, keywords_json
    def extract_text_from_pdf(self, file_path):
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()
        return text
    
    def parse_resume(self, text):
        nlp = spacy.load('en_core_web_sm')
        doc = nlp(text)
        
        resume_data = {
            'skills': self.extract_skills(text),
            'education': self.extract_education(text),
            'experience': self.extract_experience(text),
            'contact_info': self.extract_contact_info(text)
        }
        
        return resume_data
    
    def extract_skills(self, text):
        # Custom skill extraction logic
        skill_keywords = [
            'Python', 'Django', 'React', 'JavaScript', 
            'Machine Learning', 'Data Analysis', 
            'SQL', 'Docker', 'AWS', 'Git'
        ]
        
        found_skills = [skill for skill in skill_keywords if skill.lower() in text.lower()]
        return found_skills
    
    def extract_education(self, text):
        # Basic education extraction
        education_patterns = [
            'Bachelor', 'Master', 'PhD', 'Degree', 
            'University', 'College', 'Graduate'
        ]
        
        education_lines = [
            line.strip() for line in text.split('\n') 
            if any(pattern.lower() in line.lower() for pattern in education_patterns)
        ]
        
        return education_lines[:3]  # Limit to top 3 education entries
    
    def extract_experience(self, text):
        # Basic work experience extraction
        experience_patterns = [
            'Experience', 'Worked', 'Employment', 
            'Job', 'Position', 'Company'
        ]
        
        experience_lines = [
            line.strip() for line in text.split('\n') 
            if any(pattern.lower() in line.lower() for pattern in experience_patterns)
        ]
        
        return experience_lines[:3]  # Limit to top 3 experience entries
    
    def extract_contact_info(self, text):
        # Basic contact info extraction
        import re
        
        email = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        phone = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)
        
        return {
            'email': email[0] if email else '',
            'phone': phone[0] if phone else ''
        }
    
    def generate_interview_questions(self, resume_data):
        questions = []
        
        # Skills-based questions
        for skill in resume_data.get('skills', []):
            skill_questions = {
                'Python': [
                    f"Can you explain your experience with {skill}?",
                    f"What advanced {skill} techniques have you used in your projects?"
                ],
                'Django': [
                    "How do you handle database migrations in Django?",
                    "Explain Django's ORM and its advantages."
                ],
                'React': [
                    "What are the key differences between class and functional components?",
                    "How do you manage state in large React applications?"
                ]
            }.get(skill, [f"Tell me about your experience with {skill}."])
            
            questions.extend(skill_questions)
        
        # Experience-based questions
        for exp in resume_data.get('experience', []):
            questions.append(f"Can you elaborate on your role at {exp}?")
        
        # Education-based questions
        for edu in resume_data.get('education', []):
            questions.append(f"How has your education in {edu} prepared you for this role?")
        
        # Generic technical and behavioral questions
        generic_questions = [
            "Describe a challenging project you've worked on.",
            "How do you stay updated with the latest technology trends?",
            "Tell me about a time you solved a complex technical problem."
        ]
        
        questions.extend(generic_questions)
        
        return questions[:5]  # Limit to 10 questions




@csrf_exempt
def submit_response(request):
    if request.method == "POST":
        try:
            print("Request received:", request.body)  # Debugging input
            data = json.loads(request.body)
            question_id = data.get("question_id")
            user_answer = data.get("user_answer")
            email=data.get("user_email")

            if not question_id or not user_answer:
                return JsonResponse({"error": "Invalid input."}, status=400)

            question = Question.objects.get(id=question_id)
            print("Question retrieved:", question)  # Debugging question retrieval

            # Placeholder for score calculation logic
              # Replace with your logic
            keywords = question.keywords

            score = evaluate_technical_answer(
                question=question.question,
                expected_answer=question.answer,
                candidate_answer=user_answer,
                keywords=keywords
            )
            print("Calculated score:", score)  # Debugging score calculation
            response = UsersResponses.objects.create(
                question_id=question,
                command_id=question.command_id,
                user_email=email,
                user_answer=user_answer,
                original_answer=question.answer,
                score=score,
            )
            print("Response created:", response)  # Debugging response creation

            return JsonResponse({"message": "Response submitted successfully!", "score": float(score)})

        except Question.DoesNotExist:
            return JsonResponse({"error": "Question not found."}, status=404)
        except Exception as e:
            print("Error:", str(e))  # Print the exact error
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)



# class JobPostListView(APIView):
#     def get(self, request):
#         try:
#             # Fetch active job posts only
#             gmail = request.query_params.get('gmail')
#             if not gmail:
#                 return Response({"error": "Gmail is required"}, status=status.HTTP_400_BAD_REQUEST)
#             print(f"Received Gmail: {gmail}")
            
#             scheduled_job_ids = InterviewSchedule.objects.filter(user_gmail=gmail).values_list('job_id', flat=True)
#             scheduled_job_ids_list = [str(job_id) for job_id in scheduled_job_ids]
#             print(scheduled_job_ids_list)
#             active_jobs = JobPost.objects.filter(command_id__in=scheduled_job_ids_list,is_active=True).order_by('-created_at')
#             print(active_jobs)
#             if not active_jobs.exists():
#                 print("No active Jobs")
#                 return Response({"message": "No jobs are available."}, status=status.HTTP_404_NOT_FOUND)
            
#             # Serialize the data
#             serializer = JobPostSerializer(active_jobs, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.db.models import CharField, Value as V
from django.db.models.functions import Cast

class JobPostListView(APIView):
    def get(self, request):
        try:
            gmail = request.query_params.get('gmail')
            if not gmail:
                return Response({"error": "Gmail is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch scheduled job IDs for the user
            scheduled_jobs = InterviewSchedule.objects.filter(user_gmail=gmail).values_list('job_id', flat=True)
            # print("Scheduled Jobs:", list(scheduled_jobs))  # Debug log

            if not scheduled_jobs:
                return Response({"message": "No jobs available for this user."}, status=status.HTTP_404_NOT_FOUND)

            # Ensure both fields are treated as strings for the query
            scheduled_jobs = list(scheduled_jobs)  # Convert queryset to a list
            active_jobs = (
                JobPost.objects
                .annotate(command_id_str=Cast('command_id', output_field=CharField()))
                .filter(command_id_str__in=scheduled_jobs, is_active=True)
                .order_by('-created_at')
            )
            #print("Active Jobs Query:", active_jobs.query)  # Debug log

            if not active_jobs.exists():
                return Response({"message": "No active jobs available."}, status=status.HTTP_404_NOT_FOUND)

            response_data = []
            for job in active_jobs:
                # Fetch schedule for the current job
                schedule = InterviewSchedule.objects.filter(user_gmail=gmail, job_id=job.command_id).first()
                print("Schedule for Job:", job.command_id, schedule)  # Debug log

                response_data.append({
                    "id": job.id,
                    "title": job.title,
                    "description": job.description,
                    "command_id": job.command_id,
                    "created_at": job.created_at,
                    "scheduled_time": schedule.scheduled_time if schedule else None,
                })

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error Occurred: {e}")  # Debug log for exception
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





from django.core.exceptions import ObjectDoesNotExist

def fetch_next_question(request):
    try:
        command_id = request.GET.get('command_id')
        current_question_id = request.GET.get('current_question_id')

        if not command_id:
            return JsonResponse({"error": "Command ID is required."}, status=400)

        questions = Question.objects.filter(command_id=command_id)  # Filter by command_id

        if current_question_id:
            next_question = questions.filter(id__gt=current_question_id).order_by('id').first()
        else:
            next_question = questions.order_by('id').first()

        if not next_question:
            return JsonResponse({"message": "No more questions available."}, status=200)

        return JsonResponse({
            "id": next_question.id,
            "question": next_question.question,
            "difficulty": next_question.difficulty,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)







@csrf_exempt
def user_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse JSON body  
            first_name = data.get("firstName")
            last_name = data.get("lastName")
            mobile_number = data.get("mobileNumber")
            email = data.get("email")
            password = data.get("password")
            confirm_password = data.get("confirmPassword")

            # Check if all required fields are present
            if not all([first_name, last_name, mobile_number, email, password, confirm_password]):
                return JsonResponse({"error": "All fields are required."}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)

            # Check if the email already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered."}, status=400)

            # Create the user
            User.objects.create(
                first_name=first_name,
                last_name=last_name,
                mobile_number=mobile_number,
                email=email,
                password=password,
            )

            return JsonResponse({"message": "Signup successful!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)







@csrf_exempt
def user_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            email = data.get("email")
            password = data.get("password")

            # Validate input
            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            # Check if the user exists
            try:
                user = User.objects.get(email=email)
                if user.password != password:  # Ideally, use a password hashing mechanism
                    return JsonResponse({"error": "Invalid email or password."}, status=401)
            except User.DoesNotExist:
                return JsonResponse({"error": "Invalid email or password."}, status=401)

            # Login successful
            return JsonResponse({"message": "Login successful!","username": user.email}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

