# Generated by Django 3.2 on 2021-04-12 17:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_manager', '0005_auto_20210412_1634'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskhistory',
            name='is_parent_approve',
            field=models.BooleanField(default=False),
        ),
    ]