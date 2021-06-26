from django.db import models

# Create your models here.
from user_account_api.models import CustomUser, Subject

tab_count = 1

class TaskHistory(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    task = models.CharField(max_length=250)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    time_spent = models.CharField(max_length=20)
    spent_in_second = models.BigIntegerField()
    # task_remark = models.CharField(max_length=150, default='')
    remark = models.TextField()

    is_parent_approve = models.BooleanField(default=False)
    is_done_approve = models.BooleanField(default=False)

    change_tab_count = models.IntegerField(default=0)

    def __str__(self):
        return self.user.last_name + ', ' + self.user.first_name
    
