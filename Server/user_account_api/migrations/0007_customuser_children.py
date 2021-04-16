# Generated by Django 3.1.7 on 2021-04-10 16:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_account_api', '0006_customuser_student_no'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='children',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
