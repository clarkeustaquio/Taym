# Generated by Django 3.2 on 2021-04-12 10:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_account_api', '0013_subjects'),
        ('task_manager', '0002_alter_taskhistory_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taskhistory',
            name='task',
        ),
        migrations.AddField(
            model_name='taskhistory',
            name='subject',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='user_account_api.subjects'),
            preserve_default=False,
        ),
    ]
