from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

class CustomUser(AbstractUser):
    password_expiration = models.IntegerField(default=30)
    attempts = models.IntegerField(default=4)
    is_lock = models.DateTimeField(blank=True, null=True)

class PreviousPassword(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    old_password = models.CharField(max_length=250)
    date_change = models.DateTimeField(editable=False)

    def save(self, *args, **kwargs):
        self.date_change = timezone.now()
        return super(PreviousPassword, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.user)