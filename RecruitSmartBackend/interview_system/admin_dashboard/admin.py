from django.contrib import admin
from .models import JobPost,Admin

# @admin.register(JobPost)
# class JobPostAdmin(admin.ModelAdmin):
#     list_display = ('title', 'created_at', 'is_active')
#     list_filter = ('is_active', 'created_at')
#     search_fields = ('title',)



admin.site.register(JobPost)

@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ('username', 'email')
