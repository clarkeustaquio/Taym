# Generated by Django 3.2 on 2021-04-12 18:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('task_manager', '0007_taskhistory_spent_in_seconds'),
    ]

    operations = [
        migrations.RenameField(
            model_name='taskhistory',
            old_name='spent_in_seconds',
            new_name='spent_in_second',
        ),
    ]
