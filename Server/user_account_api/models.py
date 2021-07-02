from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

class CustomUser(AbstractUser):
    # Eto related sa pag login saka register
    # Dito makukuha yung mga task na current ginagawa ng student
    id = models.AutoField(primary_key=True)
    password_expiration = models.IntegerField(default=30)
    attempts = models.IntegerField(default=4)
    is_lock = models.DateTimeField(blank=True, null=True)
    
    student_no = models.CharField(max_length=150, default='1')
    children = models.ManyToManyField("self", blank=True)

    is_parent = models.BooleanField(default=False)
    is_approve_student = models.BooleanField(default=False)

    task_start_time = models.DateTimeField(blank=True, null=True)
    is_working = models.BooleanField(default=False)
    track_task = models.CharField(max_length=150, editable=False, blank=True, null=True)
    track_subject_id = models.IntegerField(default=-1)

    is_request = models.BooleanField(default=False)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE)

    page_visible = models.IntegerField(default=0, null=True, blank=True, editable=False)
    is_exceed = models.BooleanField(default=False)


class Subject(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subject = models.CharField(max_length=250)
    task_limit = models.DurationField(default=0, null=True)
    is_set_limit = models.BooleanField(default=False)

    def __str__(self):
        return self.subject
    
class PreviousPassword(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    old_password = models.CharField(max_length=250)
    date_change = models.DateTimeField(editable=False)

    def save(self, *args, **kwargs):
        self.date_change = timezone.now()
        return super(PreviousPassword, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.user)