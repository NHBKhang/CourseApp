from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import path
from django.db.models import Count
from django.template.response import TemplateResponse
from courses.models import *
from courses.forms import CourseForm
from oauth2_provider.models import *


class MyAdminSite(admin.AdminSite):
    site_header = 'iCourse'

    def get_urls(self):
        return [path('stats/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        stats = Category.objects.annotate(counter=Count('course__id')).values('id', 'name', 'counter')
        return TemplateResponse(request, 'stats.html', {
            'stats': stats,
            'title': "Stats"
        })


admin_site = MyAdminSite(name='iCourse')


class MyCourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_date', 'updated_date', 'active']
    search_fields = ['id', 'name']
    list_filter = ['created_date', 'name']
    readonly_fields = ['my_image']
    form = CourseForm

    def my_image(self, course):
        if course.image:
            if type(course.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{course.image.url}' />")
            return mark_safe(f"<img width='300' src='/static/{course.image.name}' />")

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


admin_site.register(Category)
admin_site.register(Course, MyCourseAdmin)
admin_site.register(Lesson)
admin_site.register(User)
admin_site.register(Tag)
admin_site.register(Comment)
admin_site.register(Like)
admin_site.register(Application)
admin_site.register(AccessToken)
admin_site.register(RefreshToken)
admin_site.register(Grant)
admin_site.register(IDToken)
